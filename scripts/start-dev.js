const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

let reactProcess;
let electronProcess;

// Function to check if React dev server is running
function checkReactServer(callback, retries = 0) {
  const maxRetries = 60; // 60 seconds
  
  http.get('http://localhost:3000', (res) => {
    console.log('\n✓ React dev server is ready!\n');
    callback();
  }).on('error', (err) => {
    if (retries < maxRetries) {
      if (retries % 5 === 0) {
        console.log(`Waiting for React dev server... (${retries}s)`);
      }
      setTimeout(() => checkReactServer(callback, retries + 1), 1000);
    } else {
      console.error('✗ React dev server failed to start.');
      process.exit(1);
    }
  });
}

console.log('Starting React dev server...\n');
reactProcess = spawn('npm', ['start'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true
});

// Wait for React server to be ready, then start Electron
setTimeout(() => {
  checkReactServer(() => {
    console.log('Starting Electron...\n');
    const electron = require('electron');
    
    electronProcess = spawn(electron, [path.join(__dirname, '..')], {
      env: { ...process.env, ELECTRON_IS_DEV: '1', NODE_ENV: 'development' },
      stdio: 'inherit'
    });

    electronProcess.on('close', () => {
      console.log('Electron closed. Shutting down...');
      reactProcess.kill();
      process.exit();
    });
  });
}, 3000); // Wait 3 seconds before first check

// Handle termination
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  if (reactProcess) reactProcess.kill();
  if (electronProcess) electronProcess.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  if (reactProcess) reactProcess.kill();
  if (electronProcess) electronProcess.kill();
  process.exit();
});
