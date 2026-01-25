const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.ELECTRON_IS_DEV === '1' || process.env.NODE_ENV === 'development';

// Disable hardware acceleration to fix WebGL errors
app.disableHardwareAcceleration();

// Ignore certificate errors in development
if (isDev) {
  app.commandLine.appendSwitch('ignore-certificate-errors');
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 720,
    minWidth: 380,
    minHeight: 600,
    maxWidth: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webgl: false,
      experimentalFeatures: false
    },
    frame: false,
    backgroundColor: '#667eea',
    show: false,
    resizable: true,
    titleBarStyle: 'hidden'
  });

  // Load the app
  if (isDev) {
    // Wait for React dev server to be ready
    mainWindow.loadURL('http://localhost:3000').catch(err => {
      console.error('Failed to load URL:', err);
      setTimeout(() => {
        mainWindow.loadURL('http://localhost:3000');
      }, 2000);
    });
    // Comment out dev tools for now to reduce errors
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle load errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  // Handle window controls via IPC
  ipcMain.on('window-minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('window-close', () => {
    mainWindow.close();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
