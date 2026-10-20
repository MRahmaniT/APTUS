import { useEffect,useState } from "react";
import { Link,useLocation,useNavigate } from "react-router";
import { useAppContext } from "../controllers/AppContext";
import { copy } from "../catalog/i18n";
import { editorialUI } from "../catalog/editorial-i18n";
export default function Header() {
  const {locale,setLocale,t,user,role,logout}=useAppContext();
  const ui=copy[locale],extra=editorialUI[locale];
  const location=useLocation(),navigate=useNavigate();
  const [open,setOpen]=useState(false);
  useEffect(()=>{setOpen(false)},[location.pathname,location.search,location.hash]);
  const home=id=>"/"+(locale==="fa"?"":"?lang="+locale)+"#"+id;
  const sections=[["cover",extra.nav.home],["about",ui.about.title],["system",ui.system.title],["explore",extra.nav.interactive],["types",extra.nav.types],["facades",extra.nav.facades],["applications",extra.nav.applications],["benefits",extra.nav.benefits]];
  const pages=[["/news",t("nav","news")],["/projects",t("nav","projects")==="projects"?(locale==="fa"?"پروژه‌ها":locale==="tr"?"Projeler":"Projects"):t("nav","projects")],["/about/contact",t("nav","about_contact")],["/about/location",t("nav","about_location")],["/about/partners",t("nav","about_partners")],["/about/memberships",t("nav","about_memberships")],["/about/affiliations",t("nav","about_affiliations")]];
  const libraries=[["codes",t("nav","lib_codes")],["books",t("nav","lib_books")],["articles",t("nav","lib_articles")],["glossary",t("nav","lib_glossary")]];
  function language(next) {
    setLocale(next);
    const params=new URLSearchParams(location.search);params.set("lang",next);
    navigate({pathname:location.pathname,search:params.toString(),hash:location.hash});
  }
  function login() {
    const params=new URLSearchParams(location.search);params.set("auth","login");
    navigate({pathname:location.pathname,search:params.toString(),hash:location.hash});
  }
  return <header className="site-header website-header" id="top">
    <Link className="brand" to="/" aria-label={ui.homeLabel}><img className="brand-logo" src="/catalog/assets/brand.svg" alt="آپتوس ایران / APTUS IRAN"/></Link>
    <nav className={`primary-nav ${open?"is-open":""}`} id="primary-nav" aria-label={ui.menu}>
      {sections.map(([id,label])=><a key={id} href={home(id)} aria-current={location.pathname==="/"&&location.hash==="#"+id?"page":undefined}>{label}</a>)}
      <Link to="/products" aria-current={location.pathname.startsWith("/products")?"page":undefined}>{t("nav","products")}</Link>
      <details className="nav-group website-menu"><summary>{locale==="fa"?"وب‌سایت":locale==="tr"?"Web sitesi":"Website"}<span className="nav-chevron" aria-hidden="true"/></summary><div className="nav-submenu">
        {pages.map(([href,label])=><Link key={href} to={href}>{label}</Link>)}
        <span className="submenu-label">{t("nav","library")}</span>
        {libraries.map(([path,label])=><Link key={path} to={"/library/"+path}>{label}</Link>)}
        {(role==="admin"||role==="manager")&&["content","pages","profile","analytics"].map(path=><Link key={path} to={"/admin/"+path}>{({fa:{content:"مدیریت محتوا",pages:"ویرایش صفحات",profile:"پروفایل",analytics:"آمار"},en:{content:"Content studio",pages:"Page editor",profile:"Profile",analytics:"Analytics"},tr:{content:"İçerik",pages:"Sayfalar",profile:"Profil",analytics:"İstatistikler"}})[locale][path]}</Link>)}
      </div></details>
      <a href={home("contact")}>{extra.nav.contactInfo}</a>
    </nav>
    <div className="header-actions">
      <div className="language-switch" role="group" aria-label={ui.language}>{[["fa","فا"],["en","EN"],["tr","TR"]].map(([code,label])=><button key={code} type="button" data-language={code} aria-pressed={locale===code} onClick={()=>language(code)}>{label}</button>)}</div>
      {user?<button className="account-button" type="button" onClick={async()=>{await logout();navigate("/")}} aria-label={t("auth","logout")}>{user.name}<span> / {t("auth","logout")}</span></button>:<button className="account-button" type="button" onClick={login}>{t("auth","login")}</button>}
      <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-nav" aria-label={open?ui.closeMenu:ui.openMenu} onClick={()=>setOpen(!open)}><span aria-hidden="true">☰</span></button>
    </div>
  </header>;
}
