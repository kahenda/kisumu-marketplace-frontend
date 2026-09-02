import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userID = payload.user_id;
        const res = await api.get('/messages/inbox');
        const messages = res.data.messages || [];
        const received = messages.filter(m => m.receiver_id === userID);
        setUnread(received.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (location.pathname === '/inbox') setUnread(0);
  }, [location.pathname]);

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
            <Link to="/my-listings" className="text-sm text-gray-600 hover:text-orange-500">My Listings</Link>
            <Link to="/inbox" className="text-sm text-gray-600 hover:text-orange-500 relative">
              Messages
              {unread > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>
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
