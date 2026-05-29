import type { SponsorWebPublica } from '@types/sponsor';
import { sponsorLogoUrl, escapeHtml } from '@lib/html-utils';

function sponsorLogoItem(sponsor: SponsorWebPublica): string {
  if (!Number.isFinite(sponsor.id) || sponsor.id <= 0) return '';

  const src = sponsorLogoUrl(sponsor.id);

  return `<div class="sponsors-logo">
    <img
      src="${escapeHtml(src)}"
      alt="${escapeHtml(sponsor.nombre)}"
      width="340"
      height="96"
      loading="eager"
      decoding="async"
    />
  </div>`;
}

function renderSponsorsSet(sponsors: SponsorWebPublica[]): string {
  return sponsors.map((sponsor) => sponsorLogoItem(sponsor)).join('');
}

export function renderSponsorsMarqueeHtml(sponsors: SponsorWebPublica[]): string {
  const setHtml = renderSponsorsSet(sponsors);

  return `<div class="sponsors-track">
    <div class="sponsors-set">${setHtml}</div>
    <div class="sponsors-set" aria-hidden="true">${setHtml}</div>
  </div>`;
}
