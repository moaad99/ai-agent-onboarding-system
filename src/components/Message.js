import React from 'react';
import './Message.css';

const Message = ({ message }) => {
  const isUser = message.type === 'user';
  const isBot = message.type === 'bot';
  
  const formatContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Check for bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={index} className="message-list-item">
            {line}
          </div>
        );
      }
      // Check for numbered lists
      if (/^\d+\./.test(line.trim())) {
        return (
          <div key={index} className="message-list-item">
            {line}
          </div>
        );
      }
      return (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-bot'}`}>
      {isBot && (
        <div className="bot-avatar">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <defs>
              <linearGradient id="avatarGradient" x1="0" y1="0" x2="36" y2="36">
                <stop offset="0%" stopColor="#0047FF"/>
                <stop offset="100%" stopColor="#0066FF"/>
              </linearGradient>
            </defs>
            <circle cx="18" cy="18" r="16" fill="url(#avatarGradient)"/>
            <path d="M18 11v8m0 0l-3-3m3 3l3-3M15 25h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-bot'}`}>
        <div className="message-content">
          {formatContent(message.content)}
        </div>
        {message.timestamp && (
          <div className="message-timestamp">
            {new Date(message.timestamp).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
