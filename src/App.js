import React, { useState, useEffect } from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow';
import { initializeAuth, isAuthenticated } from './services/authService';

function App() {
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    authenticated: false,
    error: null
  });

  useEffect(() => {
    // Check authentication on app startup
    const checkAuth = async () => {
      // Check if already authenticated
      if (isAuthenticated()) {
        console.log('User already authenticated');
        setAuthStatus({
          loading: false,
          authenticated: true,
          error: null
        });
        return;
      }

      // Initialize authentication from credentials file
      console.log('Attempting authentication from credentials file...');
      const result = await initializeAuth();

      if (result.success) {
        setAuthStatus({
          loading: false,
          authenticated: true,
          error: null
        });
      } else {
        setAuthStatus({
          loading: false,
          authenticated: false,
          error: result.error
        });
      }
    };

    checkAuth();
  }, []);

  // Loading screen
  if (authStatus.loading) {
    return (
      <div className="App">
        <div className="auth-loading">
          <div className="spinner"></div>
          <p>Authenticating...</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (authStatus.error) {
    return (
      <div className="App">
        <div className="auth-error">
          <h2>Authentication Failed</h2>
          <p>{authStatus.error}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main app (authenticated)
  return (
    <div className="App">
      <ChatWindow />
    </div>
  );
}

export default App;
