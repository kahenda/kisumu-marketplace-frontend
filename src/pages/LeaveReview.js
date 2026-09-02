import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

export default function LeaveReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sellerID, listingID, sellerName } = location.state || {};
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/reviews', {
        seller_id: sellerID,
        listing_id: listingID,
        rating: rating,
        comment: comment,
      });
      navigate(-1);
      alert('Review submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-sm text-orange-500 hover:underline mb-6 block">
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Leave a Review</h1>
      <p className="text-gray-500 mb-8">
        How was your experience with {sellerName || 'this seller'}?
      </p>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        {/* Star rating */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Rating</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="text-3xl transition-transform hover:scale-110"
              >
                <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Tell others about your experience..."
            rows={4}
          />
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <button
          onClick={handleSubmit}
          disabled={submitting || rating === 0}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
}
