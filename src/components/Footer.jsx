import { company } from "../catalog/content";
import { copy } from "../catalog/i18n";
import { useAppContext } from "../controllers/AppContext";
export default function Footer() {
 const {locale}=useAppContext(),ui=copy[locale];
 return <footer className="site-footer" id="contact">
  <div className="footer-hero"><div><h2>{ui.footer.tagline}</h2></div></div>
  <div className="footer-grid"><div className="footer-contact"><h3>{ui.footer.contact}</h3><div className="footer-contact-items">
   <div className="footer-contact-item"><svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><div><span className="footer-contact-label">{ui.contact.location}</span><span className="footer-contact-value">{company.address||company.location}</span></div></div>
   <div className="footer-contact-item"><svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m5 3 4 4-2 3a16 16 0 0 0 7 7l3-2 4 4-2 3C11 22 2 13 2 5Z"/></svg><div><span className="footer-contact-label">{ui.contact.phone}</span><a className="footer-contact-value" dir="ltr" href={"tel:"+company.phone.replace(/[^+\d]/g,"")}>{company.phone}</a></div></div>
  </div></div><nav className="footer-links" aria-label="Website"><a href="/products">{ui.parts?.title||"AIPS"}</a><a href={"/?documents=all&lang="+locale}>{locale==="fa"?"اسناد و گواهینامه‌ها":locale==="tr"?"Belgeler":"Documents"}</a><a href="/about/contact">{ui.footer.contact}</a></nav></div>
  <div className="footer-bottom"><span>© {new Date().getFullYear()} APTUS {ui.footer.rights}</span><a href={"/"+(locale==="fa"?"":"?lang="+locale)+"#cover"}>{ui.footer.back} ↑</a></div>
 </footer>;
}
