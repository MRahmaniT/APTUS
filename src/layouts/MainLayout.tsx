import { Outlet } from "react-router";
import Header from "../components/Header";
import AuthModal from "../components/AuthModal";
import RoleSwitcher from "../components/RoleSwitcher";
import { useAppContext } from "../controllers/AppContext";
import { catalogDetails, catalogPhone, catalogAsset } from "../data/catalogDetails";
import "../styles/site-updates.css";
export default function Layout(){const {locale,role}=useAppContext();const d=catalogDetails(locale);const mapUrl="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(d.address);return <div className="aptus-site min-h-full flex flex-col"><Header/><AuthModal/><RoleSwitcher/><main className="aptus-main flex-1"><Outlet/></main><div className="aptus-footer-shell"><footer className="aptus-footer"><div className="aptus-footer-hero"><img src={catalogAsset("blue.png")} alt=""/><p className="aptus-footer-tagline">{d.footer.tagline}</p></div><div className="aptus-footer-body"><div className="footer-content-grid">
 <div className="footer-contact"><h4>تماس با ما</h4><address><p>{d.address}</p><a dir="ltr" href={"tel:"+catalogPhone.replace(/[^+0-9]/g,"")}>{catalogPhone}</a></address><a className="footer-map" href={mapUrl} target="_blank" rel="noopener noreferrer"><img src={catalogAsset("map.png")} alt="نقشه موقعیت آپتوس ایران" loading="lazy"/><span>مشاهده نقشه و مسیریابی ↗</span></a></div>
 <div className="footer-links"><h4>دسترسی سریع</h4><a href="/types">تیپ‌بندی</a><a href="/components">اجزا</a><a href="/projects">پروژه‌ها</a><a href="/library/articles">مقالات</a><a href="/about/contact">تماس با ما</a>{["admin","manager"].includes(role)&&<><a href="/admin/content">مدیریت محتوا</a><a href="/admin/pages">ویرایش صفحات</a><a href="/admin/analytics">مدیریت سایت</a></>}</div>
 <div className="footer-about"><a href="/about"><img src="/images/aptus-brand.svg" alt="آپتوس ایران" className="aptus-footer-brand"/></a><h4><a href="/about">درباره آپتوس</a></h4><p>{d.about}</p><a href="/about">آشنایی بیشتر با آپتوس ←</a></div>
 </div><div className="footer-copyright">© {new Date().getFullYear()} آپتوس ایران. تمامی حقوق محفوظ است.</div></div></footer></div></div>;}

