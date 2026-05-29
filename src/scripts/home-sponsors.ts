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

    marqueeRoot.innerHTML = renderSponsorsMarqueeHtml(sponsors);
    section.hidden = false;
  } catch (error) {
    console.error('[sponsors] No se pudieron cargar los sponsors:', error);
    section.hidden = true;
  }
}

void loadSponsors();
