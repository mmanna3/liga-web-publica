import { getAgrupadorTheme } from '@lib/colors';
import { renderClubesHtml } from '@lib/render/clubes';
import { renderFixtureEdHtml } from '@lib/render/fixture-ed';
import { renderFixtureTctHtml } from '@lib/render/fixture-tct';
import {
  cardFechaJornadasHtml,
  renderJornadasHtml,
  renderJornadasSelectorHtml,
} from '@lib/render/jornadas';
import { renderPosicionesHtml } from '@lib/render/posiciones';
import { escapeHtml } from '@lib/html-utils';
import { homeUrl } from '@lib/paths-client';
import { indiceUltimaFechaConResultados } from '@lib/jornadas-utils';
import { fetchZonaDetalle, getSeccionesVisibles, parseZonaPageParams } from '@lib/zona-data';
import { errorBoxHtml, iconSvg, loadingSkeletonHtml, renderZonaSectionNavLink, sectionErrorHtml, zonaSectionIcon } from '@lib/ui-html';
import type { FechasParaJornadasDTO, ZonaDetalleData, ZonaSectionId } from '@types/zona-detalle';

function renderSectionContent(
  id: ZonaSectionId,
  data: ZonaDetalleData,
  tipoDeFase: string,
): string {
  if (data.errors[id]) {
    return sectionErrorHtml(data.errors[id]!);
  }

  switch (id) {
    case 'posiciones':
      return renderPosicionesHtml(data.posiciones);
    case 'fixture':
      return tipoDeFase === 'EliminacionDirecta'
        ? renderFixtureEdHtml(data.eliminacionDirecta)
        : renderFixtureTctHtml(data.fixture);
    case 'jornadas':
      return renderJornadasHtml(data.jornadas);
    case 'clubes':
      return renderClubesHtml(data.clubes);
    default:
      return '';
  }
}

function initJornadasSelector(
  fechas: FechasParaJornadasDTO[],
  chipColorClass: string,
): void {
  const section = document.getElementById('zona-jornadas');
  if (!section || fechas.length === 0) return;

  let indiceActivo = indiceUltimaFechaConResultados(fechas);

  const render = () => {
    const content = document.getElementById('jornadas-content');
    if (!content) return;
    content.innerHTML = `${renderJornadasSelectorHtml(fechas, indiceActivo, chipColorClass)}
      ${cardFechaJornadasHtml(fechas[indiceActivo])}`;

    content.querySelectorAll('.jornada-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number((btn as HTMLElement).dataset.index);
        if (Number.isFinite(idx)) {
          indiceActivo = idx;
          render();
        }
      });
    });
  };

  render();
}

function setActiveSectionNav(sectionId: string): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-zona-nav-link]').forEach((link) => {
    const active = link.dataset.section === sectionId;
    link.classList.toggle('is-active', active);
    link.toggleAttribute('aria-current', active);
  });
}

function initSectionNav(sectionIds: ZonaSectionId[]): void {
  const nav = document.getElementById('zona-section-nav');
  if (!nav) return;

  nav.querySelectorAll<HTMLAnchorElement>('[data-zona-nav-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href) return;
      const sectionId = link.dataset.section;
      if (sectionId) setActiveSectionNav(sectionId);
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const sections = sectionIds
    .map((id) => document.getElementById(`zona-${id}`))
    .filter((el): el is HTMLElement => el != null);

  if (sections.length === 0) return;

  const visibleSections = new Map<Element, IntersectionObserverEntry>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target, entry);
        } else {
          visibleSections.delete(entry.target);
        }
      });

      if (visibleSections.size === 0) return;

      const topmost = [...visibleSections.values()].sort(
        (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
      )[0];
      const id = topmost.target.id.replace('zona-', '');
      setActiveSectionNav(id);
    },
    {
      rootMargin: '-25% 0px -40% 0px',
      threshold: [0, 0.1, 0.25, 0.5],
    },
  );

  sections.forEach((section) => observer.observe(section));
  setActiveSectionNav(sectionIds[0]);
}

