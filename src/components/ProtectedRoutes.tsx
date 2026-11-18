import { Link, Outlet } from "react-router";
import { ShieldAlert } from "lucide-react";
import { useAppContext } from "../controllers/AppContext";
import { useLoginNavigation } from "../config/authNavigation";

function SessionPending() {
  return <p className="section-inner py-12" role="status">در حال بررسی حساب کاربری…</p>;
}

export function ProtectedLibraryRoute() {
  const { user, authReady, t } = useAppContext();
  const { showLogin } = useLoginNavigation();
  if (!authReady) return <SessionPending/>;
  if (user) return <Outlet/>;
  return <div className="access-gate section-inner flex flex-col items-center justify-center py-20 text-center">
    <ShieldAlert aria-hidden="true" className="w-12 h-12 text-amber-500 mb-4"/>
    <h1 className="text-2xl font-bold mb-4">{t("auth", "accessDenied")}</h1>
    <p className="text-gray-600 max-w-md mb-8">{t("auth", "accessDeniedMessage")}</p>
    <button type="button" onClick={showLogin} className="bg-black text-white px-6 py-3 rounded-full">{t("auth", "login")}</button>
  </div>;
}

export function AdminRoute() {
  const { isEditor, authReady, t } = useAppContext();
  if (!authReady) return <SessionPending/>;
  if (isEditor) return <Outlet/>;
  return <div className="access-gate section-inner flex flex-col items-center py-20 text-center">
    <ShieldAlert aria-hidden="true" className="w-12 h-12 text-amber-500 mb-4"/>
    <h1 className="text-2xl font-bold mb-4">{t("auth", "accessDenied")}</h1>
    <p className="text-gray-600 mb-6">{t("auth", "adminOnly")}</p>
    <Link className="nav-link" to="/">بازگشت به خانه</Link>
  </div>;
}
