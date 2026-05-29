import type { SponsorWebPublica } from '@types/sponsor';
import { escudoUrl, escapeHtml } from '@lib/html-utils';

function sponsorLogoItem(
  sponsor: SponsorWebPublica,
  alt: string,
  clone = false,
): string {
  const src = escudoUrl(sponsor.logoUrl);
  if (!src) return '';

  return `<div class="sponsors-logo${clone ? ' sponsors-logo--clone' : ''}"${clone ? ' aria-hidden="true"' : ''}>
    <img
      src="${escapeHtml(src)}"
      alt="${escapeHtml(alt)}"
      width="340"
      height="96"
      loading="eager"
      decoding="async"
    />
  </div>`;
}

export function renderSponsorsMarqueeHtml(sponsors: SponsorWebPublica[]): string {
  const items = sponsors
    .map((sponsor) => sponsorLogoItem(sponsor, sponsor.nombre))
    .join('');
  const clones = sponsors
    .map((sponsor) => sponsorLogoItem(sponsor, '', true))
    .join('');

  return `<div class="sponsors-track">${items}${clones}</div>`;
}
