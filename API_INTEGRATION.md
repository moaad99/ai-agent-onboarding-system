# API Integration Guide

This document explains how to integrate Eurecia API and Azure DevOps API into the onboarding chatbot.

## Overview

The chatbot is designed to help new employees with:
- **Eurecia HR System**: Leave balance, salary, personal info
- **Azure DevOps**: Project access, repositories, work items
- **General Support**: Company policies and onboarding

## Eurecia API Integration

### Authentication
```javascript
// src/services/eureciaService.js
const EURECIA_API_URL = 'https://api.eurecia.com/v1';
const EURECIA_API_KEY = process.env.REACT_APP_EURECIA_API_KEY;

export const authenticateEurecia = async (username, password) => {
  const response = await fetch(`${EURECIA_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${EURECIA_API_KEY}`
    },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};
```

### Get Leave Balance
```javascript
export const getLeaveBalance = async (employeeId, token) => {
  const response = await fetch(`${EURECIA_API_URL}/employees/${employeeId}/leaves`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

### Get Employee Profile
```javascript
export const getEmployeeProfile = async (employeeId, token) => {
  const response = await fetch(`${EURECIA_API_URL}/employees/${employeeId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

### Get Salary Information
```javascript
export const getSalaryInfo = async (employeeId, token) => {
  const response = await fetch(`${EURECIA_API_URL}/employees/${employeeId}/payslips`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

## Azure DevOps API Integration

### Authentication
```javascript
// src/services/azureDevOpsService.js
const AZURE_DEVOPS_ORG = 'your-organization';
const AZURE_DEVOPS_PAT = process.env.REACT_APP_AZURE_PAT;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Basic ${btoa(`:${AZURE_DEVOPS_PAT}`)}`
});
```

### Get User Projects
```javascript
export const getUserProjects = async (userId) => {
  const response = await fetch(
    `https://dev.azure.com/${AZURE_DEVOPS_ORG}/_apis/projects?api-version=7.0`,
    { headers: getHeaders() }
  );
  return response.json();
};
```

### Get Repositories
```javascript
export const getRepositories = async (projectId) => {
  const response = await fetch(
    `https://dev.azure.com/${AZURE_DEVOPS_ORG}/${projectId}/_apis/git/repositories?api-version=7.0`,
    { headers: getHeaders() }
  );
  return response.json();
};
```

### Get Work Items
```javascript
export const getWorkItems = async (projectId) => {
  const response = await fetch(
    `https://dev.azure.com/${AZURE_DEVOPS_ORG}/${projectId}/_apis/wit/workitems?api-version=7.0`,
    { headers: getHeaders() }
  );
  return response.json();
};
```

## AI/NLP Integration

### OpenAI Integration (for natural language understanding)
```javascript
// src/services/aiService.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

export const processUserQuery = async (message, context) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an employee onboarding assistant with access to Eurecia HR system and Azure DevOps. 
        Help employees with: leave requests, salary queries, profile information, Azure DevOps access, and general onboarding questions.
        Be professional, friendly, and concise.`
      },
      {
        role: "user",
        content: message
      }
    ],
    functions: [
      {
        name: "get_leave_balance",
        description: "Get employee leave balance from Eurecia",
        parameters: {
          type: "object",
          properties: {
            employee_id: { type: "string" }
          }
        }
      },
      {
        name: "get_azure_projects",
        description: "Get Azure DevOps projects for user",
        parameters: {
          type: "object",
          properties: {
            user_id: { type: "string" }
          }
        }
      }
    ]
  });
  
  return response;
};
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Eurecia API
REACT_APP_EURECIA_API_KEY=your_eurecia_api_key
REACT_APP_EURECIA_API_URL=https://api.eurecia.com/v1

# Azure DevOps
REACT_APP_AZURE_DEVOPS_ORG=your-organization
REACT_APP_AZURE_PAT=your_personal_access_token

# OpenAI (optional, for AI responses)
REACT_APP_OPENAI_API_KEY=your_openai_api_key
```

## Example Integration in ChatWindow

```javascript
import { getLeaveBalance, getEmployeeProfile } from '../services/eureciaService';
import { getUserProjects } from '../services/azureDevOpsService';
import { processUserQuery } from '../services/aiService';

const handleSendMessage = async (message) => {
  // Add user message
  const newMessage = {
    id: messages.length + 1,
    type: 'user',
    content: message,
    timestamp: new Date()
  };
  setMessages([...messages, newMessage]);

  try {
    // Process with AI
    const aiResponse = await processUserQuery(message, {
      employeeId: currentUser.id,
      context: 'onboarding'
    });

    // Check if function call is needed
    if (aiResponse.function_call) {
      const functionName = aiResponse.function_call.name;
      const args = JSON.parse(aiResponse.function_call.arguments);

      let data;
      if (functionName === 'get_leave_balance') {
        data = await getLeaveBalance(args.employee_id, userToken);
      } else if (functionName === 'get_azure_projects') {
        data = await getUserProjects(args.user_id);
      }

      // Format response with data
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: formatResponse(data, functionName),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } else {
      // Direct AI response
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: aiResponse.content,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }
  } catch (error) {
    console.error('Error processing message:', error);
    // Error handling
  }
};
```

## Security Best Practices

1. **Never store API keys in code** - Use environment variables
2. **Implement proper authentication** - Validate user tokens
3. **Rate limiting** - Prevent API abuse
4. **Data encryption** - Encrypt sensitive data
5. **Audit logging** - Log all API calls for security
6. **Input validation** - Sanitize user inputs
7. **CORS configuration** - Properly configure CORS for APIs

## Testing

Create mock services for testing:

```javascript
// src/services/__mocks__/eureciaService.js
export const getLeaveBalance = jest.fn(() => Promise.resolve({
  annual_leave: 15,
  sick_leave: 5,
  personal_days: 3
}));
```

## Next Steps

1. Create service files in `src/services/`
2. Set up environment variables
3. Implement authentication flow
4. Add error handling and loading states
5. Test API integrations
6. Deploy with proper security measures
