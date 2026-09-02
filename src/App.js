import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PostListing from './pages/PostListing';
import ListingDetail from './pages/ListingDetail';
import Inbox from './pages/Inbox';
import MyListings from './pages/MyListings';
import Navbar from './components/Navbar';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/listings/:id" element={<ProtectedRoute><ListingDetail /></ProtectedRoute>} />
          <Route path="/post" element={<ProtectedRoute><PostListing /></ProtectedRoute>} />
          <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
          <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
