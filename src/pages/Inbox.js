import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await api.get('/messages/inbox');
        setMessages(res.data.messages || []);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Inbox</h1>
      <p className="text-gray-500 mb-8">Messages from buyers and sellers</p>

      {messages.length === 0 ? (
        <div className="text-center py-20 border border-gray-100 rounded-2xl">
          <p className="text-4xl mb-4">💬</p>
          <p className="text-gray-400">No messages yet</p>
          <p className="text-gray-400 text-sm mt-1">When someone messages you it will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-orange-200 transition">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                  About listing
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed">{msg.body}</p>
              <p className="text-xs text-gray-400 mt-2">From: {msg.sender_id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
