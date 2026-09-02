import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await api.get('/listings');
        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userID = payload.user_id;
        const mine = (res.data.listings || []).filter(l => l.user_id === userID);
        setListings(mine);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyListings();
  }, []);

  const handleMarkSold = async (listingID) => {
    try {
      await api.post(`/listings/${listingID}/sold`);
      setListings(prev => prev.filter(l => l.id !== listingID));
      alert('Listing marked as sold!');
    } catch (err) {
      alert('Failed to mark as sold');
    }
  };

  const conditionColor = (c) => ({
    new: 'bg-green-100 text-green-700',
    like_new: 'bg-blue-100 text-blue-700',
    good: 'bg-yellow-100 text-yellow-700',
    fair: 'bg-gray-100 text-gray-600',
  }[c] || 'bg-gray-100 text-gray-600');

  if (loading) return <div className="text-center py-20 text-gray-400">Loading your listings...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-500 mt-1">{listings.length} active listing{listings.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/post" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Post New
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20 border border-gray-100 rounded-2xl">
          <p className="text-4xl mb-4">🧥</p>
          <p className="text-gray-400 text-lg">No listings yet</p>
          <Link to="/post" className="mt-4 inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
            Post your first listing
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map(listing => (
            <div key={listing.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                🧥
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                <p className="text-orange-500 font-bold">KES {Number(listing.price)?.toLocaleString()}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${conditionColor(listing.condition)}`}>
                    {listing.condition?.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-400">{listing.area}</span>
                  <span className="text-xs text-gray-400">Size: {listing.size}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/listings/${listing.id}`)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-gray-700"
                >
                  View
                </button>
                <button
                  onClick={() => handleMarkSold(listing.id)}
                  className="text-xs bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-lg text-green-700"
                >
                  Mark Sold
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
