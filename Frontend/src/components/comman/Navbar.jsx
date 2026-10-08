import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"

function Navbar() {
  return (
    <nav className="bg-[#0F172A] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 py-2 flex justify-between items-center">

        <Link
          to="/"
          className="text-2xl font-bold text-white"
        >
          <img src={logo} alt ="CertifyHub"  className="w-50"/>
         
        </Link>

        <div className="flex gap-6 text-white ">
          <Link className="bg-[#0F172A] p-1 rounded-xl hover:bg-[#223356]  " to="/">
            Home
          </Link>
          <Link className="bg-[#0F172A] p-1 rounded-xl hover:bg-[#223356] " to="/verify">
            Verify
          </Link>
          <Link className="bg-[#0F172A] p-1 rounded-xl hover:bg-[#223356]" to="/login">
            Login
          </Link>
        </div>

      </div>
      
    </nav>
  );
}

export default Navbar;