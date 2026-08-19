import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [currentUserID, setCurrentUserID] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserID(payload.user_id || '');
    }

    const fetchAll = async () => {
      try {
        const listingRes = await api.get(`/listing/${id}`);
        const found = listingRes.data.listing;
        setListing(found);

        if (found) {
          try {
            const sellerRes = await api.get(`/users/${found.user_id}`);
            setSeller(sellerRes.data.user);
          } catch (e) { setSeller(null); }
          try {
            const imagesRes = await api.get(`/listings/${id}/images`);
            setImages(imagesRes.data.images || []);
          } catch (e) { setImages([]); }
          try {
            const reviewsRes = await api.get(`/reviews/${found.user_id}`);
            setReviews(reviewsRes.data.reviews || []);
          } catch (e) { setReviews([]); }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setSending(true);
    setError('');
    try {
      await api.post('/messages', {
        receiver_id: listing.user_id,
        listing_id: id,
        body: message,
      });
      setSent(true);
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const conditionColor = (c) => ({
    new: 'bg-green-100 text-green-700',
    like_new: 'bg-blue-100 text-blue-700',
    good: 'bg-yellow-100 text-yellow-700',
    fair: 'bg-gray-100 text-gray-600',
  }[c] || 'bg-gray-100 text-gray-600');

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!listing) return <div className="text-center py-20 text-gray-400">Listing not found</div>;

  const isOwner = currentUserID === listing.user_id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/')} className="text-sm text-orange-500 hover:underline mb-6 block">
        ← Back to listings
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {images.length > 0 ? (
            <div className="space-y-3">
              {images.map(img => (
                <img key={img.id} src={img.url} alt={listing.title}
                  className="w-full rounded-2xl object-cover max-h-80" />
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-2xl h-72 flex items-center justify-center text-6xl">
              🧥
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
          <p className="text-3xl font-bold text-orange-500 mb-4">
            KES {Number(listing.price)?.toLocaleString()}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs px-3 py-1 rounded-full ${conditionColor(listing.condition)}`}>
              {listing.condition?.replace('_', ' ')}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              Size: {listing.size}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              {listing.category}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-600">
              📍 {listing.area}
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">{listing.description}</p>
          </div>

          {/* Seller info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-lg">
              👤
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {seller ? seller.name : 'Loading seller...'}
              </p>
              {seller?.location && (
                <p className="text-xs text-gray-400">📍 {seller.location}</p>
              )}
              {isOwner && <p className="text-xs text-orange-500 font-medium mt-1">This is your listing</p>}
            </div>
          </div>

          {/* Message seller */}
          {!isOwner && (
            <div className="border border-gray-100 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Message {seller ? seller.name : 'Seller'}
              </h3>
              {sent ? (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                  ✅ Message sent! Check your inbox for a reply.
                </div>
              ) : (
                <>
                  {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-3 text-sm">{error}</div>}
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Hi, is this still available?"
                    rows={3}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !message.trim()}
                    className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Seller Reviews</h2>
          <div className="space-y-3">
            {reviews.map(review => (
              <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
