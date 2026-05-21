/**
 * Elimina PNG duplicados en public/escudos-processed/ (mismo contenido = mismo escudo).
 * Conserva el de menor clubId por grupo y actualiza .manifest.json.
 */
import { createHash } from 'node:crypto';
import { readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/escudos-processed');
const manifestPath = path.join(outDir, '.manifest.json');

async function loadManifest() {
  try {
    return JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch {
    return {};
  }
}

async function main() {
  const dryRun = process.env.DRY_RUN === '1';
  const files = (await readdir(outDir)).filter((f) => /^\d+\.png$/i.test(f));
  const byHash = new Map();

  for (const file of files) {
    const clubId = Number(file.replace(/\.png$/i, ''));
    const buf = await readFile(path.join(outDir, file));
    const hash = createHash('md5').update(buf).digest('hex');
    if (!byHash.has(hash)) byHash.set(hash, []);
    byHash.get(hash).push(clubId);
  }

  const manifest = await loadManifest();
  const toDelete = [];

  for (const ids of byHash.values()) {
    ids.sort((a, b) => a - b);
    const [, ...dupes] = ids;
    toDelete.push(...dupes);
  }

  if (toDelete.length === 0) {
    console.log('No hay duplicados por contenido.');
    return;
  }

  console.log(
    `${dryRun ? '[dry-run] ' : ''}Se ${dryRun ? 'borrarían' : 'borran'} ${toDelete.length} PNG (${files.length} → ${files.length - toDelete.length} únicos).`,
  );

  for (const clubId of toDelete) {
    const filePath = path.join(outDir, `${clubId}.png`);
    if (!dryRun) {
      await unlink(filePath);
      delete manifest[String(clubId)];
    }
    console.log(`  - ${clubId}.png`);
  }

  if (!dryRun) {
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('Manifest actualizado.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
