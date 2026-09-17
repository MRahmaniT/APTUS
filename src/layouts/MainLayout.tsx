import React from "react";
import { Outlet } from "react-router";
import Header from "../components/Header";
import AuthModal from "../components/AuthModal";
import RoleSwitcher from "../components/RoleSwitcher";
import { useAppContext } from "../controllers/AppContext";
import { contentUi } from "../config/contentUi";

export default function Layout() {
  const { t, role, locale } = useAppContext();
  const ui = contentUi(locale);
  
  return (
    <div className="min-h-full flex flex-col bg-[#fafaf8] text-[#111]">
      <Header />
      <AuthModal />
      <RoleSwitcher />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 pt-24 md:pt-32 pb-8">
        <Outlet />
      </main>

      <div className="px-4 md:px-8 pb-4 md:pb-8 w-full mt-auto">
        <footer className="bg-gray-50 text-gray-900 rounded-[2rem] shadow-xl border border-gray-200 overflow-hidden flex flex-col w-full max-w-8xl mx-auto">
          <div className="w-full h-40 md:h-64 overflow-hidden relative bg-[#1a0c00]">
            <img src="/images/karaj_heatwave_20260908_211222.png" alt="APTUS" className="w-full h-full object-cover opacity-80" style={{ objectPosition: "center 30%" }} />
          </div>
          
          <div className="px-6 md:px-12 pt-14 pb-8 w-full">
            <div className="grid md:grid-cols-4 gap-10 mb-12">
              <div className="md:col-span-1">
                <p className="text-2xl font-extrabold italic uppercase">Aptus</p>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{ui.footerDescription}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-900 mb-4">{t("nav", "about")}</h4>
                <ul className="space-y-2.5 list-none m-0 p-0">
                  <li><a href="/about/location" className="text-sm text-gray-500 hover:text-black transition-colors">{t("nav", "about_location")}</a></li>
                  <li><a href="/about/contact" className="text-sm text-gray-500 hover:text-black transition-colors">{t("nav", "about_contact")}</a></li>
                  <li><a href="/projects" className="text-sm text-gray-500 hover:text-black transition-colors">{ui.ourWork}</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-900 mb-4">{t("nav", "elements")}</h4>
                <ul className="space-y-2.5 list-none m-0 p-0">
                  <li><a href="/products/foundations" className="text-sm text-gray-500 hover:text-black transition-colors">{t("nav", "elem_foundations")}</a></li>
                  <li><a href="/products/columns" className="text-sm text-gray-500 hover:text-black transition-colors">{t("nav", "elem_columns")}</a></li>
                  <li><a href="/products/architectural-panels" className="text-sm text-gray-500 hover:text-black transition-colors">{t("nav", "elem_panels")}</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-900 mb-4">{t("nav", "about_contact")}</h4>
                <address className="not-italic space-y-2.5 text-sm text-gray-500">
                  <p>sales@aptus.com</p>
                  <p>+1 (800) 555-0190</p>
                </address>
                {(role === "admin" || role === "manager") && (
                  <div className="mt-8 flex flex-col gap-2">
                    <a href="/admin/content" className="text-xs text-gray-400 hover:text-black transition-colors">{ui.contentStudio}</a>
                    <a href="/admin/pages" className="text-xs text-gray-400 hover:text-black transition-colors">{ui.pageEditor}</a>
                    <a href="/admin/profile" className="text-xs text-gray-400 hover:text-black transition-colors">{ui.profile}</a>
                    <a href="/admin/analytics" className="text-xs text-gray-400 hover:text-black transition-colors">{ui.analytics}</a>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 italic font-medium">{ui.copyright}</p>
              <p className="text-sm text-gray-500 italic font-medium">{ui.footerTagline}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
