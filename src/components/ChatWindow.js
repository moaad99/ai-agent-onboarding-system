import React, { useState, useRef, useEffect } from 'react';
import './ChatWindow.css';
import WindowControls from './WindowControls';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { getUser, getAuthToken } from '../services/authService';
import { initializeSocket, sendMessage, onBotResponse, isSocketConnected, onMessage } from '../services/socketService';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const user = getUser();

  // Initialize socket and welcome message
  useEffect(() => {
    console.log("runnung use effect");
    
    const token = getAuthToken();
    const userName = user?.name || 'there';
    
    // Initialize socket connection with token
    console.log('Initializing socket connection with token...');
    const socket = initializeSocket(token);
    
    // Check connection status
 socket.on('connect', () => {
  console.log('Socket connected successfully');
  setSocketConnected(true);

  onMessage((data) => {
    setMessages(prevMessages => {
      return [...prevMessages, data];
    });
  });
});
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setSocketConnected(false);
    });
    
    
    // Welcome message
    const welcomeMessage = {
      id: 1,
      type: 'bot',
      content: `👋 Welcome ${userName} to your Employee Onboarding Assistant!\n\nI'm here to help you with:\n\n🏢 Eurecia HR System\n• Leave balance & requests\n• Salary & payroll information\n• Personal profile & documents\n\n💻 Azure DevOps\n• Project access & permissions\n• Repository information\n• Sprint & work items\n\n📋 General Support\n• Company policies\n• Onboarding procedures\n• IT & HR contacts\n\nHow can I assist you today?`,
      timestamp: new Date(),
      isWelcome: true
    };
    setMessages([welcomeMessage]);
    
    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.disconnect();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { id: 1, label: 'Check Leave Balance', query: 'What is my current leave balance?' },
    { id: 2, label: 'Salary Information', query: 'I have a question about my salary' },
    { id: 3, label: 'My Profile', query: 'Show me my profile information' },
    { id: 4, label: 'Azure DevOps Access', query: 'How do I access Azure DevOps?' },
  ];

  const handleQuickAction = (query) => {
    setShowQuickActions(false);
    handleSendMessage(query);
  };

  const handleSendMessage = (message) => {
    if (message.trim()) {

      // Send message via Socket.IO
      if (isSocketConnected()) {
        console.log('Sending message via socket:', message);
        sendMessage({
          content:  message,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error('Socket not connected, cannot send message');
        // Show error message
        const errorMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: '⚠️ Connection lost. Please refresh the app.',
          timestamp: new Date()
        };
       // setMessages(prev => [...prev, errorMessage]);
      }
    }
  };

  return (
    <div className="chat-window">
      <WindowControls />
      <ChatHeader />
      <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      {showQuickActions && messages.length <= 1 && (
        <div className="quick-actions">
          <p className="quick-actions-title">Quick Actions</p>
          <div className="quick-actions-grid">
            {quickActions.map(action => (
              <button
                key={action.id}
                className="quick-action-btn"
                onClick={() => handleQuickAction(action.query)}
              >
                <span className="quick-action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="chat-footer">
        <MessageInput onSendMessage={handleSendMessage} />
        <p className="branding">
          Powered by <span className="brand-name">Eurecia</span> × <span className="brand-name">Azure DevOps</span>
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
