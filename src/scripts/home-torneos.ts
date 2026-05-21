import { getAgrupadoresDeTorneo } from '@lib/api-client';
import {
  renderHeroAgrupadoresHtml,
  renderHeroStatsHtml,
  renderTorneosSectionHtml,
} from '@lib/render/torneos';
import { errorBoxHtml } from '@lib/ui-html';

async function loadTorneos(): Promise<void> {
  const torneosRoot = document.getElementById('torneos-root');
  const heroNav = document.getElementById('hero-agrupadores-nav');
  const heroStats = document.getElementById('hero-stats');

  try {
    const agrupadores = await getAgrupadoresDeTorneo();

    if (torneosRoot) {
      torneosRoot.innerHTML = renderTorneosSectionHtml(agrupadores);
    }
    if (heroNav) {
      heroNav.innerHTML = renderHeroAgrupadoresHtml(agrupadores);
    }
    if (heroStats) {
      heroStats.innerHTML = renderHeroStatsHtml(agrupadores);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Ocurrió un error inesperado al cargar los torneos';
    if (torneosRoot) {
      torneosRoot.innerHTML = errorBoxHtml(message);
    }
  }
}

loadTorneos();
