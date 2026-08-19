import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await api.get('/messages/inbox');
        const msgs = res.data.messages || [];
        setMessages(msgs);

        // get current user id from first message
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserID(payload.user_id || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading messages...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
      <p className="text-gray-500 mb-8">Your sent and received messages</p>

      {messages.length === 0 ? (
        <div className="text-center py-20 border border-gray-100 rounded-2xl">
          <p className="text-4xl mb-4">💬</p>
          <p className="text-gray-400">No messages yet</p>
          <p className="text-gray-400 text-sm mt-1">Browse listings and message a seller to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => {
            const isSent = msg.sender_id === userID;
            return (
              <div
                key={msg.id}
                onClick={() => navigate(`/listings/${msg.listing_id}`)}
                className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-orange-200 hover:shadow-sm transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${isSent ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-600'}`}>
                      {isSent ? '📤 Sent' : '📥 Received'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {isSent
                        ? `To: ${msg.receiver_id.slice(0, 8)}...`
                        : `From: ${msg.sender_id.slice(0, 8)}...`}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">{msg.body}</p>
                <p className="text-xs text-orange-400 mt-2">Click to view listing →</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
