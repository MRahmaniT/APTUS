import { useLocation, useNavigate } from "react-router";

export function useLoginNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const open = new URLSearchParams(location.search).get("auth") === "login";

  function setOpen(show: boolean) {
    const query = new URLSearchParams(location.search);
    if (show) query.set("auth", "login");
    else query.delete("auth");
    navigate({ pathname: location.pathname, search: query.toString(), hash: location.hash },
      { replace: !show, preventScrollReset: true });
  }

  return { open, showLogin: () => setOpen(true), closeLogin: () => setOpen(false) };
}
