# Chatbot Service Architecture

## Overview

The chatbot backend uses a **Strategy Pattern** with a **Factory Pattern** to enable seamless switching between different AI providers without changing the API contract.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                    (index.html, script.js)                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP POST /api/chat
                        │ { message: "...", conversationId: "..." }
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Server                            │
│                      (server.js)                             │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         ChatServiceFactory                          │    │
│  │  - Creates service instance                         │    │
│  │  - Reads CHAT_SERVICE_TYPE env var                  │    │
│  └───────────────┬──────────────────────────────────────┘    │
│                  │                                            │
│                  │ Returns ChatService instance               │
│                  │                                            │
└──────────────────┼────────────────────────────────────────────┘
                   │
                   │ Implements
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌───────────────┐    ┌──────────────────┐
│ ChatService   │    │  (Abstract)      │
│ (Interface)   │    │                  │
│               │    │  getReply()      │
│  getName()    │    │  isReady()       │
│  getReply()   │    └──────────────────┘
│  isReady()    │
└───────┬───────┘
        │
        │ Extended by
        │
   ┌────┴────────────────────────────────────┐
   │                                          │
   ▼                    ▼                     ▼
┌─────────────┐  ┌──────────────┐  ┌──────────────┐
│ RuleBased   │  │   OpenAI     │  │   Gemini     │
│ ChatService │  │  ChatService  │  │ ChatService  │
│             │  │              │  │              │
│ Pattern     │  │ GPT API      │  │ Gemini API   │
│ Matching    │  │ Calls        │  │ Calls        │
└─────────────┘  └──────────────┘  └──────────────┘
```

## Key Design Principles

### 1. **Unchanged API Contract**
The `/api/chat` endpoint maintains the same request/response structure regardless of which service is used:

```javascript
// Request (always the same)
POST /api/chat
{
  "message": "Hello",
  "conversationId": "optional"
}

// Response (always the same structure)
{
  "reply": "...",
  "timestamp": "...",
  "conversationId": "...",
  "serviceType": "rule-based|openai|gemini"
}
```

### 2. **Service Abstraction**
All services implement the `ChatService` interface:

```javascript
class ChatService {
    async getReply(message, context)  // Must return Promise<string>
    getName()                          // Must return string
    async isReady()                    // Must return Promise<boolean>
}
```

### 3. **Factory Pattern**
The `ChatServiceFactory` handles service creation:

```javascript
// Automatically selects service based on CHAT_SERVICE_TYPE
const service = ChatServiceFactory.create();

// Or explicitly specify
const service = ChatServiceFactory.create('openai');
```

### 4. **Context Passing**
All services receive a consistent context object:

```javascript
{
    conversationId: "conv_123",
    history: [...],           // Last 10 messages
    userAgent: "...",
    timestamp: "..."
}
```

## Switching Services

### Current Implementation
```javascript
// server.js
const chatService = ChatServiceFactory.create();
```

### To Switch to OpenAI
1. Set environment variable: `CHAT_SERVICE_TYPE=openai`
2. Set API key: `OPENAI_API_KEY=sk-...`
3. Restart server

**No code changes required!**

### To Switch to Gemini
1. Set environment variable: `CHAT_SERVICE_TYPE=gemini`
2. Set API key: `GEMINI_API_KEY=...`
3. Restart server

**No code changes required!**

## Adding a New Service

1. **Create Service Class** (`services/MyNewService.js`):
```javascript
const ChatService = require('./ChatService');

class MyNewChatService extends ChatService {
    getName() { return 'my-new-service'; }
    
    async getReply(message, context) {
        // Your implementation
        return "Response";
    }
}

module.exports = MyNewChatService;
```

2. **Register in Factory** (`services/ChatServiceFactory.js`):
```javascript
const MyNewChatService = require('./MyNewChatService');

// In create() method:
case 'my-new-service':
    return new MyNewChatService();
```

3. **Update Available Types**:
```javascript
static getAvailableTypes() {
    return ['rule-based', 'openai', 'gemini', 'my-new-service'];
}
```

That's it! The API contract remains unchanged.

## Benefits

✅ **Zero Frontend Changes** - API contract never changes  
✅ **Easy Testing** - Switch between services for testing  
✅ **Cost Flexibility** - Use rule-based for development, LLM for production  
✅ **Vendor Independence** - Switch providers without code changes  
✅ **Extensible** - Add new services easily  
✅ **Type Safety** - All services implement same interface  

## Future Enhancements

Potential additions that maintain the API contract:

- **Database Integration** - Store conversations persistently
- **Rate Limiting** - Per-service rate limits
- **Caching** - Cache responses for common queries
- **Analytics** - Track service performance
- **Fallback Logic** - Automatic fallback if primary service fails
- **Multi-Service** - Route different queries to different services

All of these can be added **without changing the API contract**.

