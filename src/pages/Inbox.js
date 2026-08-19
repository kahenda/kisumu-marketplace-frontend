import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState('');
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserID(payload.user_id || '');
    }
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages/inbox');
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    try {
      const otherID = selected.sender_id === userID ? selected.receiver_id : selected.sender_id;
      await api.post('/messages', {
        receiver_id: otherID,
        listing_id: selected.listing_id,
        body: reply,
      });
      setReply('');
      await fetchMessages();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading messages...</div>;

  // Conversation view
  if (selected) {
    const conversation = messages.filter(m =>
      m.listing_id === selected.listing_id &&
      ((m.sender_id === selected.sender_id && m.receiver_id === selected.receiver_id) ||
       (m.sender_id === selected.receiver_id && m.receiver_id === selected.sender_id))
    ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => setSelected(null)} className="text-sm text-orange-500 hover:underline mb-6 block">
          ← Back to inbox
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Conversation</h2>

        <div className="space-y-3 mb-6 min-h-40">
          {conversation.map(msg => {
            const isMine = msg.sender_id === userID;
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${isMine ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {msg.body}
                  <div className={`text-xs mt-1 ${isMine ? 'text-orange-100' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply box */}
        <div className="border border-gray-200 rounded-2xl p-4">
          <textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Type your reply..."
            rows={3}
          />
          <button
            onClick={handleReply}
            disabled={sending || !reply.trim()}
            className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </div>
    );
  }

  // Group by conversation
  const grouped = {};
  messages.forEach(msg => {
    const key = `${msg.listing_id}-${[msg.sender_id, msg.receiver_id].sort().join('-')}`;
    if (!grouped[key]) grouped[key] = msg;
  });
  const conversations = Object.values(grouped);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
      <p className="text-gray-500 mb-8">Your conversations</p>

      {conversations.length === 0 ? (
        <div className="text-center py-20 border border-gray-100 rounded-2xl">
          <p className="text-4xl mb-4">💬</p>
          <p className="text-gray-400">No messages yet</p>
          <p className="text-gray-400 text-sm mt-1">Browse listings and message a seller to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map(msg => {
            const isSent = msg.sender_id === userID;
            return (
              <div
                key={msg.id}
                onClick={() => setSelected(msg)}
                className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-orange-200 hover:shadow-sm transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${isSent ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-600'}`}>
                      {isSent ? '📤 Sent' : '📥 Received'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {isSent ? `To: ${msg.receiver_id.slice(0, 8)}...` : `From: ${msg.sender_id.slice(0, 8)}...`}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed truncate">{msg.body}</p>
                <p className="text-xs text-orange-400 mt-2">Click to open conversation →</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
