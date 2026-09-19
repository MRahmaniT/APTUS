import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import { Building2, ChevronDown, UserCircle2, LogOut, Menu, X, ShieldAlert, Monitor } from "lucide-react";
import { useAppContext } from "../controllers/AppContext";
import { Locale } from "../config/translations";
import { isDesktopDemo } from "../config/apiClient";

export default function Header() {
  const { locale, setLocale, t, user, role, logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const handleLanguageChange = (lang: Locale) => {
    setLocale(lang);
    setIsMobileMenuOpen(false);
  };

  const isNavActive = (navItem: { to?: string, items?: { to: string }[] }) => {
    if (navItem.to) {
      if (navItem.to === '/') return location.pathname === '/';
      return location.pathname.startsWith(navItem.to);
    }
    if (navItem.items) {
      return navItem.items.some(item => {
        if (item.to === '/') return location.pathname === '/';
        return location.pathname.startsWith(item.to);
      });
    }
    return false;
  };

  const navItems = [
    {
      key: "products",
      label: t("nav", "products"),
      to: "/products"
    },
    {
      key: "library",
      label: t("nav", "library"),
      isProtected: true,
      items: [
        { label: t("nav", "lib_codes"), to: "/library/codes" },
        { label: t("nav", "lib_books"), to: "/library/books" },
        { label: t("nav", "lib_articles"), to: "/library/articles" },
        { label: t("nav", "lib_glossary"), to: "/library/glossary" },
      ]
    },
    {
      key: "about",
      label: t("nav", "about"),
      items: [
        { label: t("nav", "about_location"), to: "/about/location" },
        { label: t("nav", "about_contact"), to: "/about/contact" },
        { label: t("nav", "about_partners"), to: "/about/partners" },
        { label: t("nav", "about_memberships"), to: "/about/memberships" },
        { label: t("nav", "about_affiliations"), to: "/about/affiliations" },
        ...((role === "admin" || role === "manager") ? [{ label: t("nav", "about_analytics"), to: "/admin/analytics" }] : []),
      ]
    },
    {
      key: "news",
      label: t("nav", "news"),
      items: [
        { label: t("nav", "news_latest"), to: "/news/latest" },
        { label: t("nav", "news_events"), to: "/news/events" },
        { label: t("nav", "news_exhibitions"), to: "/news/exhibitions" },
      ]
    }
  ];

  return (
    <div className="fixed top-4 left-0 right-0 w-full flex justify-center z-50 px-4 md:px-8">
      <header className="bg-white/80 backdrop-blur-md backdrop-saturate-[1.8] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white/60 flex items-center justify-between px-4 py-5 w-full max-w-8xl mx-auto">
        <div className="flex items-center shrink-0">
          <NavLink to="/" className="flex items-center gap-2 px-2 hover:opacity-70 transition-opacity">
            <img 
              src="/images/logo.png" 
              alt="Aptus Logo" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                }
              }}
            />
            <div className="hidden items-center gap-2" style={{ display: 'none' }}>
              <Building2 className="w-5 h-5 text-black" />
              <span className="text-lg font-extrabold italic tracking-wider text-black uppercase">Aptus</span>
            </div>
          </NavLink>
        </div>

        <nav className="hidden lg:flex items-center justify-center gap-1" aria-label="Main navigation">
          <NavLink to="/" className={({isActive}) => `flex items-center text-sm font-medium transition-all py-1.5 px-4 rounded-full ${isActive ? 'text-white bg-[#1a1a1a] not-italic' : 'text-gray-900 hover:text-black hover:bg-white/50 italic'}`}>{t("nav", "home")}</NavLink>
          {navItems.map((nav) => {
            const isCurrentActive = isNavActive(nav);
            const isHovered = activeDropdown === nav.key;
            const isPillActive = isCurrentActive || isHovered;

            if (nav.to) {
              return (
                <NavLink
                  key={nav.key}
                  to={nav.to}
                  className={({isActive}) => `flex items-center gap-1.5 text-sm font-medium transition-all py-1.5 px-4 rounded-full ${isActive ? 'text-white bg-[#1a1a1a] not-italic' : 'text-gray-900 hover:text-black hover:bg-white/50 italic'}`}
                >
                  {nav.isProtected && <ShieldAlert className={`w-3.5 h-3.5 shrink-0 ${isCurrentActive ? 'text-amber-400' : 'text-amber-500'}`} />}
                  <span className="whitespace-nowrap">{nav.label}</span>
                </NavLink>
              );
            }

            return (
              <div 
                key={nav.key} 
                className="relative group"
                onMouseEnter={() => setActiveDropdown(nav.key)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`flex items-center gap-1.5 text-sm font-medium transition-all py-1.5 px-4 rounded-full ${isPillActive ? 'text-white bg-[#1a1a1a] not-italic' : 'text-gray-900 hover:text-black hover:bg-white/50 italic'}`}>
                  {nav.isProtected && <ShieldAlert className={`w-3.5 h-3.5 shrink-0 ${isPillActive ? 'text-amber-400' : 'text-amber-500'}`} />}
                  <span className="whitespace-nowrap">{nav.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isHovered ? 'rotate-180 opacity-100' : (isCurrentActive ? 'opacity-100' : 'opacity-50')}`} />
                </button>
                <div className={`absolute top-full mt-2 ${locale === 'fa' ? 'right-0' : 'left-0'} w-56 bg-white/90 backdrop-blur-3xl backdrop-saturate-[1.8] border border-white/50 rounded-2xl shadow-xl py-2 overflow-hidden transition-all duration-200 ${isHovered ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
                  {nav.items?.map((item) => (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      className={({isActive}) => `block px-5 py-2 text-sm transition-colors ${isActive ? 'font-bold text-black bg-gray-50' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center border border-gray-200 bg-gray-50 rounded-full p-0.5">
            <button onClick={() => handleLanguageChange("fa")} className={`px-2.5 py-1 text-xs rounded-full transition-colors ${locale === "fa" ? "bg-white shadow-sm font-bold text-black" : "text-gray-500 hover:text-gray-900"}`}>فا</button>
            <button onClick={() => handleLanguageChange("en")} className={`px-2.5 py-1 text-xs rounded-full transition-colors ${locale === "en" ? "bg-white shadow-sm font-bold text-black" : "text-gray-500 hover:text-gray-900"}`}>EN</button>
            <button onClick={() => handleLanguageChange("tr")} className={`px-2.5 py-1 text-xs rounded-full transition-colors ${locale === "tr" ? "bg-white shadow-sm font-bold text-black" : "text-gray-500 hover:text-gray-900"}`}>TR</button>
          </div>

          {isDesktopDemo ? (
            <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-full px-3 py-1.5">
              <Monitor className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide">Offline Demo</span>
            </div>
          ) : user ? (
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full pl-3 pr-1 py-1">
              <span className="text-xs font-medium text-gray-700 max-w-[100px] truncate">{user.name}</span>
              <button 
                onClick={() => { logout(); navigate("/"); }} 
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-white rounded-full transition-colors"
                title={t("auth", "logout")}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("?auth=login")}
              className="hidden sm:flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-black transition-colors"
            >
              <UserCircle2 className="w-4 h-4" />
              {t("auth", "login")}
            </button>
          )}

          <button 
            className="lg:hidden p-2 text-gray-600 hover:text-black bg-gray-50 rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="absolute top-[110%] left-4 right-4 bg-white/70 backdrop-blur-2xl backdrop-saturate-[1.8] border border-white/50 shadow-2xl rounded-2xl max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="flex justify-center gap-2 pb-4 border-b border-gray-100">
              <button onClick={() => handleLanguageChange("fa")} className={`px-4 py-1.5 text-sm rounded-full ${locale === "fa" ? "bg-gray-100 font-bold text-black" : "text-gray-600"}`}>فا</button>
              <button onClick={() => handleLanguageChange("en")} className={`px-4 py-1.5 text-sm rounded-full ${locale === "en" ? "bg-gray-100 font-bold text-black" : "text-gray-600"}`}>EN</button>
              <button onClick={() => handleLanguageChange("tr")} className={`px-4 py-1.5 text-sm rounded-full ${locale === "tr" ? "bg-gray-100 font-bold text-black" : "text-gray-600"}`}>TR</button>
            </div>
            
            <div className="space-y-2">
               <NavLink to="/" className="font-semibold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-1 w-full text-left" onClick={() => setIsMobileMenuOpen(false)}>{t("nav", "home")}</NavLink>
            </div>

            {navItems.map((nav) => (
              <div key={nav.key} className="space-y-2">
                {nav.to ? (
                  <NavLink
                    to={nav.to}
                    className="font-semibold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-1 w-full text-left"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {nav.isProtected && <ShieldAlert className="w-4 h-4 text-amber-600" />}
                    {nav.label}
                  </NavLink>
                ) : (
                  <>
                    <div className="font-semibold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-1">
                      {nav.isProtected && <ShieldAlert className="w-4 h-4 text-amber-600" />}
                      {nav.label}
                    </div>
                    <div className="flex flex-col space-y-2 pl-4 rtl:pr-4 rtl:pl-0">
                      {nav.items?.map((item) => (
                        <NavLink
                          key={item.label}
                          to={item.to}
                          className="text-sm text-gray-600 hover:text-black"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}

            <div className="pt-2 border-t border-gray-100">
              {isDesktopDemo ? (
                <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3">
                  <Monitor className="w-5 h-5" />
                  <span className="text-sm font-semibold">Offline Desktop Demo</span>
                </div>
              ) : user ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{t("roles", role)}</div>
                  </div>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); navigate("/"); }} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-red-600">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); navigate("?auth=login"); }}
                  className="w-full flex justify-center items-center gap-2 bg-[#1a1a1a] text-white px-4 py-3 rounded-xl text-sm font-medium"
                >
                  <UserCircle2 className="w-5 h-5" />
                  {t("auth", "login")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
