import React, { useState, useRef, useEffect } from "react";

export default function ProfileMenu({handleClick}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const toggleMenu = () => setOpen(!open);

  // Close menu if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Icon */}
      <div
        className="w-8 h-8 bg-gray-300 rounded-full cursor-pointer flex items-center justify-center"
        onClick={toggleMenu}
      >
        <span className="text-sm font-bold text-gray-600">U</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-md py-1 z-10">
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
             onClick={() => handleClick("profile")}
          >
            My Profile
          </button>
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
             onClick={() => handleClick("purchaseapi")}
          >
            Purchase API
          </button>
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => handleClick("logout")}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
