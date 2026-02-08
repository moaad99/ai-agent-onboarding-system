/**
 * File Service
 * Handles file system operations in Electron
 */

// Check if we're in Electron environment
let fs, path;
try {
  if (typeof window !== 'undefined' && window.require) {
    fs = window.require('fs');
    path = window.require('path');
  } else if (typeof require !== 'undefined') {
    fs = require('fs');
    path = require('path');
  }
} catch (error) {
  console.error('Failed to load Node.js modules:', error);
}

/**
 * Read a file as text
 */
export const readTextFile = async (filePath) => {
  try {
    if (!fs) {
      throw new Error('File system not available');
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      success: true,
      content,
      path: filePath
    };
  } catch (error) {
    console.error('Error reading file:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Read a file as JSON
 */
export const readJsonFile = async (filePath) => {
  try {
    if (!fs) {
      throw new Error('File system not available');
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    return {
      success: true,
      data,
      path: filePath
    };
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Write text to a file
 */
export const writeTextFile = async (filePath, content) => {
  try {
    if (!fs) {
      throw new Error('File system not available');
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    
    return {
      success: true,
      path: filePath
    };
  } catch (error) {
    console.error('Error writing file:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Write JSON to a file
 */
export const writeJsonFile = async (filePath, data) => {
  try {
    if (!fs) {
      throw new Error('File system not available');
    }

    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, content, 'utf-8');
    
    return {
      success: true,
      path: filePath
    };
  } catch (error) {
    console.error('Error writing JSON file:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Check if file exists
 */
export const fileExists = (filePath) => {
  try {
    if (!fs) {
      return false;
    }
    return fs.existsSync(filePath);
  } catch (error) {
    console.error('Error checking file:', error);
    return false;
  }
};

/**
 * Get file info
 */
export const getFileInfo = async (filePath) => {
  try {
    if (!fs) {
      throw new Error('File system not available');
    }

    const stats = fs.statSync(filePath);
    
    return {
      success: true,
      info: {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory()
      }
    };
  } catch (error) {
    console.error('Error getting file info:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * List files in a directory
 */
export const listFiles = async (dirPath) => {
  try {
    if (!fs) {
      throw new Error('File system not available');
    }

    const files = fs.readdirSync(dirPath);
    
    const fileList = files.map(filename => {
      const filePath = path.join(dirPath, filename);
      const stats = fs.statSync(filePath);
      
      return {
        name: filename,
        path: filePath,
        size: stats.size,
        isDirectory: stats.isDirectory(),
        modified: stats.mtime
      };
    });
    
    return {
      success: true,
      files: fileList
    };
  } catch (error) {
    console.error('Error listing files:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete a file
 */
export const deleteFile = async (filePath) => {
  try {
    if (!fs) {
      throw new Error('File system not available');
    }

    fs.unlinkSync(filePath);
    
    return {
      success: true,
      path: filePath
    };
  } catch (error) {
    console.error('Error deleting file:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
