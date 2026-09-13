import React from "react";
import { Outlet } from "react-router";
import Header from "../components/Header";
import AuthModal from "../components/AuthModal";
import RoleSwitcher from "../components/RoleSwitcher";
import { useAppContext } from "../controllers/AppContext";

export default function Layout() {
  const { t } = useAppContext();
  
  return (
    <div className="min-h-full flex flex-col bg-[#fafaf8] text-[#111]">
      <Header />
      <AuthModal />
      <RoleSwitcher />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 pt-24 md:pt-32 pb-8">
        <Outlet />
      </main>

      {/* Basic Footer */}
      <div className="px-4 md:px-8 pb-4 md:pb-8 w-full mt-auto">
        <footer className="bg-gray-50 text-gray-900 rounded-[2rem] shadow-xl border border-gray-200 overflow-hidden flex flex-col w-full max-w-8xl mx-auto">
          {/* Map Graphic */}
          <div className="w-full h-40 md:h-64 overflow-hidden relative bg-[#1a0c00]">
            <img 
              src="/images/karaj_heatwave_20260908_211222.png" 
              alt="Service Area Map" 
              className="w-full h-full object-cover opacity-80"
              style={{ objectPosition: "center 30%" }}
            />
          </div>
          
          <div className="px-6 md:px-12 pt-14 pb-8 w-full">
            <div className="grid md:grid-cols-4 gap-10 mb-12">
              <div className="md:col-span-1">
                <p className="text-2xl font-extrabold italic uppercase">
                  Aptus
                </p>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                  Leading manufacturer of precast concrete structures and modular
                  building systems since 1994.
                </p>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-900 mb-4">
                  {t("nav", "about")}
                </h4>
                <ul className="space-y-2.5 list-none m-0 p-0">
                  {[t("nav", "about_location"), t("nav", "about_contact")].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-900 mb-4">
                  {t("nav", "elements")}
                </h4>
                <ul className="space-y-2.5 list-none m-0 p-0">
                  {[t("nav", "elem_foundations"), t("nav", "elem_columns"), t("nav", "elem_panels")].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-900 mb-4">
                  {t("nav", "about_contact")}
                </h4>
                <address className="not-italic space-y-2.5 text-sm text-gray-500">
                  <p>sales@aptus.com</p>
                  <p>+1 (800) 555-0190</p>
                </address>
                <div className="mt-8">
                  <a href="/admin/analytics" className="text-xs text-gray-400 hover:text-black transition-colors">
                    Admin Panel
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright Pill Area */}
            <div className="pt-6 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 italic font-medium">
                © 2026 APTUS Precast. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 italic font-medium">
                Building the future, panel by panel.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
