import { useEffect,useRef } from "react";
import { useLocation } from "react-router";
import { useAppContext } from "../controllers/AppContext";
import { mountCatalog } from "../catalog/app";
export default function Home() {
  const ref=useRef(null),location=useLocation();
  const {locale}=useAppContext();
  useEffect(()=>mountCatalog(ref.current,locale),[locale,location.search,location.hash]);
  return <div ref={ref} className="catalog-surface" data-catalog-locale={locale}/>;
}
