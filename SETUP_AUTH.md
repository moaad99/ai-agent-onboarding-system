# Quick Setup: Automatic Authentication

## What You Need

1. **Credentials File**: `C:\Users\msell\Desktop\credentials.txt`
2. **API Server**: Running at `https://localhost:3000`

## Step 1: Create Credentials File

Create a file at `C:\Users\msell\Desktop\credentials.txt` with this content:

```
email=your.email@company.com
password=yourpassword
```

## Step 2: API Endpoint

Your API at `https://localhost:3000` should accept:

**Request:**
```
POST https://localhost:3000
Content-Type: application/json

{
  "email": "your.email@company.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "your.email@company.com"
  }
}
```

## Step 3: Run the App

```bash
npm run dev
```

## What Happens

1. App reads `credentials.txt`
2. Sends POST request to `https://localhost:3000`
3. Stores authentication token
4. Shows chat interface with personalized welcome

## Files Changed/Created

✅ `src/services/authService.js` - Authentication logic
✅ `src/App.js` - Added auth check on startup
✅ `src/App.css` - Loading and error screens
✅ `src/components/ChatWindow.js` - Shows user name
✅ `credentials.example.txt` - Example format
✅ `.gitignore` - Excludes credentials.txt
✅ `AUTHENTICATION.md` - Full documentation

## Testing

**Console logs to look for:**
```
Initializing authentication...
Credentials loaded, authenticating...
Authentication successful!
```

**If it fails:**
- Check credentials.txt exists and has correct format
- Verify API is running at https://localhost:3000
- Check console for specific error message
- Click "Retry" button to try again

## Security Note

⚠️ **The credentials.txt file contains plain text passwords!**
- Only for development/testing
- Never commit to git (already in .gitignore)
- For production, implement proper login UI

---

**Full documentation:** See `AUTHENTICATION.md`
