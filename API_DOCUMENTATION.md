# SMG Chatbot API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Admin endpoints require JWT authentication. Include token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Public Endpoints

### 1. Chat API

#### POST `/api/chat`
Process user message and get bot response.

**Request Body:**
```json
{
  "userMessage": "Hello, tell me about your products",
  "userId": "optional-user-id",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "botReply": "🛵 **Our Products**\n\nSMG Electric Scooters offers...",
    "intentName": "products",
    "confidenceScore": 0.9,
    "conversationId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "sessionId": "session_1234567890"
  }
}
```

#### GET `/api/chat/history/:sessionId`
Get conversation history for a session.

**Query Parameters:**
- `limit` (optional): Number of messages to return (default: 50)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "message": "Hello",
      "intent": "greeting",
      "response": "Hello! 👋 Welcome...",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

---

### 2. Lead Management

#### POST `/api/leads`
Create a new lead.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "interest": "product",
  "city": "Mumbai",
  "message": "Interested in electric scooter"
}
```

**Interest Types:** `product`, `internship`, `scholarship`, `dealership`, `other`

**Response:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "interest": "product",
    "city": "Mumbai",
    "status": "new",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

### 3. Programs Information

#### GET `/api/programs`
Get all SMG programs (Internships, Scholarships, Industrial Visits).

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": {
    "smgNirmaan": {
      "name": "SMG Nirmaan Programme",
      "type": "internship",
      "duration": "3-6 months",
      "eligibility": [...],
      "benefits": [...]
    },
    "smgScholarships": {...},
    "smgBhraman": {...}
  }
}
```

#### GET `/api/programs/:type`
Get specific program by type.

**Types:** `internship`, `scholarship`, `industrial-visit`

---

## Admin Endpoints (Protected)

### 4. Admin Authentication

#### POST `/api/admin/login`
Admin login.

**Request Body:**
```json
{
  "email": "admin@smg.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "email": "admin@smg.com",
      "name": "SMG Admin",
      "role": "admin"
    }
  }
}
```

#### GET `/api/admin/profile`
Get admin profile.

**Headers:**
```
Authorization: Bearer <token>
```

---

### 5. Conversations Management

#### GET `/api/admin/conversations`
Get all conversations with filters.

**Query Parameters:**
- `intent` (optional): Filter by intent
- `userId` (optional): Filter by user ID
- `sessionId` (optional): Filter by session ID
- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "count": 25,
  "total": 150,
  "page": 1,
  "pages": 6,
  "intentStatistics": [
    {
      "_id": "products",
      "count": 45,
      "avgConfidence": 0.87
    }
  ],
  "data": [...]
}
```

---

### 6. Leads Management

#### GET `/api/admin/leads`
Get all leads with filters.

**Query Parameters:**
- `interest` (optional): Filter by interest type
- `status` (optional): Filter by status
- `startDate` (optional): Start date
- `endDate` (optional): End date
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "count": 20,
  "total": 100,
  "page": 1,
  "pages": 5,
  "statistics": {
    "byInterest": [...],
    "byStatus": [...]
  },
  "data": [...]
}
```

#### GET `/api/admin/leads/:id`
Get single lead by ID.

#### PUT `/api/admin/leads/:id/status`
Update lead status.

**Request Body:**
```json
{
  "status": "contacted"
}
```

**Status Values:** `new`, `contacted`, `qualified`, `converted`, `closed`

---

### 7. Analytics

#### GET `/api/admin/analytics`
Get analytics dashboard data.

**Query Parameters:**
- `startDate` (optional): Start date
- `endDate` (optional): End date

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": {
      "total": 500,
      "intentDistribution": [...]
    },
    "leads": {
      "total": 150,
      "byInterest": [...],
      "byStatus": [...]
    },
    "dailyActivity": [...]
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Status Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (inactive account)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Intent Types

The chatbot recognizes the following intents:

- `greeting` - Greetings and salutations
- `about_smg` - About SMG company
- `products` - Product information
- `services` - Services and support
- `internships` - SMG Nirmaan Programme
- `scholarships` - SMG Scholarships
- `industrial_visit` - SMG Bhraman visits
- `financing_insurance` - Financing and insurance
- `contact_social` - Contact and social media
- `unknown` - Unrecognized intent

---

## Example Usage

### JavaScript/Node.js
```javascript
// Chat API
const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userMessage: 'Tell me about internships'
  })
});
const data = await response.json();

// Admin Login
const loginResponse = await fetch('http://localhost:3000/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@smg.com',
    password: 'admin123'
  })
});
const { data: { token } } = await loginResponse.json();

// Get Conversations (with auth)
const convResponse = await fetch('http://localhost:3000/api/admin/conversations?intent=products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### cURL
```bash
# Chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"userMessage": "Hello"}'

# Admin Login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@smg.com", "password": "admin123"}'

# Get Conversations
curl http://localhost:3000/api/admin/conversations \
  -H "Authorization: Bearer <token>"
```

