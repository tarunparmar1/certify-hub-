import { Outlet } from "react-router-dom";
import Navbar from "../components/comman/Navbar.jsx";
import Footer from "../components/comman/Footer.jsx";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col ">
  <Navbar  />

     <div>
        <Outlet />
     </div>

      <Footer />
    </div>
  );
}

export default MainLayout;