const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
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
      experimentalFeatures: false,
      devTools: isDev,
      partition: 'persist:main' // Isolate from browser extensions
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
    // Open DevTools automatically
    mainWindow.webContents.openDevTools();
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

  // File dialog handlers
  ipcMain.handle('dialog:openFile', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'All Files', extensions: ['*'] },
        { name: 'Text Files', extensions: ['txt', 'md', 'json'] },
        { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
      ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return {
          success: true,
          filePath,
          content,
          fileName: path.basename(filePath)
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
    return { success: false, canceled: true };
  });

  ipcMain.handle('dialog:saveFile', async (event, content) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (!result.canceled && result.filePath) {
      try {
        fs.writeFileSync(result.filePath, content, 'utf-8');
        return {
          success: true,
          filePath: result.filePath
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
    return { success: false, canceled: true };
  });

  // Read file handler
  ipcMain.handle('file:read', async (event, filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return {
        success: true,
        content,
        filePath
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  });

  // Write file handler
  ipcMain.handle('file:write', async (event, filePath, content) => {
    try {
      fs.writeFileSync(filePath, content, 'utf-8');
      return {
        success: true,
        filePath
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  });

  // Read credentials file handler
  ipcMain.handle('file:readCredentials', async (event, filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return {
        success: true,
        content,
        filePath
      };
    } catch (error) {
      console.error('Error reading credentials:', error);
      return {
        success: false,
        error: error.message
      };
    }
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
