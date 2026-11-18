import { createBrowserRouter, redirect } from "react-router";
import Layout from "./layouts/MainLayout";
import About from "./views/About";
import ApplicationPage from "./views/Applications";
import Types, { TypeDetail } from "./views/Types";
import Statistics from "./views/Statistics";
import { ArticlesIndex, ArticleDetail } from "./views/Articles";
import Home from "./views/Home";
import { isTypeFamily } from "./data/typeFamilies";
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

      { path: "products", loader: () => redirect("/types") },
      { path: "components", Component: Products },
      { path: "types", Component: Types },
      { path: "types/:slug", Component: TypeDetail },
      { path: "about", Component: About },
      { path: "library/articles", Component: ArticlesIndex },
      { path: "library/articles/:slug", Component: ArticleDetail },
      { path: "products/:slug", loader: ({params}) => isTypeFamily(params.slug || "") ? redirect("/types/" + params.slug) : null, Component: ProductDetail },

      { path: "news", Component: NewsIndex },
      { path: "news/latest", Component: NewsIndex },
      { path: "news/events", Component: NewsIndex },
      { path: "news/exhibitions", Component: NewsIndex },
      { path: "news/:slug", Component: NewsDetail },


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
        Component: AdminRoute,
        children: [
          { path: "projects", Component: ProjectsIndex },
          { path: "projects/:slug", Component: ProjectDetail },
          { path: "work", loader: () => redirect("/projects") },
          { path: "about/statistics", Component: Statistics },
          { path: "applications/:slug", Component: ApplicationPage },
          { path: "admin/analytics", Component: AdminAnalytics },
          { path: "admin/content", Component: AdminContent },
          { path: "admin/pages", Component: AdminPages },
          { path: "admin/profile", Component: AdminProfile },
        ],
      },

      { path: "*", Component: Stub },
    ],
  },
]);

