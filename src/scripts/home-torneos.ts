import { getAgrupadoresDeTorneo } from '@lib/api-client';
import {
  renderHeroAgrupadoresHtml,
  renderHeroStatsHtml,
  renderTorneosSectionHtml,
} from '@lib/render/torneos';
import { errorBoxHtml } from '@lib/ui-html';

function scrollToHashTarget(): void {
  const hash = window.location.hash;
  if (!hash) return;

  const target = document.querySelector(hash);
  if (target) {
    target.scrollIntoView({ block: 'start' });
  }
}

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

    scrollToHashTarget();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Ocurrió un error inesperado al cargar los torneos';
    if (torneosRoot) {
      torneosRoot.innerHTML = errorBoxHtml(message);
    }
  }
}

loadTorneos();
