import { createBrowserRouter } from "react-router";
import Layout from "./layouts/MainLayout";
import Home from "./views/Home";
import Products from "./views/Products";
import AdminAnalytics from "./views/AdminAnalytics";
import AdminContent from "./views/AdminContent";
import { NewsIndex, ProjectsIndex } from "./views/ContentIndex";
import { NewsDetail, ProductDetail, ProjectDetail } from "./views/ContentPage";
import { ProtectedLibraryRoute, AdminRoute } from "./components/ProtectedRoutes";

const Stub = () => <div className="py-20 text-center text-gray-500">Page under construction...</div>;

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },

      // CMS-driven product catalogue and product details
      { path: "products", Component: Products },
      { path: "products/:slug", Component: ProductDetail },

      // CMS-driven news. Existing menu URLs remain valid.
      { path: "news", Component: NewsIndex },
      { path: "news/latest", Component: NewsIndex },
      { path: "news/events", Component: NewsIndex },
      { path: "news/exhibitions", Component: NewsIndex },
      { path: "news/:slug", Component: NewsDetail },

      // Work / case studies
      { path: "projects", Component: ProjectsIndex },
      { path: "projects/:slug", Component: ProjectDetail },
      { path: "work", Component: ProjectsIndex },

      // Library (Restricted)
      {
        path: "library",
        Component: ProtectedLibraryRoute,
        children: [
          { path: "codes", Component: Stub },
          { path: "books", Component: Stub },
          { path: "articles", Component: Stub },
          { path: "glossary", Component: Stub },
        ],
      },

      // Admin (Restricted)
      {
        path: "admin",
        Component: AdminRoute,
        children: [
          { path: "analytics", Component: AdminAnalytics },
          { path: "content", Component: AdminContent },
        ],
      },

      { path: "*", Component: Stub },
    ],
  },
]);
