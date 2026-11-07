import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useAppContext } from "../controllers/AppContext";
const menus=[
 {label:"درباره محصول",items:[{label:"تیپ‌بندی",to:"/types"},{label:"اجزا",to:"/components"}]},
 {label:"کتابخانه و مقالات",items:[{label:"آیین‌نامه‌ها و استانداردها",to:"/library/codes"},{label:"کتاب‌های مرجع",to:"/library/books"},{label:"مقالات",to:"/library/articles"},{label:"فرهنگ لغات تخصصی",to:"/library/glossary"}]},
 {label:"درباره ما",items:[{label:"تماس با ما",to:"/about/contact"},{label:"همکاران ما",to:"/about/partners"},{label:"عضویت در تشکل‌ها",to:"/about/memberships"},{label:"آمار سایت",to:"/about/statistics"}]},
 {label:"اخبار و رویدادها",items:[{label:"اخبار",to:"/news/latest"},{label:"رویدادها",to:"/news/events"}]},
];
export default function Header(){
 const {user,logout}=useAppContext(),navigate=useNavigate(),location=useLocation();
 const [mobile,setMobile]=useState(false),[open,setOpen]=useState<string|null>(null);
 const close=()=>{setMobile(false);setOpen(null);};
 const linkClass=({isActive}:{isActive:boolean})=>isActive?"nav-link active":"nav-link";
 const account=<>{user?<><span className="account-name">{user.name}</span><button title="خروج" aria-label="خروج" onClick={()=>{logout();close();}}>خروج</button></>:<button className="account-login" onClick={()=>{close();navigate(location.pathname+"?auth=login");}}>ورود و عضویت</button>}</>;
 return <div className="aptus-header-shell fixed top-4 left-0 right-0 w-full flex justify-center z-50 px-4 md:px-8"><header className="aptus-header site-header">
  <div><NavLink to="/" onClick={close} aria-label="آپتوس ایران، خانه"><img src="/images/aptus-brand.svg" alt="آپتوس ایران"/></NavLink></div>
  <nav className="aptus-desktop-nav" aria-label="منوی اصلی"><NavLink to="/" end className={linkClass}>خانه</NavLink>{menus.map(menu=><div className="group relative" key={menu.label} onMouseEnter={()=>setOpen(menu.label)} onMouseLeave={()=>setOpen(null)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setOpen(null);}} onKeyDown={e=>{if(e.key==="Escape")setOpen(null);}}><button type="button" aria-expanded={open===menu.label} onClick={()=>setOpen(open===menu.label?null:menu.label)}>{menu.label}⌄</button><div className={"header-dropdown "+(open===menu.label?"":"hidden")}>{menu.items.map(item=><NavLink key={item.to} to={item.to} onClick={close}>{item.label}</NavLink>)}</div></div>)}<NavLink to="/projects" className={linkClass}>پروژه‌ها</NavLink></nav>
  <div className="header-actions"><div className="desktop-account">{account}</div><button className="aptus-menu-toggle" aria-expanded={mobile} aria-controls="aptus-mobile-navigation" aria-label={mobile?"بستن فهرست":"باز کردن فهرست"} onClick={()=>setMobile(!mobile)}>{mobile?"×":"☰"}</button></div>
 </header>{mobile&&<nav id="aptus-mobile-navigation" className="aptus-mobile-menu" aria-label="منوی موبایل"><NavLink to="/" end onClick={close}>خانه</NavLink>{menus.map(menu=><div className="mobile-nav-group" key={menu.label}><strong>{menu.label}</strong>{menu.items.map(item=><NavLink key={item.to} to={item.to} onClick={close}>{item.label}</NavLink>)}</div>)}<NavLink to="/projects" onClick={close}>پروژه‌ها</NavLink><div className="mobile-account">{account}</div></nav>}</div>;
}

