/**
 * Electron IPC File Service
 * Uses IPC communication with main process for secure file operations
 */

const { ipcRenderer } = window.require ? window.require('electron') : {};

/**
 * Open file dialog and read selected file
 */
export const openFileDialog = async () => {
  try {
    if (!ipcRenderer) {
      throw new Error('Electron IPC not available');
    }

    const result = await ipcRenderer.invoke('dialog:openFile');
    return result;
  } catch (error) {
    console.error('Error opening file dialog:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Save file dialog
 */
export const saveFileDialog = async (content) => {
  try {
    if (!ipcRenderer) {
      throw new Error('Electron IPC not available');
    }

    const result = await ipcRenderer.invoke('dialog:saveFile', content);
    return result;
  } catch (error) {
    console.error('Error saving file:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Read file using IPC
 */
export const readFileIPC = async (filePath) => {
  try {
    if (!ipcRenderer) {
      throw new Error('Electron IPC not available');
    }

    const result = await ipcRenderer.invoke('file:read', filePath);
    return result;
  } catch (error) {
    console.error('Error reading file via IPC:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Write file using IPC
 */
export const writeFileIPC = async (filePath, content) => {
  try {
    if (!ipcRenderer) {
      throw new Error('Electron IPC not available');
    }

    const result = await ipcRenderer.invoke('file:write', filePath, content);
    return result;
  } catch (error) {
    console.error('Error writing file via IPC:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
