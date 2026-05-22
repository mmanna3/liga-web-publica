import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { escudoUrl, getEscudosDeClubes } from '@lib/api';
import { assetUrl } from '@lib/paths';
import type { EscudoClub } from '@types/club';

export type EscudoClubDisplay = EscudoClub & {
  imgSrc: string;
};

const PROCESSED_DIR = path.join(process.cwd(), 'public/escudos-processed');

async function listProcessedClubIds(): Promise<number[]> {
  try {
    const files = await readdir(PROCESSED_DIR);
    return files
      .map((file) => /^(\d+)\.png$/i.exec(file)?.[1])
      .filter((id): id is string => id != null)
      .map((id) => Number(id));
  } catch {
    return [];
  }
}

/** Solo escudos con PNG en public/escudos-processed/ (sin fallback al backend). */
export async function getEscudosProcesadosParaUi(): Promise<EscudoClubDisplay[]> {
  const processedIds = await listProcessedClubIds();
  if (processedIds.length === 0) return [];

  let fromApi: EscudoClub[] = [];
  try {
    fromApi = await getEscudosDeClubes();
  } catch {
    fromApi = [];
  }

  const byId = new Map(fromApi.map((club) => [club.clubId, club]));
  const seenHashes = new Set<string>();
  const result: EscudoClubDisplay[] = [];

  for (const clubId of processedIds.sort((a, b) => a - b)) {
    const filePath = path.join(PROCESSED_DIR, `${clubId}.png`);
    const buffer = await readFile(filePath);
    const hash = createHash('md5').update(buffer).digest('hex');
    if (seenHashes.has(hash)) continue;
    seenHashes.add(hash);

    const meta = byId.get(clubId);
    result.push({
      clubId,
      nombre: meta?.nombre ?? `Club ${clubId}`,
      escudo: meta?.escudo ?? '',
      imgSrc: assetUrl(`escudos-processed/${clubId}.png`),
    });
  }

  return result.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

/** Escudos desde el backend (ruta relativa en `escudo` → URL absoluta). */
export async function getEscudosDeApiParaUi(): Promise<EscudoClubDisplay[]> {
  let fromApi: EscudoClub[] = [];
  try {
    fromApi = await getEscudosDeClubes();
  } catch {
    return [];
  }

  return fromApi
    .filter((club) => club.escudo.trim())
    .map((club) => ({
      ...club,
      imgSrc: escudoUrl(club.escudo),
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}
