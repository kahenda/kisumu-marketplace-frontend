import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const AREAS = ['', 'CBD', 'Milimani', 'Kondele', 'Kibuye', 'Nyalenda', 'Mamboleo', 'Otonglo', 'Manyatta', 'Bandani', 'Migosi', 'Riat', 'Lolwe', 'Kaloleni'];
const CATEGORIES = ['', 'tops', 'bottoms', 'dresses', 'suits', 'jackets', 'shoes', 'accessories', 'kids_clothing'];
const SIZES = ['', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'UK6', 'UK7', 'UK8', 'UK9', 'UK10', 'UK11', 'UK12', 'one_size'];
const CONDITIONS = ['', 'new', 'like_new', 'good', 'fair'];

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ area: '', category: '', size: '', condition: '' });

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.area) params.append('area', filters.area);
      if (filters.category) params.append('category', filters.category);
      if (filters.size) params.append('size', filters.size);
      if (filters.condition) params.append('condition', filters.condition);
      const res = await api.get(`/listings?${params.toString()}`);
      setListings(res.data.listings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, [filters]);

  const conditionColor = (c) => ({
    new: 'bg-green-100 text-green-700',
    like_new: 'bg-blue-100 text-blue-700',
    good: 'bg-yellow-100 text-yellow-700',
    fair: 'bg-gray-100 text-gray-600',
  }[c] || 'bg-gray-100 text-gray-600');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Items in Kisumu 🧥</h1>
        <p className="text-gray-500 mt-1">Secondhand fashion from your neighbourhood</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        <select
          value={filters.area}
          onChange={e => setFilters({...filters, area: e.target.value})}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All Areas</option>
          {AREAS.filter(a => a).map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <select
          value={filters.category}
          onChange={e => setFilters({...filters, category: e.target.value})}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All Categories</option>
          {CATEGORIES.filter(c => c).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={filters.size}
          onChange={e => setFilters({...filters, size: e.target.value})}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All Sizes</option>
          {SIZES.filter(s => s).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={filters.condition}
          onChange={e => setFilters({...filters, condition: e.target.value})}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All Conditions</option>
          {CONDITIONS.filter(c => c).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Listings */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading listings...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No listings found</p>
          <Link to="/post" className="mt-4 inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
            Post the first one!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map(listing => (
            <Link key={listing.id} to={`/listings/${listing.id}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition group">
              <div className="bg-gray-100 h-48 flex items-center justify-center text-4xl">
                🧥
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-orange-500">{listing.title}</h3>
                <p className="text-orange-500 font-bold mt-1">KES {listing.price.toLocaleString()}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${conditionColor(listing.condition)}`}>
                    {listing.condition?.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-400">{listing.area}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Size: {listing.size}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
