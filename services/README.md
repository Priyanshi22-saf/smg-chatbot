# Chat Service Architecture

This directory contains the chat service implementations following the Strategy pattern, allowing easy swapping between different AI providers without changing the API contract.

## Architecture Overview

```
ChatService (Abstract Base Class)
├── RuleBasedChatService (Default - Pattern Matching)
├── OpenAIChatService (OpenAI GPT)
└── GeminiChatService (Google Gemini)
```

## Service Contract

All chat services implement the `ChatService` interface:

```javascript
class ChatService {
    async getReply(message, context)  // Process message and return response
    getName()                          // Return service identifier
    async isReady()                    // Check if service is configured
}
```

## Switching Services

### Method 1: Environment Variable (Recommended)

Set `CHAT_SERVICE_TYPE` in your `.env` file or environment:

```bash
# Use rule-based service (default)
CHAT_SERVICE_TYPE=rule-based

# Use OpenAI
CHAT_SERVICE_TYPE=openai
OPENAI_API_KEY=sk-...

# Use Gemini
CHAT_SERVICE_TYPE=gemini
GEMINI_API_KEY=...
```

### Method 2: Code Change

In `server.js`, modify the factory call:

```javascript
const chatService = ChatServiceFactory.create('openai');
```

## API Contract

The API contract remains **unchanged** regardless of which service is used:

**Request:**
```json
POST /api/chat
{
  "message": "Hello",
  "conversationId": "optional-conv-id"
}
```

**Response:**
```json
{
  "reply": "Hello! 👋 How can I assist you today?",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "conversationId": "conv_123",
  "serviceType": "rule-based"
}
```

## Adding a New Service

1. Create a new file extending `ChatService`:

```javascript
const ChatService = require('./ChatService');

class MyNewChatService extends ChatService {
    getName() {
        return 'my-new-service';
    }

    async getReply(message, context) {
        // Your implementation
        return "Response";
    }
}

module.exports = MyNewChatService;
```

2. Add it to `ChatServiceFactory.js`:

```javascript
case 'my-new-service':
    return new MyNewChatService();
```

3. Update the factory's `getAvailableTypes()` method.

## Context Object

The `context` parameter passed to `getReply()` contains:

```javascript
{
    conversationId: "conv_123",
    history: [
        { role: 'user', content: 'Hello', timestamp: '...' },
        { role: 'assistant', content: 'Hi!', timestamp: '...' }
    ],
    userAgent: "Mozilla/5.0...",
    timestamp: "2024-01-01T12:00:00.000Z"
}
```

Services can use this context to maintain conversation state and provide more contextual responses.

