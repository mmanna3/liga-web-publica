import type { IconName } from '@types/icon';

type PathShape = {
  type: 'path';
  d: string;
  linecap?: 'round' | 'butt' | 'square';
  linejoin?: 'round' | 'miter' | 'bevel';
};

type CircleShape = {
  type: 'circle';
  cx: number;
  cy: number;
  r: number;
};

export type IconShape = PathShape | CircleShape;

const icons: Record<IconName, IconShape[]> = {
  trophy: [
    {
      type: 'path',
      linecap: 'round',
      linejoin: 'round',
      d: 'M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4zM17 4h2a1 1 0 011 1v1a3 3 0 01-3 3h-1M7 4H5a1 1 0 00-1 1v1a3 3 0 003 3h1',
    },
  ],
  ball: [
    { type: 'circle', cx: 12, cy: 12, r: 9 },
    { type: 'path', linejoin: 'round', d: 'M12 7l4.76 3.45-1.76 5.55h-6l-1.76-5.55z' },
    {
      type: 'path',
      linecap: 'round',
      linejoin: 'round',
      d: 'M12 7V3m3 13l2.5 3m-.74-8.55l3.74-1.45m-11.44 7.05-2.56 2.95m.74-8.55-3.74-1.45',
    },
  ],
  users: [
    {
      type: 'path',
      linecap: 'round',
      linejoin: 'round',
      d: 'M17 20h5v-2a4 4 0 00-5-3.87M9 20H2v-2a4 4 0 015-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0zM23 20v-2a4 4 0 00-3-3.87M1 20v-2a4 4 0 013-3.87',
    },
  ],
  layers: [
    {
      type: 'path',
      linecap: 'round',
      linejoin: 'round',
      d: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    },
  ],
  'map-pin': [
    {
      type: 'path',
      linecap: 'round',
      linejoin: 'round',
      d: 'M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z',
    },
    { type: 'circle', cx: 12, cy: 10, r: 2.5 },
  ],
  grid: [
    {
      type: 'path',
      linecap: 'round',
      linejoin: 'round',
      d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    },
  ],
  shield: [
    {
      type: 'path',
      linecap: 'round',
      linejoin: 'round',
      d: 'M12 3l7 3v5c0 4.418-3.134 8.167-7 9-3.866-.833-7-4.582-7-9V6l7-3z',
    },
  ],
  calendar: [
    {
      type: 'path',
      linecap: 'round',
      linejoin: 'round',
      d: 'M8 3v2M16 3v2M4 9h16M6 5h12a2 2 0 012 2v13a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z',
    },
  ],
  smartphone: [
    { type: 'path', linecap: 'round', d: 'M11 5h2' },
    {
      type: 'path',
      linecap: 'round',
      linejoin: 'round',
      d: 'M8 6h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z',
    },
    { type: 'path', linecap: 'round', d: 'M11 17h2' },
  ],
  'mobile-phone': [
    { type: 'path', linecap: 'round', d: 'M11 5h2' },
    {
      type: 'path',
      linecap: 'round',
      linejoin: 'round',
      d: 'M8 6h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z',
    },
    { type: 'path', linecap: 'round', d: 'M11 17h2' },
  ],
  'arrow-right': [
    {
      type: 'path',
      linecap: 'round',
      linejoin: 'round',
      d: 'M17 8l4 4m0 0l-4 4m4-4H3',
    },
  ],
  alert: [
    {
      type: 'path',
      linecap: 'round',
      linejoin: 'round',
      d: 'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
    },
  ],
};

export function getIconShapes(name: IconName): IconShape[] {
  return icons[name] ?? [];
}
