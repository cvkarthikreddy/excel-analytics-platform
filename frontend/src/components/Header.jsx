import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { clearCurrentFile } from '../features/files/fileSlice';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    dispatch(clearCurrentFile()); 
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Excel Analytics
        </Link>
        
        {/* This container holds all the authenticated links */}
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            // --- NEW LOGIC: Check if the user is an admin ---
            user.isAdmin ? (
              // --- ADMIN VIEW ---
              <>
                <span className="text-gray-700 font-semibold hidden sm:block">Welcome, {user?.name} (Admin)</span>
                <Link 
                  to="/admin" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-semibold text-sm transition-colors"
                >
                  Admin Panel
                </Link>
                <button 
                  onClick={onLogout} 
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-semibold text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              // --- REGULAR USER VIEW ---
              <>
                <span className="text-gray-700 font-semibold">Welcome, {user?.name}</span>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
                <button 
                  onClick={onLogout} 
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-semibold text-sm"
                >
                  Logout
                </button>
              </>
            )
          ) : (
            // --- GUEST VIEW (Not logged in) ---
            <ul className="flex items-center space-x-6">
              <li>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
              </li>
              <li>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold text-sm">
                  Register
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;