async function loadZonaDetalle(): Promise<void> {
  const params = parseZonaPageParams(new URLSearchParams(window.location.search));
  const root = document.getElementById('zona-root');

  if (!params || !root) {
    if (root) {
      root.innerHTML = errorBoxHtml('Parámetros de zona inválidos o incompletos.');
    }
    return;
  }

  const theme = getAgrupadorTheme(params.color);
  const secciones = getSeccionesVisibles(params.tipoDeFase);

  if (root) {
    root.style.setProperty('--zona-accent', theme.accentColor);
  }

  const titleEl = document.getElementById('zona-page-title');
  if (titleEl) {
    titleEl.textContent = `${params.zonaNombre} · ${params.torneoNombre}`;
  }

  const breadcrumbEl = document.getElementById('zona-breadcrumb');
  if (breadcrumbEl) {
    breadcrumbEl.innerHTML = `
      <a href="${escapeHtml(homeUrl())}" class="text-zinc-500 transition-colors hover:text-white">Inicio</a>
      <span class="text-zinc-600">/</span>
      <a href="${escapeHtml(homeUrl(`agrupador-${params.agrupadorId}`))}" class="text-zinc-500 transition-colors hover:text-white">${escapeHtml(params.agrupadorNombre || params.torneoNombre)}</a>
      <span class="text-zinc-600">/</span>
      <span class="${theme.accent}">${escapeHtml(params.faseNombre)} · ${escapeHtml(params.zonaNombre)}</span>`;
  }

  const resumenEl = document.getElementById('zona-resumen');
  if (resumenEl) {
    resumenEl.innerHTML = `
      <p class="text-xs font-bold tracking-[0.3em] uppercase ${theme.accent}">Zona</p>
      <h1 class="font-display mt-2 text-4xl tracking-wide text-white uppercase sm:text-5xl">${escapeHtml(params.zonaNombre)}</h1>
      <p class="mt-2 text-zinc-400">${escapeHtml(params.torneoNombre)} · ${escapeHtml(params.faseNombre)}</p>`;
  }

  const navEl = document.getElementById('zona-section-nav');
  if (navEl) {
    navEl.innerHTML = secciones
      .map((s) => renderZonaSectionNavLink(s.id, s.titulo, theme))
      .join('');
  }

  root.innerHTML = secciones
    .map(
      (s) => `<section id="zona-${s.id}" class="scroll-mt-32">
        <div class="mb-4 flex items-center gap-2">
          ${iconSvg(zonaSectionIcon(s.id), 'h-5 w-5 -translate-y-0.5 ' + theme.accent)}
          <h2 class="font-display text-2xl tracking-wide text-white uppercase">${escapeHtml(s.titulo)}</h2>
        </div>
        <div class="glass rounded-2xl border border-white/10 p-4 sm:p-6" id="zona-content-${s.id}">
          ${loadingSkeletonHtml(4)}
        </div>
      </section>`,
    )
    .join('');

  initSectionNav(secciones.map((s) => s.id));

  try {
    const data = await fetchZonaDetalle(params.zonaId, params.tipoDeFase);

    for (const seccion of secciones) {
      const contentEl = document.getElementById(`zona-content-${seccion.id}`);
      if (!contentEl) continue;

      if (seccion.id === 'jornadas' && data.jornadas?.fechas?.length) {
        const fechas = data.jornadas.fechas;
        const indice = indiceUltimaFechaConResultados(fechas);
        contentEl.innerHTML = `<div id="jornadas-content">${renderJornadasSelectorHtml(fechas, indice, theme.chipActive)}${cardFechaJornadasHtml(fechas[indice])}</div>`;
        initJornadasSelector(fechas, theme.chipActive);
      } else {
        contentEl.innerHTML = renderSectionContent(seccion.id, data, params.tipoDeFase);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado al cargar la zona';
    root.innerHTML = errorBoxHtml(message);
  }
}

loadZonaDetalle();
