import { useEffect,useRef } from "react";
import { useLocation } from "react-router";
import { useAppContext } from "../controllers/AppContext";
import { mountCatalog } from "../catalog/app";
export default function Home() {
  const ref=useRef(null),location=useLocation();
  const {locale}=useAppContext();
  useEffect(()=>{const cleanup=mountCatalog(ref.current,locale);const frame=requestAnimationFrame(()=>{try{if(location.hash)document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView()}catch{}});return()=>{cancelAnimationFrame(frame);cleanup()}},[locale,location.search,location.hash]);
  return <div ref={ref} className="catalog-surface" data-catalog-locale={locale}/>;
}
