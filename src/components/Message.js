import React from 'react';
import './Message.css';

const Message = ({ message }) => {
  const isUser = message.type === 'user';
  const isBot = message.type === 'bot';
  
  // Get IPC renderer for Electron
  const getIpcRenderer = () => {
    try {
      if (typeof window !== 'undefined' && window.require) {
        const { ipcRenderer } = window.require('electron');
        return ipcRenderer;
      }
    } catch (error) {
      console.error('Failed to get IPC renderer:', error);
    }
    return null;
  };

  // Handle link click - open in default browser
  const handleLinkClick = async (e, url) => {
    e.preventDefault();
    const ipcRenderer = getIpcRenderer();
    
    if (ipcRenderer) {
      try {
        await ipcRenderer.invoke('open-external-url', url);
      } catch (error) {
        console.error('Error opening URL:', error);
        // Fallback to window.open if IPC fails
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Fallback for non-Electron environments
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  // Function to detect and convert URLs to clickable links
  const linkifyText = (text) => {
    // URL regex pattern - matches http://, https://, and www. URLs
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = urlRegex.exec(text)) !== null) {
      // Add text before the URL
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Process the URL
      let url = match[0];
      let href = url;
      
      // Add protocol if missing
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        href = 'https://' + url;
      }
      
      // Create clickable link
      parts.push(
        <a
          key={`link-${key++}`}
          href={href}
          onClick={(e) => handleLinkClick(e, href)}
          className="message-link"
        >
          {url}
        </a>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text after last URL
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    // If no URLs found, return original text
    return parts.length > 0 ? parts : text;
  };
  
  const formatContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Check for bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={index} className="message-list-item">
            {linkifyText(line)}
          </div>
        );
      }
      // Check for numbered lists
      if (/^\d+\./.test(line.trim())) {
        return (
          <div key={index} className="message-list-item">
            {linkifyText(line)}
          </div>
        );
      }
      return (
        <React.Fragment key={index}>
          {linkifyText(line)}
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
