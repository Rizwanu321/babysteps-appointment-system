import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiCalendar, FiUsers, FiHome, FiX, FiMenu } from "react-icons/fi";

const Sidebar = ({ isOpen, onClose, onOpen }) => {
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-blue-500 text-white md:hidden"
          aria-label="Open menu"
        >
          <FiMenu size={24} />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 h-screen bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-blue-600">BabySteps</h1>
          <button
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="/"
            className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 ${
              isActiveRoute("/")
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
            onClick={() => onClose()}
          >
            <FiHome size={20} />
            <span>Home</span>
          </Link>
          <Link
            to="/doctors"
            className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 ${
              isActiveRoute("/doctors")
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
            onClick={() => onClose()}
          >
            <FiUsers size={20} />
            <span>Doctors</span>
          </Link>
          <Link
            to="/appointments"
            className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 ${
              isActiveRoute("/appointments")
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
            onClick={() => onClose()}
          >
            <FiCalendar size={20} />
            <span>Appointments</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
