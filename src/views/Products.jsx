import { useEffect,useState } from "react";
import ContentCard from "../components/content/ContentCard";
import { useAppContext } from "../controllers/AppContext";
import { contentUi } from "../config/contentUi";
import { ContentRepository } from "../repositories/ContentRepository";
import { copy } from "../catalog/i18n";
export default function Products() {
 const {locale,t}=useAppContext(),ui=contentUi(locale);
 const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{let active=true;setLoading(true);setError("");ContentRepository.list("product",locale).then(rows=>{if(active)setItems(rows)}).catch(error=>{if(active)setError(error.message)}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[locale]);
 const designs=items.filter(item=>["single-storey-design","facades"].includes(item.slug)),components=items.filter(item=>!["single-storey-design","facades"].includes(item.slug));
 return <div className="website-page"><div className="section-head"><div><span className="eyebrow">AIPS / APTUS IRAN</span><h1>{t("nav","products")}</h1></div><p className="section-aside">{copy[locale].cover.sub}</p></div>
 {loading?<p role="status">{ui.loadingProducts}</p>:error?<p role="alert">{error}</p>:<><section><div className="section-head"><h2>{t("nav","designs")}</h2></div><div className="catalog-product-grid">{designs.map(item=><ContentCard key={item.id} item={item}/>)}</div></section><section className="website-section"><div className="section-head"><h2>{t("nav","elements")}</h2></div><div className="catalog-product-grid" data-component-grid>{components.map(item=><ContentCard key={item.id} item={item}/>)}</div></section></>}
 </div>;
}
