import AccordionGallery from "./AccordionGallery";
import { catalogAsset } from "../data/catalogDetails";
import { typeFamilies } from "../data/typeFamilies";

const facades = ["01", "02", "03"].map((number, index) => ({
  image: catalogAsset("facades/facade-" + number + ".jpg"),
  label: ["طرح نمای اول", "طرح نمای دوم", "طرح نمای سوم"][index],
  link: "/products/facades#facade-" + number,
}));

export default function HomeShowcase() {
  const items = [
    ...typeFamilies.map(family => ({ image: family.image, label: family.title, link: "/types/" + family.slug })),
    ...facades,
  ];
  return <section className="home-showcase" aria-label="تیپ‌بندی و طرح‌های آپتوس">
    <AccordionGallery className="aptus-applications" items={items.map(item => ({ ...item, alt: "" }))}
      defaultIndex={0} expandRatio={0.43} height={470} gap={9} radius={16} grayscale={false}
      accentColor="#f58220" overlayColor="#252525"/>
  </section>;
}
