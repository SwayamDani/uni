import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import './chat.css';

const CardChat = ({ groupId, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'groups', groupId, 'messages'), orderBy('timestamp', 'asc'));
      const unsubscribeMessages = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(fetchedMessages);
        scrollToBottom();
      });

      return () => unsubscribeMessages();
    }
  }, [groupId, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && user) {
      await addDoc(collection(db, 'groups', groupId, 'messages'), {
        text: newMessage,
        user: user.uid,
        timestamp: new Date(),
      });
      setNewMessage('');
    }
  };

  if (!user) {
    return <p className="header-container">Please sign in to use the chat.</p>;
  }

  return (
    <div className="card-chat-container">
      <div className="header-container">Chat Room</div>
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.user === user.uid ? 'sent' : 'received'}`}>
            <p>{message.text}</p>
            <div className="timestamp">{new Date(message.timestamp?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage() : null}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default CardChat;
