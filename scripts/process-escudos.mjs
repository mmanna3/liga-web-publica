/**
 * Quita el fondo de los escudos en build time y los guarda en public/escudos-processed/.
 * Usa @imgly/background-removal-node (equivalente Node de @imgly/background-removal).
 */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { removeBackground } from '@imgly/background-removal-node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public/escudos-processed');
const manifestPath = path.join(outDir, '.manifest.json');

const CARNET_DIGITAL_SUFFIX = /\/api\/carnet-digital\/?$/;
const CONCURRENCY = 2;

function getApiOrigin() {
  const explicit = process.env.API_ORIGIN;
  if (explicit) return explicit.replace(/\/$/, '');
  const base = process.env.API_BASE_URL ?? 'https://admin.edefi.com.ar/api/carnet-digital';
  return base.replace(CARNET_DIGITAL_SUFFIX, '').replace(/\/$/, '');
}

function escudoAbsoluteUrl(escudoRelativo) {
  const rel = escudoRelativo.startsWith('/') ? escudoRelativo : `/${escudoRelativo}`;
  return `${getApiOrigin()}${rel}`;
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadManifest() {
  try {
    const raw = await readFile(manifestPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function fetchEscudos() {
  const url = `${getApiOrigin()}/api/publico/escudos-clubes`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`escudos-clubes respondió ${response.status}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('escudos-clubes no devolvió un array');
  }
  return data;
}

async function processClub(club, config) {
  const outPath = path.join(outDir, `${club.clubId}.png`);
  const imageUrl = escudoAbsoluteUrl(club.escudo);
  const blob = await removeBackground(imageUrl, config);
  const buffer = Buffer.from(await blob.arrayBuffer());
  await writeFile(outPath, buffer);
}

async function runPool(items, worker, concurrency) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (item) await worker(item);
      }
    }),
  );
}

async function main() {
  if (process.env.SKIP_ESCUDOS_PROCESS === '1') {
    console.log('SKIP_ESCUDOS_PROCESS=1 — omitiendo procesamiento de escudos.');
    return;
  }

  await mkdir(outDir, { recursive: true });

  const force = process.env.FORCE_ESCUDOS === '1';
  const manifest = force ? {} : await loadManifest();
  const escudos = await fetchEscudos();

  const config = {
    model: 'small',
    debug: process.env.ESCUDOS_DEBUG === '1',
    output: { format: 'image/png', quality: 0.92 },
    progress: (key, current, total) => {
      if (process.env.ESCUDOS_DEBUG === '1') {
        console.log(`  ${key}: ${current}/${total}`);
      }
    },
  };

  const pending = [];
  for (const club of escudos) {
    const outPath = path.join(outDir, `${club.clubId}.png`);
    const cached = manifest[String(club.clubId)] === club.escudo && (await fileExists(outPath));
    if (!force && cached) continue;
    pending.push(club);
  }

  console.log(
    `Escudos: ${escudos.length} total, ${pending.length} a procesar (${escudos.length - pending.length} en caché).`,
  );

  if (pending.length === 0) return;

  let done = 0;
  await runPool(
    pending,
    async (club) => {
      const label = `${club.clubId} — ${club.nombre}`;
      try {
        console.log(`[${++done}/${pending.length}] ${label}`);
        await processClub(club, config);
        manifest[String(club.clubId)] = club.escudo;
      } catch (error) {
        console.error(`Error en ${label}:`, error instanceof Error ? error.message : error);
      }
    },
    CONCURRENCY,
  );

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Listo. Escudos en public/escudos-processed/');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
