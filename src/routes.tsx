import { createBrowserRouter } from "react-router";
import Layout from "./layouts/MainLayout";
import Home from "./views/Home";
import Products from "./views/Products";
import AdminAnalytics from "./views/AdminAnalytics";
import { ProtectedLibraryRoute, AdminRoute } from "./components/ProtectedRoutes";

const Stub = () => <div className="py-20 text-center text-gray-500">Page under construction...</div>;

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      
      // Products
      { path: "products", Component: Products },
      
      // Library (Restricted)
      {
        path: "library",
        Component: ProtectedLibraryRoute,
        children: [
          { path: "codes", Component: Stub },
          { path: "books", Component: Stub },
          { path: "articles", Component: Stub },
          { path: "glossary", Component: Stub },
        ]
      },

      // Admin (Restricted)
      {
        path: "admin",
        Component: AdminRoute,
        children: [
          { path: "analytics", Component: AdminAnalytics },
        ]
      },

      // Catch-all stub for other menus
      { path: "*", Component: Stub }
    ],
  },
]);
