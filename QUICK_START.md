# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and set:
# - MONGODB_URI (local or Atlas)
# - JWT_SECRET (any random string, 32+ chars)
```

### Step 3: Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Just update MONGODB_URI in .env
```

### Step 4: Seed Admin (Optional)
```bash
npm run seed
# Creates: admin@smg.com / admin123
```

### Step 5: Start Server
```bash
npm run dev
```

### Step 6: Test API
```bash
# Test Chat API
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"userMessage": "Hello"}'

# Test Admin Login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@smg.com", "password": "admin123"}'
```

## 📋 Key Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/chat` | POST | Public | Process chat message |
| `/api/leads` | POST | Public | Create lead |
| `/api/programs` | GET | Public | Get programs info |
| `/api/admin/login` | POST | Public | Admin login |
| `/api/admin/conversations` | GET | Admin | Get conversations |
| `/api/admin/leads` | GET | Admin | Get leads |
| `/api/admin/analytics` | GET | Admin | Get analytics |

## 🎯 Common Use Cases

### 1. User sends chat message
```javascript
POST /api/chat
{
  "userMessage": "Tell me about internships"
}
```

### 2. User submits lead
```javascript
POST /api/leads
{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "interest": "internship",
  "city": "Mumbai"
}
```

### 3. Admin views conversations
```javascript
GET /api/admin/conversations?intent=products&page=1&limit=20
Headers: Authorization: Bearer <token>
```

### 4. Admin views analytics
```javascript
GET /api/admin/analytics?startDate=2024-01-01&endDate=2024-01-31
Headers: Authorization: Bearer <token>
```

## 🔑 Default Credentials

After running `npm run seed`:
- **Email:** admin@smg.com
- **Password:** admin123

**⚠️ Change password after first login!**

## 📁 Project Structure Overview

```
src/
├── config/        # Database & JWT config
├── controllers/   # Request handlers
├── models/        # MongoDB schemas
├── routes/        # API routes
├── services/      # Business logic
├── middlewares/   # Auth & error handling
└── utils/         # Helper functions
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- Check network/firewall settings

### JWT Authentication Fails
- Verify JWT_SECRET is set in .env
- Check token format: `Bearer <token>`
- Ensure token hasn't expired

### Port Already in Use
- Change PORT in .env
- Or kill process using port 3000

## 📚 Next Steps

1. Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API reference
2. Review [README.md](./README.md) for complete setup guide
3. Customize chatbot intents in `src/services/chatbotService.js`
4. Add more admin features as needed

## 💡 Tips

- Use Postman/Insomnia for API testing
- Check MongoDB Compass to view data
- Enable MongoDB logging for debugging
- Use environment-specific .env files

