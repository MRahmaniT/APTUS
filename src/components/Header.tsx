import { useEffect, useId, useRef, useState } from "react";
import { NavLink } from "react-router";
import { useLoginNavigation } from "../config/authNavigation";
import { useAppContext } from "../controllers/AppContext";

const menus = [
  { id: "product", label: "درباره محصول", items: [{label:"تیپ‌بندی",to:"/types"},{label:"اجزا",to:"/components"}] },
  { id: "library", label: "کتابخانه و مقالات", items: [{label:"آیین‌نامه‌ها و استانداردها",to:"/library/codes"},{label:"کتاب‌های مرجع",to:"/library/books"},{label:"مقالات",to:"/library/articles"},{label:"فرهنگ لغات تخصصی",to:"/library/glossary"}] },
  { id: "about", label: "درباره ما", items: [{label:"درباره آپتوس",to:"/about"},{label:"تماس با ما",to:"/about/contact"},{label:"همکاران ما",to:"/about/partners"},{label:"عضویت در تشکل‌ها",to:"/about/memberships"},{label:"آمار سایت",to:"/about/statistics"}] },
  { id: "news", label: "اخبار و رویدادها", items: [{label:"اخبار",to:"/news/latest"},{label:"رویدادها",to:"/news/events"}] },
];

function Dropdown({ menu, open, onHover, onLeave, onToggle, onDismiss, onSelect }: {
  menu: typeof menus[number]; open: boolean; onHover: () => void; onLeave: () => void;
  onToggle: () => void; onDismiss: () => void; onSelect: () => void;
}) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  return <div className="desktop-nav-group"
    onPointerEnter={e => { if (e.pointerType === "mouse") onHover(); }}
    onPointerLeave={e => { if (e.pointerType === "mouse") onLeave(); }}
    onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) onDismiss(); }}
    onKeyDown={e => {
      if (e.key === "Escape" && open) { e.stopPropagation(); onDismiss(); trigger.current?.focus(); }
    }}
  >
    <button ref={trigger} type="button" aria-expanded={open} aria-controls={id} onClick={onToggle}>{menu.label}<span aria-hidden="true">⌄</span></button>
    <div id={id} className="header-dropdown" hidden={!open}>
      {menu.items.map(item => <NavLink key={item.to} to={item.to} onClick={onSelect}>{item.label}</NavLink>)}
    </div>
  </div>;
}

const linkClass = ({isActive}: {isActive: boolean}) => isActive ? "nav-link active" : "nav-link";

export default function Header() {
  const { user, logout, isEditor, authReady } = useAppContext();
  const { showLogin } = useLoginNavigation();
  const visibleMenus = menus.map(menu => ({...menu, items: menu.items.filter(item => isEditor || item.to !== "/about/statistics")}));
  const shell = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const close = () => { setMobile(false); setHovered(null); setPinned(null); };

  useEffect(() => {
    const dismiss = (event: PointerEvent) => { if (!shell.current?.contains(event.target as Node)) close(); };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  const account = !authReady ? null : user ? <><span className="account-name">{user.name}</span><button type="button" onClick={() => { logout(); close(); }}>خروج</button></>
    : <button type="button" className="account-login" onClick={() => { close(); showLogin(); }}>ورود و عضویت</button>;

  return <div ref={shell} className="aptus-header-shell fixed top-4 left-0 right-0 w-full flex justify-center z-50 px-4 md:px-8">
    <header className="aptus-header site-header">
      <div><NavLink to="/" onClick={close} aria-label="آپتوس ایران، خانه"><img src="/images/aptus-brand.svg" alt="آپتوس ایران"/></NavLink></div>
      <nav className="aptus-desktop-nav" aria-label="منوی اصلی">
        <NavLink to="/" end className={linkClass} onClick={close}>خانه</NavLink>
        {visibleMenus.map(menu => <div className="desktop-nav-entry" key={menu.id}>
          <Dropdown menu={menu} open={(pinned ?? hovered) === menu.id}
            onHover={() => setHovered(menu.id)} onLeave={() => setHovered(id => id === menu.id ? null : id)}
            onToggle={() => { setHovered(null); setPinned(id => id === menu.id ? null : menu.id); }}
            onDismiss={() => { setHovered(id => id === menu.id ? null : id); setPinned(id => id === menu.id ? null : id); }}
            onSelect={close}/>
          {isEditor && menu.id === "product" && <NavLink to="/projects" className={linkClass} onClick={close}>پروژه‌ها</NavLink>}
        </div>)}
      </nav>
      <div className="header-actions">
        <div className="desktop-account">{account}</div>
        <button className="aptus-menu-toggle" aria-expanded={mobile} aria-controls="aptus-mobile-navigation" aria-label={mobile ? "بستن فهرست" : "باز کردن فهرست"} onClick={() => setMobile(v => !v)}>{mobile ? "×" : "☰"}</button>
      </div>
    </header>
    {mobile && <nav id="aptus-mobile-navigation" className="aptus-mobile-menu" aria-label="منوی موبایل">
      <div className="mobile-account">{account}</div>
      <NavLink to="/" end onClick={close}>خانه</NavLink>
      {visibleMenus.map(menu => <div key={menu.id}>
        <div className="mobile-nav-group"><strong>{menu.label}</strong>{menu.items.map(item => <NavLink key={item.to} to={item.to} onClick={close}>{item.label}</NavLink>)}</div>
        {isEditor && menu.id === "product" && <NavLink className="mobile-projects-link" to="/projects" onClick={close}>پروژه‌ها</NavLink>}
      </div>)}
    </nav>}
  </div>;
}
