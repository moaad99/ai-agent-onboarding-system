/**
 * Socket Service
 * Manages Socket.IO connection with authentication
 */

import { io } from 'socket.io-client';
import { getAuthToken } from './authService';

const SOCKET_URL = 'http://localhost:4200'; // Change to your socket server URL

let socket = null;

/**
 * Initialize Socket.IO connection with auth token
 */
export const initializeSocket = (token) => {
  if (socket && socket.connected) {
    console.log('Socket already connected');
    return socket;
  }

  console.log('Initializing Socket.IO connection...');
  console.log('Socket URL:', SOCKET_URL);
  console.log('Auth token:', token ? 'Present' : 'Missing');

  socket = io(SOCKET_URL, {
    auth: {
      token: token
    },
    transports: ['websocket'],
    // reconnection: true,
    // reconnectionAttempts: 5,
    // reconnectionDelay: 1000
  });

  // Connection events
  socket.on('connect', () => {
    console.log('✓ Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('✗ Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

/**
 * Get current socket instance
 */
export const getSocket = () => {
  return socket;
};

/**
 * Send a message through socket
 */
export const sendMessage = (message) => {
  if (!socket || !socket.connected) {
    console.error('Socket not connected');
    return false;
  }

  console.log('Emitting message event:', message);
  socket.emit('message', message);
  return true;
};

/**
 * Listen for incoming messages
 */
export const onMessage = (callback) => {
  if (!socket) {
    console.error('Socket not initialized');
    return;
  }

  socket.on('messageReceived', (data) => {
    console.log('Received message:', data);
    callback(data);
  });
};

/**
 * Listen for bot responses
 */
export const onBotResponse = (callback) => {
  if (!socket) {
    console.error('Socket not initialized');
    return;
  }

  socket.on('bot-response', (data) => {
    console.log('Received bot response:', data);
    callback(data);
  });
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    console.log('Disconnecting socket...');
    socket.disconnect();
    socket = null;
  }
};

/**
 * Reconnect socket with new token
 */
export const reconnectSocket = (token) => {
  disconnectSocket();
  return initializeSocket(token);
};

/**
 * Check if socket is connected
 */
export const isSocketConnected = () => {
  return socket && socket.connected;
};
