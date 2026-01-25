import React, { useState } from 'react';
import './MessageInput.css';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <div className="message-input-container">
        <button type="button" className="attach-btn" title="Attach file">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M12.5 10.5L9.5 13.5C8.67157 14.3284 7.32843 14.3284 6.5 13.5C5.67157 12.6716 5.67157 11.3284 6.5 10.5L10.5 6.5C11.0523 5.94772 11.9477 5.94772 12.5 6.5C13.0523 7.05228 13.0523 7.94772 12.5 8.5L8.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <input
          type="text"
          className="message-input"
          placeholder="Type your message here ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button type="submit" className="send-btn" title="Send message">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M16 2L8 10M16 2L11 16L8 10M16 2L2 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
