import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider } from "./controllers/AppContext";
import { ApiService } from "./services/api";

export default function App() {
  useEffect(() => {
    // Only track view once per session
    if (!sessionStorage.getItem("view_tracked")) {
      const today = new Date().toISOString().split("T")[0];
      ApiService.trackPageView(today);
      sessionStorage.setItem("view_tracked", "true");
    }
  }, []);

  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
