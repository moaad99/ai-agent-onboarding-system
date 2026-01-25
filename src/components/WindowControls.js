import React from 'react';
import './WindowControls.css';

const WindowControls = () => {
  const handleMinimize = () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('window-minimize');
    }
  };

  const handleSettings = () => {
    // Settings functionality can be added here
    console.log('Settings clicked');
  };

  const handleClose = () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('window-close');
    }
  };

  return (
    <div className="window-controls">
      <button className="control-btn minimize-btn" onClick={handleMinimize} title="Minimize">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      <button className="control-btn settings-btn" onClick={handleSettings} title="Settings">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 9C8.10457 9 9 8.10457 9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
          <path d="M11.5 7C11.5 7.27614 11.2761 7.5 11 7.5C10.7239 7.5 10.5 7.27614 10.5 7C10.5 6.72386 10.7239 6.5 11 6.5C11.2761 6.5 11.5 6.72386 11.5 7Z" fill="currentColor"/>
          <path d="M3.5 7C3.5 7.27614 3.27614 7.5 3 7.5C2.72386 7.5 2.5 7.27614 2.5 7C2.5 6.72386 2.72386 6.5 3 6.5C3.27614 6.5 3.5 6.72386 3.5 7Z" fill="currentColor"/>
          <path d="M7 3.5C7.27614 3.5 7.5 3.27614 7.5 3C7.5 2.72386 7.27614 2.5 7 2.5C6.72386 2.5 6.5 2.72386 6.5 3C6.5 3.27614 6.72386 3.5 7 3.5Z" fill="currentColor"/>
          <path d="M7 11.5C7.27614 11.5 7.5 11.2761 7.5 11C7.5 10.7239 7.27614 10.5 7 10.5C6.72386 10.5 6.5 10.7239 6.5 11C6.5 11.2761 6.72386 11.5 7 11.5Z" fill="currentColor"/>
          <path d="M10.5 9.5C10.7761 9.5 11 9.27614 11 9C11 8.72386 10.7761 8.5 10.5 8.5C10.2239 8.5 10 8.72386 10 9C10 9.27614 10.2239 9.5 10.5 9.5Z" fill="currentColor"/>
          <path d="M3.5 5.5C3.77614 5.5 4 5.27614 4 5C4 4.72386 3.77614 4.5 3.5 4.5C3.22386 4.5 3 4.72386 3 5C3 5.27614 3.22386 5.5 3.5 5.5Z" fill="currentColor"/>
          <path d="M10.5 4.5C10.7761 4.5 11 4.27614 11 4C11 3.72386 10.7761 3.5 10.5 3.5C10.2239 3.5 10 3.72386 10 4C10 4.27614 10.2239 4.5 10.5 4.5Z" fill="currentColor"/>
          <path d="M3.5 9.5C3.77614 9.5 4 9.27614 4 9C4 8.72386 3.77614 8.5 3.5 8.5C3.22386 8.5 3 8.72386 3 9C3 9.27614 3.22386 9.5 3.5 9.5Z" fill="currentColor"/>
        </svg>
      </button>
      <button className="control-btn close-btn" onClick={handleClose} title="Close">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
};

export default WindowControls;
