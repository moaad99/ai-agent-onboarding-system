import React, { useState } from 'react';
import { readTextFile, writeTextFile, listFiles } from '../services/fileService';
import { openFileDialog, saveFileDialog } from '../services/fileServiceIPC';

/**
 * Example component demonstrating file operations
 */
const FileOperationsExample = () => {
  const [fileContent, setFileContent] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [status, setStatus] = useState('');

  // Method 1: Direct file reading (when you know the path)
  const handleReadDirectFile = async () => {
    const filePath = 'C:\\Users\\msell\\Desktop\\example.txt'; // Example path
    const result = await readTextFile(filePath);
    
    if (result.success) {
      setFileContent(result.content);
      setSelectedFile(result.path);
      setStatus('File read successfully!');
    } else {
      setStatus(`Error: ${result.error}`);
    }
  };

  // Method 2: Open file dialog (user selects file)
  const handleOpenDialog = async () => {
    const result = await openFileDialog();
    
    if (result.success) {
      setFileContent(result.content);
      setSelectedFile(result.filePath);
      setStatus(`Opened: ${result.fileName}`);
    } else if (!result.canceled) {
      setStatus(`Error: ${result.error}`);
    }
  };

  // Save file with dialog
  const handleSaveDialog = async () => {
    const result = await saveFileDialog(fileContent);
    
    if (result.success) {
      setStatus(`Saved to: ${result.filePath}`);
    } else if (!result.canceled) {
      setStatus(`Error: ${result.error}`);
    }
  };

  // Write to specific file
  const handleWriteFile = async () => {
    if (!selectedFile) {
      setStatus('No file selected');
      return;
    }
    
    const result = await writeTextFile(selectedFile, fileContent);
    
    if (result.success) {
      setStatus('File saved successfully!');
    } else {
      setStatus(`Error: ${result.error}`);
    }
  };

  // List files in directory
  const handleListFiles = async () => {
    const dirPath = 'C:\\Users\\msell\\Desktop'; // Example directory
    const result = await listFiles(dirPath);
    
    if (result.success) {
      console.log('Files:', result.files);
      setStatus(`Found ${result.files.length} files`);
    } else {
      setStatus(`Error: ${result.error}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>File Operations Example</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleOpenDialog} style={buttonStyle}>
          Open File (Dialog)
        </button>
        <button onClick={handleReadDirectFile} style={buttonStyle}>
          Read Direct File
        </button>
        <button onClick={handleSaveDialog} style={buttonStyle}>
          Save File (Dialog)
        </button>
        <button onClick={handleWriteFile} style={buttonStyle}>
          Save to Current File
        </button>
        <button onClick={handleListFiles} style={buttonStyle}>
          List Files
        </button>
      </div>

      {selectedFile && (
        <div style={{ marginBottom: '10px', color: '#666' }}>
          <strong>File:</strong> {selectedFile}
        </div>
      )}

      {status && (
        <div style={{ marginBottom: '10px', color: '#667eea' }}>
          {status}
        </div>
      )}

      <textarea
        value={fileContent}
        onChange={(e) => setFileContent(e.target.value)}
        style={{
          width: '100%',
          height: '300px',
          padding: '10px',
          fontFamily: 'monospace',
          fontSize: '14px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
        placeholder="File content will appear here..."
      />
    </div>
  );
};

const buttonStyle = {
  padding: '10px 15px',
  margin: '5px',
  backgroundColor: '#667eea',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

export default FileOperationsExample;
