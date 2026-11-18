import { useEffect, useState } from "react";
import AccordionGallery from "./AccordionGallery";
import { useAppContext } from "../controllers/AppContext";
import { catalogAsset, catalogDetails } from "../data/catalogDetails";
import { typeFamilies } from "../data/typeFamilies";
import { ContentRepository } from "../repositories/ContentRepository";

type Panel = { image: string; label: string; link: string };

const facades: Panel[] = ["01", "02", "03"].map((number, index) => ({
  image: catalogAsset("facades/facade-" + number + ".jpg"),
  label: ["طرح نمای اول", "طرح نمای دوم", "طرح نمای سوم"][index],
  link: "/products/facades#facade-" + number,
}));

export default function HomeShowcase() {
  const { isEditor, locale } = useAppContext();
  const [projects, setProjects] = useState<Panel[]>([]);
  useEffect(() => {
    if (!isEditor) { setProjects([]); return; }
    let active = true;
    ContentRepository.list("project", locale).then(items => {
      if (!active) return;
      setProjects(items.slice(0, 3).map(item => ({
        image: item.coverImage || catalogAsset("render.png"), label: item.title, link: "/projects/" + item.slug,
      })));
    }).catch(() => { if (active) setProjects([]); });
    return () => { active = false; };
  }, [isEditor, locale]);
  const projectPanels = isEditor ? projects : [];
  const items = [
    ...typeFamilies.map(family => ({ image: family.image, label: family.title, link: "/types/" + family.slug })),
    ...projectPanels, ...facades.slice(0, 3 - projectPanels.length),
  ];
  return <section className="home-showcase" aria-label={isEditor ? "تیپ‌بندی و پروژه‌های آپتوس" : "تیپ‌بندی و طرح‌های آپتوس"}>
    <AccordionGallery className="aptus-applications" items={items.map(item => ({ ...item, alt: "" }))}
      defaultIndex={0} expandRatio={0.43} height={470} gap={9} radius={16} grayscale={false}
      accentColor="#f58220" overlayColor="#252525"/>
  </section>;
}

export function AdminApplications() {
  const { isEditor, locale } = useAppContext();
  if (!isEditor) return null;
  const routes = { industry: "industrial", storage: "warehouses", production: "manufacturing", sport: "sports", education: "educational" };
  const data = catalogDetails(locale);
  const items = Object.entries(routes).map(([id, slug]) => {
    const item = data.applications.find(application => application.id === id)!;
    return { image: item.image, label: item.title, alt: "", link: "/applications/" + slug };
  });
  return <section className="home-showcase admin-applications" aria-label="کاربری‌های سیستم آپتوس">
    <AccordionGallery className="aptus-applications" items={items} defaultIndex={2} expandRatio={0.52}
      duration={0.5} height={500} gap={8} radius={16} accentColor="#f58220" overlayColor="#333333"/>
  </section>;
}
