const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path');
const http = require('http');

process.env.ELECTRON_IS_DEV = '1';
process.env.NODE_ENV = 'development';

// Function to check if React dev server is running
function checkReactServer(callback, retries = 0) {
  const maxRetries = 30; // 30 seconds
  
  http.get('http://localhost:3000', (res) => {
    console.log('✓ React dev server is running');
    callback();
  }).on('error', (err) => {
    if (retries < maxRetries) {
      console.log(`Waiting for React dev server... (${retries + 1}/${maxRetries})`);
      setTimeout(() => checkReactServer(callback, retries + 1), 1000);
    } else {
      console.error('✗ React dev server not found. Please run "npm start" first.');
      process.exit(1);
    }
  });
}

console.log('Starting Electron...');
console.log('Make sure React dev server is running (npm start)');

checkReactServer(() => {
  const electronPath = electron;
  const appPath = path.join(__dirname, '..');

  const child = spawn(electronPath, [appPath], {
    env: { ...process.env, ELECTRON_IS_DEV: '1', NODE_ENV: 'development' },
    stdio: 'inherit'
  });

  child.on('close', () => {
    process.exit();
  });
});
