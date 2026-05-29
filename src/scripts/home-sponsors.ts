import { getSponsorsWebPublica } from '@lib/api-client';
import { renderSponsorsMarqueeHtml } from '@lib/render/sponsors';

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
    marqueeRoot.setAttribute('aria-busy', 'false');

    const images = marqueeRoot.querySelectorAll('img');
    images.forEach((img) => {
      img.loading = 'eager';
    });
    await Promise.all(
      [...images].map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.addEventListener('load', () => resolve(), { once: true });
              img.addEventListener('error', () => resolve(), { once: true });
            }),
      ),
    );
  } catch (error) {
    console.error('[sponsors] No se pudieron cargar los sponsors:', error);
    section.hidden = true;
  }
}

void loadSponsors();
