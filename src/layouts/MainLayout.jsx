import { Outlet, useLocation } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import RoleSwitcher from "../components/RoleSwitcher";
export default function Layout() {
  const location=useLocation();
  return <div className="aptus-website">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Header/><AuthModal/><RoleSwitcher/>
    <main id="main-content" className={location.pathname==="/"?"catalog-host":"site-content"}><Outlet/></main>
    <Footer/>
  </div>;
}
