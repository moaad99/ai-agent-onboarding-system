/**
 * Authentication Service
 * Handles user authentication on app startup
 * Uses IPC to communicate with Electron main process for file operations
 */

const CREDENTIALS_PATH = 'C:\\Users\\msell\\Desktop\\credentials.txt';
const AUTH_URL = 'http://localhost:4200/api/auth/signin';

// Get IPC renderer
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

/**
 * Read credentials from file using IPC
 */
export const readCredentials = async () => {
  try {
    const ipcRenderer = getIpcRenderer();
    
    if (!ipcRenderer) {
      throw new Error('Electron IPC not available. Make sure the app is running in Electron.');
    }

    console.log('Reading credentials from:', CREDENTIALS_PATH);
    
    // Use IPC to read file from main process
    const result = await ipcRenderer.invoke('file:readCredentials', CREDENTIALS_PATH);
    
    if (!result.success) {
      return {
        success: false,
        error: 'Failed to read credentials file: ' + result.error
      };
    }

    console.log('Credentials file read successfully, parsing...');
    
    // Parse credentials
    const lines = result.content.split('\n');
    const credentials = {};

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && trimmed.includes('=')) {
        const [key, value] = trimmed.split('=');
        credentials[key.trim()] = value.trim();
      }
    });

    if (!credentials.email || !credentials.password) {
      return {
        success: false,
        error: 'Invalid credentials format. Expected:\nemail=your@email.com\npassword=yourpassword'
      };
    }

    console.log('Credentials parsed successfully');
    
    return {
      success: true,
      email: credentials.email,
      password: credentials.password
    };
  } catch (error) {
    console.error('Error reading credentials:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Authenticate user with the API
 */
export const authenticateUser = async (email, password) => {
  console.log('Authenticating with email:', email);
  console.log('API URL:', AUTH_URL);
  
  try {
    const requestBody = {
      email: email,
      password: password
    };
    
    console.log('Sending POST request with body:', { email, password: '***' });
    
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    console.log('Response OK:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(errorData.message || `Authentication failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Authentication response:', data);
    
    return {
      success: true,
      token: data.token,
      user: data.user,
      data
    };
  } catch (error) {
    console.error('Authentication error:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.name,
      stack: error.stack
    });
    
    return {
      success: false,
      error: error.message || 'Failed to connect to authentication server'
    };
  }
};

/**
 * Initialize authentication on app startup
 */
export const initializeAuth = async () => {
  console.log('Initializing authentication...');
  
  // Read credentials from file
  const credResult = await readCredentials();
  
  if (!credResult.success) {
    console.error('Failed to read credentials:', credResult.error);
    return {
      success: false,
      error: credResult.error,
      step: 'read_credentials'
    };
  }

  console.log('Credentials loaded, authenticating...');
  
  // Authenticate with API
  const authResult = await authenticateUser(credResult.email, credResult.password);
  
  if (!authResult.success) {
    console.error('Authentication failed:', authResult.error);
    return {
      success: false,
      error: authResult.error,
      step: 'authenticate'
    };
  }

  console.log('Authentication successful!');
  
  // Store token in localStorage for future use
  console.log("authuser",authResult);

  console.log("token",authResult.token);
  
  if (authResult.data.accessToken) {
    localStorage.setItem('authToken', authResult.data.accessToken);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    console.log(localStorage);
    
  }

  return {
    success: true,
    token: authResult.token,
    user: authResult.user,
    message: 'Authentication successful'
  };
};

/**
 * Check if user is already authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

/**
 * Get stored auth token
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Get stored user info
 */
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  }
  return null;
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};
