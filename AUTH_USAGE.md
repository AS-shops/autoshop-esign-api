# JWT Authentication Usage Guide

## Overview
Your API now has JWT authentication with the following features:
- Login endpoint with JWT token generation
- Protected GET routes for contracts
- Default admin user created automatically

## Default Credentials
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password in production!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info (protected)

### Contracts (Protected)
- `GET /api/contracts` - Get all contracts (requires auth)
- `GET /api/contracts/:id` - Get specific contract (requires auth)
- `POST /api/contracts` - Create contract (no auth required)

## Usage Examples

### 1. Login to get token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

### 2. Use token to access protected routes
```bash
# Get all contracts (replace TOKEN with your actual token)
curl -X GET http://localhost:5000/api/contracts \
  -H "Authorization: Bearer TOKEN"
```

### 3. Get current user info
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## Frontend Integration

### React/JavaScript Example
```javascript
// Login function
const login = async (username, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
    return data.user;
  } else {
    throw new Error(data.error);
  }
};

// Authenticated request function
const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  
  return fetch(url, { ...options, headers });
};

// Get contracts example
const getContracts = async () => {
  const response = await authenticatedFetch('/api/contracts');
  return response.json();
};
```

## Environment Variables

Set these in your Vercel dashboard or `.env` file locally:

```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

## Security Notes

1. **JWT Secret**: Always use a strong, unique JWT secret in production
2. **Token Expiration**: Tokens expire after 24 hours
3. **Password Security**: Default password is hashed with bcrypt
4. **HTTPS**: Always use HTTPS in production to protect tokens

## File Storage

User credentials are stored in `users.json` (same location as contracts):
- Local: `backend/users.json`
- Vercel: `/tmp/users.json`

⚠️ **Note**: Like contracts, user data resets on Vercel redeployment. Consider using a database for production.

## Error Responses

### Authentication Errors
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Token expired or invalid
- `400 Bad Request`: Missing username/password

### Example Error Response
```json
{
  "error": "Access token required"
}
```

## Testing with Postman/Insomnia

1. First, login to get a token
2. Add Authorization header: `Bearer {your_token}`
3. Make requests to protected endpoints

## Next Steps for Production

1. Change default admin password
2. Set strong JWT_SECRET environment variable
3. Consider implementing user registration
4. Add role-based access control
5. Implement token refresh mechanism
6. Add rate limiting for login attempts
