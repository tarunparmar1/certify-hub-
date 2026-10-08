
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"

function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    navigate("/login");
  };

  return (
    <div className="w-full h-20 bg-slate-900 text-white px-6 flex items-center justify-between ">
      
 <NavLink
          to="/"
          className="text-2xl font-bold text-white"
        >
          <img src={logo} alt ="CertifyHub"  className="w-50"/>
         
        </NavLink>

   
      <div className="flex items-center gap-4">

        <NavLink
          to="/admin/events"
          className="px-4 py-2 rounded hover:bg-slate-800"
        >
          Dashboard
        </NavLink>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-red-800 hover:bg-red-700"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Topbar;

