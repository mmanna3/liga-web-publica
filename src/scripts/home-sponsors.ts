import { getSponsorsWebPublica } from '@lib/api-client';
import { renderSponsorsMarqueeHtml } from '@lib/render/sponsors';

const PX_PER_SECOND = 55;

async function waitForImages(container: ParentNode): Promise<void> {
  const images = container.querySelectorAll('img');

  await Promise.all(
    [...images].map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        }),
    ),
  );
}

function tileSetToMinWidth(set: HTMLElement, unitHtml: string, minWidth: number): void {
  while (set.scrollWidth < minWidth) {
    set.insertAdjacentHTML('beforeend', unitHtml);
  }
}

function setupSeamlessMarquee(marqueeRoot: HTMLElement): void {
  const track = marqueeRoot.querySelector('.sponsors-track');
  const firstSet = marqueeRoot.querySelector('.sponsors-set');
  const secondSet = marqueeRoot.querySelector('.sponsors-set + .sponsors-set');

  if (!(track instanceof HTMLElement) || !(firstSet instanceof HTMLElement) || !(secondSet instanceof HTMLElement)) {
    return;
  }

  const unitHtml = firstSet.innerHTML;
  const minWidth = marqueeRoot.clientWidth + 1;

  tileSetToMinWidth(firstSet, unitHtml, minWidth);
  secondSet.innerHTML = firstSet.innerHTML;

  // Fuerza reflow para que el ancho refleje imágenes ya cargadas.
  const loopWidth = firstSet.getBoundingClientRect().width;
  if (loopWidth <= 0) return;

  const durationSec = Math.max(28, loopWidth / PX_PER_SECOND);

  track.style.setProperty('--sponsors-loop-width', `${loopWidth}px`);
  track.style.setProperty('--sponsors-duration', `${durationSec}s`);
  track.classList.add('sponsors-track--active');
}

async function loadSponsors(): Promise<void> {
  const section = document.getElementById('sponsors-section');
  const marqueeRoot = document.getElementById('sponsors-marquee-root');

  if (!section || !marqueeRoot) return;

  try {
    const sponsors = await getSponsorsWebPublica();

    if (sponsors.length === 0) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    marqueeRoot.innerHTML = renderSponsorsMarqueeHtml(sponsors);

    await waitForImages(marqueeRoot);
    setupSeamlessMarquee(marqueeRoot);
    marqueeRoot.setAttribute('aria-busy', 'false');
  } catch (error) {
    console.error('[sponsors] No se pudieron cargar los sponsors:', error);
    section.hidden = true;
  }
}

void loadSponsors();
