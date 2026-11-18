import { Link, Outlet, ScrollRestoration } from "react-router";
import Header from "../components/Header";
import AuthModal from "../components/AuthModal";
import RoleSwitcher from "../components/RoleSwitcher";
import { useAppContext } from "../controllers/AppContext";
import { catalogDetails, catalogPhone, catalogAsset } from "../data/catalogDetails";
import "../styles/site-updates.css";

export default function Layout() {
  const { locale, role } = useAppContext();
  const details = catalogDetails(locale);
  const mapUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(details.address);
  return <div className="aptus-site min-h-full flex flex-col">
    <Header/><AuthModal/><RoleSwitcher/><ScrollRestoration/>
    <main className="aptus-main flex-1"><Outlet/></main>
    <div className="aptus-footer-shell">
      <footer className="aptus-footer">
        <div className="aptus-footer-hero"><img src={catalogAsset("blue.png")} alt=""/><p className="aptus-footer-tagline">{details.footer.tagline}</p></div>
        <div className="aptus-footer-body">
          <div className="footer-content-grid">
            <div className="footer-about">
              <h4><Link to="/about">درباره آپتوس</Link></h4>
              <p>{details.about}</p><Link to="/about">آشنایی بیشتر با آپتوس ←</Link>
            </div>
            <div className="footer-links">
              <h4>دسترسی سریع</h4>
              <Link to="/types">تیپ‌بندی</Link><Link to="/components">اجزا</Link><Link to="/projects">پروژه‌ها</Link>
              <Link to="/library/articles">مقالات</Link><Link to="/about/contact">تماس با ما</Link>
              {["admin","manager"].includes(role) && <>
                <Link to="/admin/content">مدیریت محتوا</Link><Link to="/admin/pages">ویرایش صفحات</Link>
                <Link to="/admin/analytics">مدیریت سایت</Link>
              </>}
            </div>
            <div className="footer-contact">
              <h4>تماس با ما</h4>
              <address><p>{details.address}</p><a dir="ltr" href={"tel:" + catalogPhone.replace(/[^+0-9]/g, "")}>{catalogPhone}</a></address>
              <a className="footer-map" href={mapUrl} target="_blank" rel="noopener noreferrer">
                <img src={catalogAsset("map.png")} alt="نقشه موقعیت آپتوس ایران" loading="lazy"/><span>مشاهده نقشه و مسیریابی ↗</span>
              </a>
            </div>
          </div>
          <div className="footer-copyright">© {new Date().getFullYear()} آپتوس ایران. تمامی حقوق محفوظ است.</div>
        </div>
      </footer>
    </div>
  </div>;
}
