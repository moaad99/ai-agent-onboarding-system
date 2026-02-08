# File System Operations in Electron

This guide explains how to read and write files in your Electron application.

## Table of Contents
1. [Direct File Access](#direct-file-access)
2. [File Dialogs (IPC)](#file-dialogs-ipc)
3. [Common Use Cases](#common-use-cases)
4. [Security Considerations](#security-considerations)

---

## Direct File Access

Use this method when you know the exact file path.

### Setup

Import the file service:
```javascript
import { readTextFile, writeTextFile, readJsonFile, writeJsonFile, listFiles } from '../services/fileService';
```

### Reading Files

#### Read Text File
```javascript
const result = await readTextFile('C:\\Users\\msell\\Desktop\\file.txt');

if (result.success) {
  console.log('Content:', result.content);
} else {
  console.error('Error:', result.error);
}
```

#### Read JSON File
```javascript
const result = await readJsonFile('C:\\Users\\msell\\Desktop\\data.json');

if (result.success) {
  console.log('Data:', result.data);
} else {
  console.error('Error:', result.error);
}
```

### Writing Files

#### Write Text File
```javascript
const content = 'Hello, World!';
const result = await writeTextFile('C:\\Users\\msell\\Desktop\\output.txt', content);

if (result.success) {
  console.log('File saved to:', result.path);
} else {
  console.error('Error:', result.error);
}
```

#### Write JSON File
```javascript
const data = { name: 'John', age: 30 };
const result = await writeJsonFile('C:\\Users\\msell\\Desktop\\data.json', data);
```

### List Directory Contents
```javascript
const result = await listFiles('C:\\Users\\msell\\Desktop');

if (result.success) {
  result.files.forEach(file => {
    console.log(`${file.name} - ${file.size} bytes`);
  });
}
```

---

## File Dialogs (IPC)

Use this method for user-selected files (more secure and user-friendly).

### Setup

Import the IPC file service:
```javascript
import { openFileDialog, saveFileDialog } from '../services/fileServiceIPC';
```

### Open File Dialog

Prompts user to select a file:
```javascript
const result = await openFileDialog();

if (result.success) {
  console.log('File name:', result.fileName);
  console.log('File path:', result.filePath);
  console.log('Content:', result.content);
} else if (result.canceled) {
  console.log('User canceled');
} else {
  console.error('Error:', result.error);
}
```

### Save File Dialog

Prompts user to save content:
```javascript
const content = 'This is my file content';
const result = await saveFileDialog(content);

if (result.success) {
  console.log('Saved to:', result.filePath);
} else if (result.canceled) {
  console.log('User canceled');
} else {
  console.error('Error:', result.error);
}
```

---

## Common Use Cases

### 1. Chat History Export

Save conversation history to a file:

```javascript
import { saveFileDialog } from '../services/fileServiceIPC';

const exportChatHistory = async (messages) => {
  // Format messages
  const chatText = messages.map(msg => 
    `[${msg.timestamp}] ${msg.type}: ${msg.content}`
  ).join('\n\n');

  // Save with dialog
  const result = await saveFileDialog(chatText);
  
  if (result.success) {
    alert('Chat history exported successfully!');
  }
};

// Usage in component
<button onClick={() => exportChatHistory(messages)}>
  Export Chat
</button>
```

### 2. Import Configuration

Load configuration from a JSON file:

```javascript
import { openFileDialog } from '../services/fileServiceIPC';

const importConfig = async () => {
  const result = await openFileDialog();
  
  if (result.success) {
    try {
      const config = JSON.parse(result.content);
      // Apply configuration
      applyConfiguration(config);
    } catch (error) {
      alert('Invalid configuration file');
    }
  }
};
```

### 3. Attach Files to Messages

```javascript
import { openFileDialog } from '../services/fileServiceIPC';

const handleAttachFile = async () => {
  const result = await openFileDialog();
  
  if (result.success) {
    // Create message with file attachment
    const message = {
      type: 'user',
      content: `Attached file: ${result.fileName}`,
      attachment: {
        name: result.fileName,
        path: result.filePath,
        content: result.content
      }
    };
    
    sendMessage(message);
  }
};
```

### 4. Load Employee Data from CSV

```javascript
import { openFileDialog } from '../services/fileServiceIPC';

const importEmployees = async () => {
  const result = await openFileDialog();
  
  if (result.success) {
    const lines = result.content.split('\n');
    const employees = lines.slice(1).map(line => {
      const [name, email, department] = line.split(',');
      return { name, email, department };
    });
    
    console.log('Imported employees:', employees);
  }
};
```

### 5. Auto-Save Chat Settings

```javascript
import { writeJsonFile } from '../services/fileService';

const saveSettings = async (settings) => {
  const appDataPath = 'C:\\Users\\msell\\AppData\\Local\\OnboardingApp';
  const settingsPath = `${appDataPath}\\settings.json`;
  
  const result = await writeJsonFile(settingsPath, settings);
  
  if (result.success) {
    console.log('Settings saved');
  }
};
```

---

## Integration with MessageInput Component

Add file attachment to your chat:

```javascript
// In MessageInput.js
import { openFileDialog } from '../services/fileServiceIPC';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  
  const handleAttach = async () => {
    const result = await openFileDialog();
    
    if (result.success) {
      // Send as message or attach to next message
      onSendMessage(`📎 Attached: ${result.fileName}\n\n${result.content.substring(0, 200)}...`);
    }
  };

  return (
    <form className="message-input-form">
      <div className="message-input-container">
        <button type="button" className="attach-btn" onClick={handleAttach}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M12.5 10.5L9.5 13.5C8.67157 14.3284 7.32843 14.3284 6.5 13.5C5.67157 12.6716 5.67157 11.3284 6.5 10.5L10.5 6.5C11.0523 5.94772 11.9477 5.94772 12.5 6.5C13.0523 7.05228 13.0523 7.94772 12.5 8.5L8.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <input
          type="text"
          className="message-input"
          placeholder="Type your message here ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="send-btn">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M16 2L8 10M16 2L11 16L8 10M16 2L2 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </form>
  );
};
```

---

## Security Considerations

### ✅ Recommended (Secure)
- Use **File Dialogs** (IPC) for user-selected files
- Validate file paths and content
- Use electron's `dialog` API for file selection
- Sanitize file content before processing

### ❌ Not Recommended (Security Risk)
- Accepting file paths from user input without validation
- Reading system files without permission
- Executing code from file content
- Storing sensitive data in plain text files

### Best Practices

1. **Always validate file paths:**
```javascript
const path = require('path');

const isValidPath = (filePath) => {
  const normalized = path.normalize(filePath);
  return !normalized.includes('..') && path.isAbsolute(normalized);
};
```

2. **Limit file size:**
```javascript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const getFileInfo = async (filePath) => {
  const stats = fs.statSync(filePath);
  if (stats.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }
  return stats;
};
```

3. **Use allowed file types:**
```javascript
const ALLOWED_EXTENSIONS = ['.txt', '.json', '.md', '.csv'];

const isAllowedFile = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
};
```

---

## Testing

Test file operations in development:

```javascript
// Test read
console.log('Testing file read...');
const result = await readTextFile('C:\\test.txt');
console.log(result);

// Test write
console.log('Testing file write...');
const writeResult = await writeTextFile('C:\\output.txt', 'Hello!');
console.log(writeResult);

// Test dialog
console.log('Testing file dialog...');
const dialogResult = await openFileDialog();
console.log(dialogResult);
```

---

## Troubleshooting

### Error: "ENOENT: no such file or directory"
- Check that the file path is correct
- Use absolute paths instead of relative paths
- Verify file exists using `fileExists()`

### Error: "EPERM: operation not permitted"
- Check file permissions
- Close file if it's open in another program
- Run application with appropriate permissions

### Error: "Electron IPC not available"
- Make sure `nodeIntegration: true` in electron.js
- Check that electron is running
- Verify you're not in web browser mode

---

## Additional Resources

- [Node.js fs Documentation](https://nodejs.org/api/fs.html)
- [Electron IPC Documentation](https://www.electronjs.org/docs/latest/api/ipc-main)
- [Electron Dialog API](https://www.electronjs.org/docs/latest/api/dialog)
