import { catalogAsset } from "./catalogDetails";

export const typeFamilies = [
  { slug: "single-storey-design", title: "سوله تک‌دهانه", image: catalogAsset("render.png") },
  { slug: "double-storey-design", title: "سوله دودهانه متقارن", image: catalogAsset("system-3d-view.png") },
  { slug: "multi-storey-design", title: "سوله دودهانه نامتقارن", image: catalogAsset("cover-render3.png") },
] as const;

export const isTypeFamily = (slug: string) => typeFamilies.some(family => family.slug === slug);
