import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AREAS = ['CBD','Milimani','Kondele','Kibuye','Nyalenda','Mamboleo','Otonglo','Manyatta','Bandani','Migosi','Riat','Lolwe','Kaloleni'];
const CATEGORIES = ['tops','bottoms','dresses','suits','jackets','shoes','accessories','kids_clothing'];
const SIZES = ['XXS','XS','S','M','L','XL','XXL','XXXL','UK6','UK7','UK8','UK9','UK10','UK11','UK12','one_size'];
const CONDITIONS = ['new','like_new','good','fair'];
const GENDERS = ['male','female','unisex','kids'];

export default function PostListing() {
  const [form, setForm] = useState({
    title: '', description: '', price: '',
    category: '', gender: '', size: '', condition: '', area: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/listings', {
        ...form,
        price: parseFloat(form.price)
      });
      const listingID = res.data.listing.id;

      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        await api.post(`/listings/${listingID}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Listing</h1>
      <p className="text-gray-500 mb-8">Sell your clothes to people in Kisumu</p>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="e.g. Blue Denim Jacket"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Describe the item, any defects etc."
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES)</label>
          <input
            type="number"
            value={form.price}
            onChange={e => setForm({...form, price: e.target.value})}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="e.g. 500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={form.gender}
              onChange={e => setForm({...form, gender: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            >
              <option value="">Select gender</option>
              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
            <select
              value={form.size}
              onChange={e => setForm({...form, size: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            >
              <option value="">Select size</option>
              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select
              value={form.condition}
              onChange={e => setForm({...form, condition: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            >
              <option value="">Select condition</option>
              {CONDITIONS.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Area in Kisumu</label>
          <select
            value={form.area}
            onChange={e => setForm({...form, area: e.target.value})}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          >
            <option value="">Select area</option>
            {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? 'Posting...' : 'Post Listing'}
        </button>
      </form>
    </div>
  );
}
