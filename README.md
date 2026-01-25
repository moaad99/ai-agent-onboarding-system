# Employee Onboarding Assistant - Desktop Application

A professional desktop chat application built with Electron and React for employee onboarding, integrating with Eurecia HR System and Azure DevOps.

## Features

- 🖥️ Cross-platform desktop application (Windows, macOS, Linux)
- 💬 Modern, professional chat interface
- 🏢 **Eurecia Integration**: Leave balance, salary info, personal profile
- 💻 **Azure DevOps Integration**: Project access, repositories, work items
- 🤖 AI-powered responses for natural conversation
- 📋 Quick action buttons for common queries
- 🎨 Modern gradient UI with smooth animations

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

### Option 1: Run everything together (Recommended)
```bash
npm run dev
```

This will start both the React dev server and Electron automatically.

### Option 2: Run separately
First, start the React development server in one terminal:
```bash
npm start
```

Then, in a separate terminal, run Electron:
```bash
npm run electron-dev
```

### Troubleshooting

**WebGL Context Error:**
If you see a WebGL error, this has been fixed by disabling hardware acceleration in the Electron configuration.

**Port Already in Use:**
Make sure port 3000 is not being used by another application.

**React Server Not Found:**
Make sure `npm start` is running before starting Electron with `npm run electron-dev`.

## API Integration

See [API_INTEGRATION.md](./API_INTEGRATION.md) for detailed instructions on integrating:
- Eurecia API (HR system)
- Azure DevOps API
- OpenAI for natural language processing

## Features Overview

### Quick Actions
- 🏖️ **Check Leave Balance** - View current leave status
- 💰 **Salary Information** - Access payroll details
- 👤 **My Profile** - View and update profile
- 💻 **Azure DevOps Access** - Get project information

### Chat Capabilities
- Natural language queries
- Real-time API responses
- Context-aware conversations
- Professional, friendly tone

## Building

To build the application for production:

```bash
npm run build
npm run electron-pack
```

## Project Structure

```
├── public/
│   ├── electron.js      # Electron main process
│   └── index.html       # HTML template
├── scripts/
│   ├── electron-dev.js  # Script to run Electron in dev mode
│   └── start-dev.js     # Combined start script
├── src/
│   ├── components/      # React components
│   │   ├── ChatWindow.js       # Main chat container
│   │   ├── ChatHeader.js       # Header with branding
│   │   ├── MessageList.js      # Message container
│   │   ├── Message.js          # Individual messages
│   │   ├── MessageInput.js     # Input field
│   │   └── WindowControls.js   # Window controls
│   ├── services/        # API services (to be implemented)
│   │   ├── eureciaService.js
│   │   ├── azureDevOpsService.js
│   │   └── aiService.js
│   ├── App.js           # Main React component
│   ├── App.css
│   ├── index.js         # React entry point
│   └── index.css
├── API_INTEGRATION.md   # API integration guide
├── package.json
└── README.md
```

## Technologies Used

- **Electron** - Desktop application framework
- **React** - UI library
- **React Scripts** - Build tooling
- **Eurecia API** - HR management system (to be integrated)
- **Azure DevOps API** - DevOps platform (to be integrated)
- **OpenAI** - Natural language processing (optional)

## Security

- All API keys stored in environment variables
- No sensitive data in code
- Token-based authentication
- Encrypted data transmission

## Next Steps

1. ✅ Set up project structure
2. ✅ Create chat UI
3. ⏳ Implement Eurecia API integration
4. ⏳ Implement Azure DevOps API integration
5. ⏳ Add AI/NLP for natural conversations
6. ⏳ Add authentication system
7. ⏳ Add user session management
8. ⏳ Deploy to production

## License

MIT
