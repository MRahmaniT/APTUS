import { Link } from "react-router";
import { useAppContext } from "../../controllers/AppContext";
import { contentUi } from "../../config/contentUi";
export function contentHref(item) {
 return "/"+({product:"products",news:"news",project:"projects"})[item.type]+"/"+item.slug;
}
export default function ContentCard({item}) {
 const {locale}=useAppContext(),ui=contentUi(locale);
 return <article className={"part-card cms-card "+(item.type==="product"?"product-card":"editorial-card")}>
  <Link to={contentHref(item)} className="cms-card-image">{item.coverImage?<img src={item.coverImage} alt={item.title} loading="lazy"/>:<div className="cms-image-placeholder">APTUS</div>}</Link>
  <div className="cms-card-copy"><span className="eyebrow">{item.category||item.type}</span><h3><Link to={contentHref(item)}>{item.title}</Link></h3><p>{item.abstract}</p><Link className="text-link" to={contentHref(item)}>{ui.viewDetails} ←</Link></div>
 </article>;
}
