import React, { useState, useRef, useEffect } from 'react';
import './ChatWindow.css';
import WindowControls from './WindowControls';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '👋 Welcome to your Employee Onboarding Assistant!\n\nI\'m here to help you with:\n\n🏢 Eurecia HR System\n• Leave balance & requests\n• Salary & payroll information\n• Personal profile & documents\n\n💻 Azure DevOps\n• Project access & permissions\n• Repository information\n• Sprint & work items\n\n📋 General Support\n• Company policies\n• Onboarding procedures\n• IT & HR contacts\n\nHow can I assist you today?',
      timestamp: new Date(),
      isWelcome: true
    }
  ]);

  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);

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
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: message,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);

      // Simulate AI response
      setTimeout(() => {
        let botResponse = 'I\'m processing your request. In the production version, I\'ll connect to Eurecia and Azure DevOps APIs to provide you with real-time information.';
        
        // Simulate different responses based on query
        if (message.toLowerCase().includes('leave') || message.toLowerCase().includes('congé')) {
          botResponse = '📊 Checking your leave balance...\n\nYour current leave status:\n• Annual Leave: 15 days remaining\n• Sick Leave: 5 days available\n• Personal Days: 3 days remaining\n\nWould you like to request time off?';
        } else if (message.toLowerCase().includes('salary') || message.toLowerCase().includes('salaire')) {
          botResponse = '💼 Your salary information is confidential and will be retrieved from Eurecia.\n\nFor detailed payslip information, please check your Eurecia account or contact HR directly.';
        } else if (message.toLowerCase().includes('azure') || message.toLowerCase().includes('devops')) {
          botResponse = '💻 Azure DevOps Access:\n\n1. Visit: dev.azure.com\n2. Sign in with your company email\n3. You have access to the following projects:\n   • Project Alpha\n   • Internal Tools\n   • Documentation\n\nNeed help with a specific project?';
        } else if (message.toLowerCase().includes('profile')) {
          botResponse = '👤 Your Profile Information:\n\nName: [Retrieved from Eurecia]\nDepartment: [Retrieved from Eurecia]\nPosition: [Retrieved from Eurecia]\nStart Date: [Retrieved from Eurecia]\n\nWould you like to update any information?';
        }

        const aiResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: botResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
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
