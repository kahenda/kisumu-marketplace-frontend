import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-orange-500">Kisumu Market 🧥</Link>
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-gray-600 hover:text-orange-500">Browse</Link>
            <Link to="/post" className="text-sm text-gray-600 hover:text-orange-500">Sell</Link>
            <Link to="/inbox" className="text-sm text-gray-600 hover:text-orange-500">Messages</Link>
            <button onClick={handleLogout} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-gray-700">Logout</button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="text-sm text-gray-600 hover:text-orange-500">Login</Link>
            <Link to="/register" className="text-sm bg-orange-500 text-white px-4 py-1.5 rounded-lg hover:bg-orange-600">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
