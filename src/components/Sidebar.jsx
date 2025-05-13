import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { useContext } from "react";

export const Sidebar = () => {
  const { darkMode, toggleDarkMode, logout } = useContext(GlobalContext); // Access the dark mode state from context

  const handleLogout = () => {
    logout(); // Call the logout function from context
  };

  return (
    <aside
      className={`h-screen w-60 ${
        darkMode ? "bg-[#333] text-white" : "bg-[#ccc] text-black"
      } sticky top-0`}
    >


      <img src="/Logo.png" alt="Logo"/>

      <nav className="mt-5 ">
        {/* <p className="px-4 py-2">Welcome, {user?.name}!</p> */}
        <Link to="/" className="block px-4 py-2 hover:bg-gray-700">
          Dashboard
        </Link>
        <Link to="/products" className="block px-4 py-2 hover:bg-gray-700">
          Product
        </Link>
        <Link to="/sales" className="block px-4 py-2 hover:bg-gray-700">
          Sales
        </Link>
        <Link to="/expense" className="block px-4 py-2 hover:bg-gray-700">
          Expense
        </Link>
        <Link to="/supplier" className="block px-4 py-2 hover:bg-gray-700">
          Supplier
        </Link>
        <Link to="/inventory" className="block px-4 py-2 hover:bg-gray-700">
          Inventory
        </Link>
        <Link to="/customer" className="block px-4 py-2 hover:bg-gray-700">
          Customer
        </Link>
        <Link to="/udhaar" className="block px-4 py-2 hover:bg-gray-700">
          Udhaar
        </Link>
        <div className={`h-0.25 my-2 ${darkMode ? "bg-gray-50": "bg-gray-900"}`}></div>

        <Link to="/update-password" className="block px-4 py-2 hover:bg-gray-700">
          Update Password
        </Link>
        <Link to="/create-user" className="block px-4 py-2 hover:bg-gray-700">
          Create New User
        </Link>

        <button
          className={`bg-gray-700 px-4 py-2 m-4 float ${
            darkMode ? "bg-gray-600 text-white" : "bg-gray-500 text-white" }`}
          onClick={handleLogout}
        >
          Log-out
        </button>

        
        <label className="flex items-center cursor-pointer m-4 absolute bottom-0 left-0 mb-4 ml-4">
          <div className="relative">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="sr-only"
            />
            <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner transition-colors duration-300" />
            <div
              className={`dot absolute w-5 h-5 bg-white rounded-full shadow -left-1 -top-0.5 transition-transform duration-300 ${
                darkMode ? "translate-x-6" : "" }`}
            />
          </div>
          <span className="ml-3 text-sm font-medium">
            {darkMode ? "Dark Mode 🌘" : "Light Mode ☀️"}
          </span>
        </label>
      </nav>
    </aside>
  );
};
