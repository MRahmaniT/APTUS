import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useAppContext } from "../controllers/AppContext";
import { ApiService } from "../services/api";

export default function PageView() {
  const { pathname } = useLocation();
  const { user, isEditor, authReady } = useAppContext();
  const previous = useRef<string | null>(null);
  useEffect(() => {
    if (!authReady || previous.current === pathname) return;
    if (/^\/(admin(?:\/|$)|applications\/|projects(?:\/|$)|about\/statistics$)/.test(pathname) && !isEditor) return;
    if (/^\/library\/(codes|books|glossary)$/.test(pathname) && !user) return;
    previous.current = pathname;
    void ApiService.trackPageView(new Date().toISOString().slice(0, 10), pathname);
  }, [pathname, authReady, user, isEditor]);
  return null;
}
