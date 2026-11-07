import { createBrowserRouter } from "react-router";
import Layout from "./layouts/MainLayout";
import About from "./views/About";
import ApplicationPage from "./views/Applications";
import Types from "./views/Types";
import Statistics from "./views/Statistics";
import { ArticlesIndex, ArticleDetail } from "./views/Articles";
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
      { path: "components", Component: () => <Products elementsOnly /> },
      { path: "types", Component: Types },
      { path: "applications/:slug", Component: ApplicationPage },
      { path: "about", Component: About },
      { path: "about/statistics", Component: Statistics },
      { path: "library/articles", Component: ArticlesIndex },
      { path: "library/articles/:slug", Component: ArticleDetail },
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

