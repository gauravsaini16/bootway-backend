# BootWay HR Backend API

Production-ready Node.js/Express API for the BootWay HR recruitment system.

## Features

✅ **User Management**
- User registration and authentication
- JWT-based authentication
- Role-based access control (Candidate, HR, Admin)
- User profile management

✅ **Job Management**
- Post jobs with detailed information
- Job status management (Active/Closed)
- Search and filter jobs
- Job analytics

✅ **Application Management**
- Submit job applications
- Track application status
- Application filtering and search
- Prevent duplicate applications

✅ **Interview Management**
- Schedule interviews
- Support multiple interview types (phone, video, in-person, group)
- Interview feedback and ratings
- Interview status tracking

✅ **Offer Management**
- Create and send job offers
- Track offer status (pending, accepted, rejected)
- Offer validity management

✅ **Security**
- Password hashing with bcryptjs
- JWT token-based authentication
- CORS configuration
- Input validation
- Error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

## Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

Required packages:
```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install --save-dev nodemon
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

4. **Start the server**
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication (`/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user | Yes |
| PUT | `/auth/updatePassword` | Update password | Yes |

**Register Example:**
```json
POST /api/auth/register
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "phone": "+1234567890",
  "role": "candidate"
}
```

**Login Example:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Users (`/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users` | Get all users | No |
| GET | `/users/:id` | Get user by ID | No |
| POST | `/users` | Create user (Admin) | No |
| PUT | `/users/:id` | Update user | Yes |
| DELETE | `/users/:id` | Delete user | Yes |

#### Jobs (`/jobs`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/jobs` | Get all jobs | No |
| GET | `/jobs/:id` | Get job by ID | No |
| POST | `/jobs` | Create job (HR/Admin) | No |
| PUT | `/jobs/:id` | Update job | No |
| DELETE | `/jobs/:id` | Delete job | No |
| PATCH | `/jobs/:id/toggle` | Toggle job status | No |

**Create Job Example:**
```json
POST /api/jobs
{
  "title": "Senior Developer",
  "department": "Engineering",
  "location": "San Francisco",
  "type": "full-time",
  "salary": 150000,
  "description": "We are looking for...",
  "skills": ["JavaScript", "React", "Node.js"],
  "requirements": ["5+ years experience", "BS in CS"],
  "responsibilities": ["Design systems", "Lead team"],
  "benefits": ["Health insurance", "401k", "Remote work"]
}
```

#### Applications (`/applications`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/applications` | Get all applications | Yes (Admin/HR) |
| GET | `/applications/:id` | Get application | No |
| POST | `/applications` | Submit application | No |
| PUT | `/applications/:id` | Update application | Yes (Admin/HR) |
| DELETE | `/applications/:id` | Delete application | Yes (Admin/HR) |
| GET | `/applications/job/:jobId` | Get job applications | No |
| GET | `/applications/candidate/my-applications` | Get my applications | Yes |

**Apply for Job Example:**
```json
POST /api/applications
{
  "jobId": "60d5ec49f1b2c72b8c8e4a1a",
  "candidateName": "John Doe",
  "candidateEmail": "john@example.com",
  "candidatePhone": "+1234567890",
  "resume": "url/to/resume.pdf",
  "coverLetter": "I am interested in..."
}
```

#### Interviews (`/interviews`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/interviews` | Get all interviews | Yes |
| GET | `/interviews/:id` | Get interview | Yes |
| POST | `/interviews` | Schedule interview | Yes (Admin/HR) |
| PUT | `/interviews/:id` | Update interview | Yes (Admin/HR) |
| DELETE | `/interviews/:id` | Delete interview | Yes (Admin/HR) |
| GET | `/interviews/candidate/my-interviews` | Get my interviews | Yes |

**Schedule Interview Example:**
```json
POST /api/interviews
{
  "applicationId": "60d5ec49f1b2c72b8c8e4a1a",
  "jobId": "60d5ec49f1b2c72b8c8e4a2b",
  "candidateId": "60d5ec49f1b2c72b8c8e4a3c",
  "interviewType": "video",
  "scheduledDate": "2024-02-15T10:00:00Z",
  "duration": 60,
  "interviewers": ["60d5ec49f1b2c72b8c8e4a4d"],
  "meetingLink": "https://zoom.us/..."
}
```

#### Offers (`/offers`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/offers` | Get all offers | Yes |
| GET | `/offers/:id` | Get offer | Yes |
| POST | `/offers` | Create offer | Yes (Admin/HR) |
| PUT | `/offers/:id` | Update offer | Yes (Admin/HR) |
| DELETE | `/offers/:id` | Delete offer | Yes (Admin/HR) |
| GET | `/offers/candidate/my-offers` | Get my offers | Yes |

**Create Offer Example:**
```json
POST /api/offers
{
  "applicationId": "60d5ec49f1b2c72b8c8e4a1a",
  "jobId": "60d5ec49f1b2c72b8c8e4a2b",
  "candidateId": "60d5ec49f1b2c72b8c8e4a3c",
  "candidateName": "John Doe",
  "candidateEmail": "john@example.com",
  "position": "Senior Developer",
  "department": "Engineering",
  "salary": 150000,
  "currency": "USD",
  "startDate": "2024-03-01T00:00:00Z",
  "offerValidTill": "2024-02-28T00:00:00Z",
  "benefits": ["Health insurance", "401k", "Remote work"]
}
```

## Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

## Database Schema

### Collections

**users**
- Stores candidate, HR, and admin user data
- Password hashed with bcrypt
- Includes profile information and skills

**jobs**
- Job postings with title, description, requirements
- Tracks application count and status

**applications**
- Job applications from candidates
- Includes resume and cover letter
- Status tracking (applied, under-review, shortlisted, rejected, interview, offer)

**interviews**
- Interview schedules and feedback
- Multiple interview types supported
- Tracks ratings and notes

**offers**
- Job offers sent to candidates
- Tracks salary, benefits, and validity period
- Status management (pending, accepted, rejected)

## Error Handling

All errors are centralized through the `errorHandler` middleware:
- Provides consistent error responses
- Includes detailed error messages in development
- Hides sensitive info in production

## Security Features

✅ **Password Security**
- Passwords hashed with bcryptjs
- Never stored in plain text

✅ **Authentication**
- JWT tokens with configurable expiration
- Secure token verification

✅ **Authorization**
- Role-based access control
- Protected routes with middleware

✅ **CORS**
- Configured for frontend origins
- Prevents unauthorized cross-origin requests

✅ **Input Validation**
- MongoDB schema validation
- Required field checks
- Email format validation

## Development

### Project Structure
```
backend/
├── models/           # MongoDB schemas
├── controllers/      # Business logic
├── routes/          # API endpoints
├── middleware/      # Custom middleware
├── server.js        # Entry point
└── .env.example     # Environment template
```

### Adding a New Feature

1. Create model in `models/`
2. Create controller in `controllers/`
3. Create routes in `routes/`
4. Mount routes in `server.js`

### Testing

Use tools like Postman or cURL to test endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all jobs
curl http://localhost:5000/api/jobs

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## Deployment

1. Set `NODE_ENV=production` in .env
2. Ensure `JWT_SECRET` is set to a strong random value
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "bootway-api"
   ```

## Contributing

1. Follow existing code structure
2. Add error handling
3. Update documentation
4. Test thoroughly

## License

MIT

## Support

For issues or questions, please contact the development team.
