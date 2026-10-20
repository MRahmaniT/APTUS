import { createBrowserRouter } from "react-router";
import Layout from "./layouts/MainLayout";
import Home from "./views/Home";
import Products from "./views/Products";
import AdminAnalytics from "./views/AdminAnalytics";
import AdminContent from "./views/AdminContent";
import AdminPages from "./views/AdminPages";
import AdminProfile from "./views/AdminProfile";
import StaticPage from "./views/StaticPage";
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

      { path: "products", Component: Products },
      { path: "products/:slug", Component: ProductDetail },

      { path: "news", Component: NewsIndex },
      { path: "news/latest", Component: NewsIndex },
      { path: "news/events", Component: NewsIndex },
      { path: "news/exhibitions", Component: NewsIndex },
      { path: "news/:slug", Component: NewsDetail },

      { path: "projects", Component: ProjectsIndex },
      { path: "projects/:slug", Component: ProjectDetail },
      { path: "work", Component: ProjectsIndex },

      { path: "about/location", Component: () => <StaticPage pagePath="about/location" /> },
      { path: "about/contact", Component: () => <StaticPage pagePath="about/contact" /> },
      { path: "about/partners", Component: () => <StaticPage pagePath="about/partners" /> },
      { path: "about/memberships", Component: () => <StaticPage pagePath="about/memberships" /> },
      { path: "about/affiliations", Component: () => <StaticPage pagePath="about/affiliations" /> },

      {
        path: "library",
        Component: ProtectedLibraryRoute,
        children: [
          { path: "codes", Component: () => <StaticPage pagePath="library/codes" /> },
          { path: "books", Component: () => <StaticPage pagePath="library/books" /> },
          { path: "articles", Component: () => <StaticPage pagePath="library/articles" /> },
          { path: "glossary", Component: () => <StaticPage pagePath="library/glossary" /> },
        ],
      },

      {
        path: "admin",
        Component: AdminRoute,
        children: [
          { path: "analytics", Component: AdminAnalytics },
          { path: "content", Component: AdminContent },
          { path: "pages", Component: AdminPages },
          { path: "profile", Component: AdminProfile },
        ],
      },

      { path: "*", Component: Stub },
    ],
  },
]);
