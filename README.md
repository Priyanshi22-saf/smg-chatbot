# SMG Electric Scooters Chatbot - Backend API

A scalable, production-ready Node.js/Express backend for the SMG Electric Scooters Chatbot application with MongoDB, JWT authentication, and comprehensive admin panel APIs.

## 🚀 Features

- **Chatbot Engine** - Keyword-based intent detection with 10+ intents
- **User Conversation Logging** - MongoDB storage with session management
- **Lead Management** - Capture and manage customer inquiries
- **Programs API** - SMG Nirmaan, Scholarships, and Industrial Visits
- **Admin Panel APIs** - Protected endpoints with JWT authentication
- **Analytics Dashboard** - Conversation and lead statistics
- **MVC Architecture** - Clean, scalable, maintainable code structure
- **Error Handling** - Comprehensive error handling middleware
- **Input Validation** - Request validation and sanitization

## 📋 Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Environment:** dotenv

## 📁 Project Structure

```
smg/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── jwt.js                # JWT configuration
│   ├── controllers/
│   │   ├── chatController.js     # Chat endpoints
│   │   ├── leadController.js     # Lead management
│   │   ├── programController.js  # Programs info
│   │   └── adminController.js    # Admin operations
│   ├── models/
│   │   ├── Conversation.js       # Conversation schema
│   │   ├── Lead.js               # Lead schema
│   │   └── Admin.js               # Admin schema
│   ├── routes/
│   │   ├── chatRoutes.js          # Chat routes
│   │   ├── leadRoutes.js          # Lead routes
│   │   ├── programRoutes.js       # Program routes
│   │   └── adminRoutes.js         # Admin routes
│   ├── services/
│   │   └── chatbotService.js      # Intent detection logic
│   ├── middlewares/
│   │   ├── auth.js                # JWT authentication
│   │   ├── errorHandler.js       # Error handling
│   │   └── asyncHandler.js       # Async wrapper
│   ├── utils/
│   │   ├── validators.js          # Validation utilities
│   │   └── seedAdmin.js           # Admin seeding script
│   └── app.js                     # Express app configuration
├── server.js                      # Server entry point
├── package.json
├── .env.example
└── README.md
```

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/smg_chatbot
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smg_chatbot

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# Admin (for seeding)
ADMIN_EMAIL=admin@smg.com
ADMIN_PASSWORD=admin123
```

### 4. Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

**MongoDB Atlas:**
- Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create cluster and get connection string
- Update `MONGODB_URI` in `.env`

### 5. Seed Admin User (Optional)

Create default admin user:

```bash
npm run seed
```

This creates an admin with:
- Email: `admin@smg.com` (or from `ADMIN_EMAIL`)
- Password: `admin123` (or from `ADMIN_PASSWORD`)

**⚠️ Change default password after first login!**

### 6. Start Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will start on `http://localhost:3000`

## 📡 API Endpoints

### Public Endpoints

- `POST /api/chat` - Process chat message
- `GET /api/chat/history/:sessionId` - Get conversation history
- `POST /api/leads` - Create lead
- `GET /api/programs` - Get all programs
- `GET /api/programs/:type` - Get specific program

### Admin Endpoints (Protected)

- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile
- `GET /api/admin/conversations` - Get conversations (with filters)
- `GET /api/admin/leads` - Get leads (with filters)
- `GET /api/admin/analytics` - Get analytics data

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation.

## 🎯 Chatbot Intents

The chatbot recognizes the following intents:

1. **greeting** - Greetings and salutations
2. **about_smg** - About SMG company
3. **products** - Product information
4. **services** - Services and support
5. **internships** - SMG Nirmaan Programme
6. **scholarships** - SMG Scholarships
7. **industrial_visit** - SMG Bhraman visits
8. **financing_insurance** - Financing and insurance
9. **contact_social** - Contact and social media
10. **unknown** - Unrecognized intent

## 🔐 Authentication

Admin endpoints require JWT authentication:

1. Login via `POST /api/admin/login` to get token
2. Include token in request headers:
   ```
   Authorization: Bearer <token>
   ```

## 📊 Database Schemas

### Conversation
- `userId` - Optional user identifier
- `message` - User message
- `intent` - Detected intent
- `response` - Bot response
- `confidenceScore` - Intent confidence (0-1)
- `sessionId` - Session identifier
- `createdAt` - Timestamp

### Lead
- `name` - Lead name
- `phone` - Phone number
- `email` - Email address
- `interest` - Interest type (product/internship/scholarship/dealership)
- `city` - City
- `status` - Lead status (new/contacted/qualified/converted/closed)
- `createdAt` - Timestamp

### Admin
- `email` - Admin email (unique)
- `password` - Hashed password
- `role` - Admin role
- `name` - Admin name
- `isActive` - Active status
- `lastLogin` - Last login timestamp

## 🧪 Testing API

### Using cURL

**Chat API:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"userMessage": "Tell me about internships"}'
```

**Admin Login:**
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@smg.com", "password": "admin123"}'
```

**Get Conversations (with auth):**
```bash
curl http://localhost:3000/api/admin/conversations \
  -H "Authorization: Bearer <your-token>"
```

### Using Postman/Insomnia

1. Import endpoints from `API_DOCUMENTATION.md`
2. For protected routes, add `Authorization: Bearer <token>` header
3. Set `Content-Type: application/json` for POST requests

## 🚀 Deployment

### Environment Variables for Production

```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-random-secret-32-chars-min>
```

### Recommended Platforms

- **Heroku** - Easy deployment with MongoDB Atlas
- **Railway** - Simple MongoDB integration
- **DigitalOcean** - App Platform with managed MongoDB
- **AWS** - EC2 + DocumentDB or MongoDB Atlas
- **Vercel/Netlify** - Serverless (requires adjustments)

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed default admin user

## 🔒 Security Best Practices

1. **Change default admin credentials** after first login
2. **Use strong JWT_SECRET** (minimum 32 characters)
3. **Enable HTTPS** in production
4. **Use MongoDB Atlas** with IP whitelisting
5. **Implement rate limiting** (recommended: express-rate-limit)
6. **Validate and sanitize** all inputs
7. **Keep dependencies updated**

## 📚 Additional Documentation

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API reference
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture overview (if exists)

## 🤝 Contributing

1. Follow MVC architecture
2. Add proper error handling
3. Include input validation
4. Write clear comments
5. Test endpoints before committing

## 📄 License

ISC

## 🆘 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for SMG Electric Scooters**
