import Footer from "@/components/homepage/Footer";
import MainHeader from "@/components/MainHeader";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />

      <Outlet />
      <Footer/>

    </div>
  );
}

export default Layout;
