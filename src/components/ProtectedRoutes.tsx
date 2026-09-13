import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router";
import { useAppContext } from "../controllers/AppContext";
import { ShieldAlert } from "lucide-react";

export function ProtectedLibraryRoute() {
  const { user, t } = useAppContext();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="w-16 h-16 text-amber-500 mb-6" />
        <h2 className="text-3xl font-bold mb-4">{t("auth", "accessDenied")}</h2>
        <p className="text-gray-600 max-w-md mb-8">
          {t("auth", "accessDeniedMessage")}
        </p>
        <button 
          onClick={() => navigate("?auth=login")}
          className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          {t("auth", "login")}
        </button>
      </div>
    );
  }

  return <Outlet />;
}

export function AdminRoute() {
  const { role, t } = useAppContext();

  if (role !== "admin" && role !== "manager") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-3xl font-bold mb-4">{t("auth", "accessDenied")}</h2>
        <p className="text-gray-600 max-w-md">
          {t("auth", "adminOnly")}
        </p>
      </div>
    );
  }

  return <Outlet />;
}
