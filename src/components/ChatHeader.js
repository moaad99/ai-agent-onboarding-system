import React from 'react';
import './ChatHeader.css';

const ChatHeader = () => {
  return (
    <div className="chat-header">
      <div className="header-left">
        <div className="agent-icon">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <defs>
              <linearGradient id="headerGradient" x1="0" y1="0" x2="36" y2="36">
                <stop offset="0%" stopColor="#ffffff"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0.8)"/>
              </linearGradient>
            </defs>
            <circle cx="18" cy="18" r="16" fill="url(#headerGradient)" opacity="0.2"/>
            <circle cx="18" cy="18" r="14" fill="url(#headerGradient)"/>
            <path d="M18 10v8m0 0l-4-4m4 4l4-4M14 24h8" stroke="#0047FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="header-text">
          <h1 className="header-title">Onboarding Assistant</h1>
          <p className="header-subtitle">Eurecia × Azure DevOps</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
