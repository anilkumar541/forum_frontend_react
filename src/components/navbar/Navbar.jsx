import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';

const Navbar = () => {
  const { user, logout }= useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-lg font-bold"><Link to={"/"}>Logo</Link></div>
      
      <div className="hidden md:flex space-x-4">
        <Link to={"/"} className="hover:text-gray-400">Home</Link>
        {!user ? (
            <>
                <Link to={"/signup"} className="hover:text-gray-400">Signup</Link>
                <Link to={"/login"} className="hover:text-gray-400">Login</Link>
            </>
        ) : (
            <button onClick={logout} className="hover:text-gray-400">Logout</button>
        )}
      </div>

      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {isOpen && (
        <div ref={menuRef} className="absolute top-16 right-4 bg-gray-700 rounded-lg shadow-lg md:hidden">
          <Link to={"/"} className="block px-4 py-2 hover:text-gray-400">Home</Link>
          <Link to={"/contact"} className="block px-4 py-2 hover:text-gray-400">Contact</Link>
          {!user ? (
              <>
                  <Link to={"/signup"} className="block px-4 py-2 hover:text-gray-400">Signup</Link>
                  <Link to={"/login"} className="block px-4 py-2 hover:text-gray-400">Login</Link>
              </>
          ) : (
              <button onClick={logout} className="block px-4 py-2 hover:text-gray-400">Logout</button>
          )}
          
        </div>
      )}
    </nav>
  );
};

export default Navbar;
