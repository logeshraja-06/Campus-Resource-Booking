import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        <h1 className="text-2xl font-bold text-cyan-400">
          Campus Booking
        </h1>

        <div className="flex gap-8 font-medium">

          <Link to="/" className="hover:text-cyan-400">
            Home
          </Link>

          <Link to="/resources" className="hover:text-cyan-400">
            Resources
          </Link>

          <Link to="/login" className="hover:text-cyan-400">
            Login
          </Link>

          <Link to="/register" className="hover:text-cyan-400">
            Register
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;