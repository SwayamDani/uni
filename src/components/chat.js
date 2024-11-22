import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import './chat.css';

const CardChat = ({ groupId }) => {
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
    if (currentUser) {
      const q = query(
        collection(db, 'groups', groupId, 'messages'),
        orderBy('timestamp', 'asc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(messagesData);
      });
      return () => unsubscribe();
    }
  }, [currentUser, groupId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      await addDoc(collection(db, 'groups', groupId, 'messages'), {
        text: newMessage,
        user: currentUser.uid,
        userName: currentUser.displayName,
        userPhotoURL: currentUser.photoURL,
        timestamp: new Date(),
      });
      setNewMessage('');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!currentUser) {
    return <p className="header-container">Please sign in to use the chat.</p>;
  }

  return (
    <section>
      <div className="container py-5">
        <div className="row d-flex justify-content-center">
          <div className="card-chat-container">
            <div className="card" id="chat2">
              <div className="card-header d-flex justify-content-between align-items-center p-3">
                <h5 className="mb-0">Chat</h5>
              </div>
              <div className="card-body" style={{ position: 'relative', height: '400px' }}>
                {messages.map((message) => (
                  <div key={message.id} className={`d-flex flex-row justify-content-${message.user === currentUser.uid ? 'end' : 'start'} mb-4`}>
                    {message.user !== currentUser.uid && (
                      <img src={message.userPhotoURL || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"} alt="avatar" className="avatar" />
                    )}
                    <div>
                      <p className="small mb-1">{message.userName}</p>
                      <p className={`small p-2 ${message.user === currentUser.uid ? 'me-3 text-white bg-primary' : 'ms-3 bg-body-tertiary'} mb-1 rounded-3`}>
                        {message.text}
                      </p>
                      <p className={`small ${message.user === currentUser.uid ? 'me-3' : 'ms-3'} mb-3 rounded-3 text-muted d-flex justify-content-${message.user === currentUser.uid ? 'end' : 'start'}`}>
                        {new Date(message.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.user === currentUser.uid && (
                      <img src={message.userPhotoURL || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"} alt="avatar" className="avatar" />
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                <img src={currentUser.photoURL || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"} alt="avatar" className="avatar-small" />
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Type message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <a className="ms-3" href="#!" onClick={handleSendMessage}><i className="fas fa-paper-plane"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardChat;