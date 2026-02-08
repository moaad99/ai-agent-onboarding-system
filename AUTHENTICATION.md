# Authentication System

This document explains how the automatic authentication system works on app startup.

## Overview

When the app launches for the first time, it automatically:
1. Reads credentials from `C:\Users\msell\Desktop\credentials.txt`
2. Sends a POST request to `https://localhost:3000` with email and password
3. Stores the authentication token for future use
4. Displays the chat interface once authenticated

## Setup

### 1. Create Credentials File

Create a file at: `C:\Users\msell\Desktop\credentials.txt`

**Format:**
```
email=your.email@company.com
password=yourpassword123
```

**Important:**
- Each line should be `key=value`
- No spaces around the `=` sign (or they'll be included in the value)
- No quotes around values

### 2. API Endpoint

Your authentication API should be running at:
```
https://localhost:3000
```

**Expected Request:**
```json
POST https://localhost:3000
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response (Success):**
```json
{
  "token": "your-jwt-token-here",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "user@example.com",
    "department": "Engineering"
  }
}
```

**Expected Response (Error):**
```json
{
  "message": "Invalid credentials"
}
```

## How It Works

### 1. App Startup Flow

```
App.js (useEffect)
    ↓
Check if already authenticated (localStorage)
    ↓
    ├─ Yes → Load chat
    └─ No → Initialize authentication
            ↓
        Read credentials.txt
            ↓
        Send POST to https://localhost:3000
            ↓
            ├─ Success → Store token → Load chat
            └─ Error → Show error screen
```

### 2. Authentication Service

**Location:** `src/services/authService.js`

**Key Functions:**

```javascript
// Initialize authentication on startup
initializeAuth()

// Check if user is authenticated
isAuthenticated()

// Get stored auth token
getAuthToken()

// Get stored user info
getUser()

// Logout user
logout()
```

### 3. Using Authentication Token

Once authenticated, the token is stored in `localStorage` and can be used for API requests:

```javascript
import { getAuthToken } from './services/authService';

// Use in API calls
const token = getAuthToken();

fetch('https://your-api.com/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## UI States

### Loading Screen
- Shows spinner and "Authenticating..." message
- Displayed while reading credentials and contacting API

### Error Screen
- Shows if credentials file is missing or invalid
- Shows if authentication fails
- Includes "Retry" button to reload the app

### Authenticated Screen
- Shows main chat interface
- Welcome message includes user's name from API response

## Configuration

### Change Credentials Path

Edit `src/services/authService.js`:

```javascript
const CREDENTIALS_PATH = 'C:\\Users\\msell\\Desktop\\credentials.txt';
// Change to your desired path
```

### Change API URL

Edit `src/services/authService.js`:

```javascript
const AUTH_URL = 'https://localhost:3000';
// Change to your API endpoint
```

## Testing

### Test with Mock Credentials

1. Create `C:\Users\msell\Desktop\credentials.txt`:
```
email=test@example.com
password=test123
```

2. Make sure your API is running at `https://localhost:3000`

3. Launch the app:
```bash
npm run dev
```

### Test Authentication Flow

Monitor the console for logs:
```
Initializing authentication...
Credentials loaded, authenticating...
Authentication successful!
```

### Test Error Scenarios

**Missing credentials file:**
- Delete or rename credentials.txt
- App should show: "Failed to read credentials file"

**Invalid credentials format:**
- Create credentials.txt without email or password
- App should show: "Invalid credentials format"

**Wrong password:**
- API returns 401
- App should show: "Authentication failed: 401"

**API not running:**
- Stop your API server
- App should show connection error

## Security Notes

### ⚠️ Important Security Considerations

1. **Credentials File:**
   - This file contains plain text passwords
   - Should NEVER be committed to git
   - Add to `.gitignore`
   - Only for development/testing

2. **Production:**
   - Do NOT use credentials file in production
   - Implement proper login UI
   - Use OAuth or SSO
   - Store tokens securely

3. **HTTPS:**
   - Your localhost API uses HTTPS
   - You may need to disable SSL verification for development
   - Never disable SSL in production

### Disable SSL Verification (Development Only)

If you get SSL certificate errors with localhost, add this to `authService.js`:

```javascript
// DEVELOPMENT ONLY - DO NOT USE IN PRODUCTION
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
```

Or in `electron.js`:
```javascript
if (isDev) {
  app.commandLine.appendSwitch('ignore-certificate-errors');
}
```

## Gitignore Setup

Add to `.gitignore`:
```
# Credentials
credentials.txt
C:\Users\msell\Desktop\credentials.txt

# Environment
.env
.env.local
```

## Extending Authentication

### Add Remember Me

```javascript
// In authService.js
export const initializeAuth = async (rememberMe = true) => {
  // ... existing code ...
  
  if (authResult.success && rememberMe) {
    localStorage.setItem('authToken', authResult.token);
  } else {
    sessionStorage.setItem('authToken', authResult.token);
  }
};
```

### Add Token Refresh

```javascript
export const refreshToken = async () => {
  const token = getAuthToken();
  
  const response = await fetch('https://localhost:3000/refresh', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  localStorage.setItem('authToken', data.token);
  
  return data.token;
};
```

### Add Automatic Logout

```javascript
// In App.js
useEffect(() => {
  // Logout after 8 hours
  const timeout = setTimeout(() => {
    logout();
    window.location.reload();
  }, 8 * 60 * 60 * 1000);
  
  return () => clearTimeout(timeout);
}, []);
```

## Integration with APIs

### Use Token in Eurecia API

```javascript
// In eureciaService.js
import { getAuthToken } from './authService';

export const getLeaveBalance = async (employeeId) => {
  const token = getAuthToken();
  
  const response = await fetch(`${EURECIA_API_URL}/employees/${employeeId}/leaves`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.json();
};
```

### Use Token in Azure DevOps

```javascript
// In azureDevOpsService.js
import { getAuthToken } from './authService';

export const getUserProjects = async () => {
  const token = getAuthToken();
  
  const response = await fetch(
    `https://dev.azure.com/${AZURE_DEVOPS_ORG}/_apis/projects`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.json();
};
```

## Troubleshooting

### Error: "Failed to read credentials file"
- Check that file exists at `C:\Users\msell\Desktop\credentials.txt`
- Verify you have read permissions
- Check path in `authService.js`

### Error: "Invalid credentials format"
- Verify file format: `email=...` and `password=...`
- Check for typos in keys
- Ensure no extra spaces

### Error: "fetch failed" or "ECONNREFUSED"
- Verify API is running at `https://localhost:3000`
- Check firewall settings
- Try changing to `http://localhost:3000` if not using SSL

### Error: "SSL certificate problem"
- Add `ignore-certificate-errors` to electron.js
- Or use `http://` instead of `https://` for development

### Token Not Working
- Check token format in API response
- Verify token is stored: `console.log(localStorage.getItem('authToken'))`
- Check token expiration

## Next Steps

1. ✅ Set up credentials.txt file
2. ✅ Start your API server
3. ✅ Test authentication flow
4. ⏳ Implement token refresh
5. ⏳ Add proper login UI for production
6. ⏳ Implement secure token storage
7. ⏳ Add session management
