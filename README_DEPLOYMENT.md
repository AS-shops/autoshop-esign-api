# Vercel Deployment Instructions

## Prerequisites
- Node.js installed locally
- Vercel account (sign up at vercel.com)
- Vercel CLI installed: `npm i -g vercel`

## Deployment Steps

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from Backend Directory
```bash
cd c:\Users\PC\Desktop\autoshop_esign\backend
vercel
```

### 4. Follow the Prompts
- **Set up and deploy?** → Yes
- **Which scope?** → Your Vercel account
- **Link to existing project?** → No (create new)
- **What's your project's name?** → autoshop-backend (or your choice)
- **In which directory is your code located?** → ./ (current directory)

### 5. Environment Variables (Optional)
If you need to set environment variables:
```bash
vercel env add NODE_ENV production
vercel env add
```

### 6. Redeploy with Environment Variables
```bash
vercel --prod
```

## Important Notes

### File Storage
- Your app uses file-based storage (`contracts.json`)
- On Vercel, files are stored in `/tmp` directory
- **Warning**: `/tmp` storage is ephemeral and resets on each deployment
- For production, consider using:
  - Vercel KV (Redis)
  - External database (MongoDB, PostgreSQL)
  - Vercel Postgres

### API Endpoints
Once deployed, your API will be available at:
- `https://your-project-name.vercel.app/api/contracts`
- `https://your-project-name.vercel.app/api/contracts/:id`

### Local Development
Run locally with:
```bash
npm run dev
```

### Testing
Test your deployment:
```bash
# Test GET all contracts
curl https://your-project-name.vercel.app/api/contracts

# Test POST contract
curl -X POST https://your-project-name.vercel.app/api/contracts \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "phoneNumber": "1234567890",
    "position": "Manager",
    "businessName": "Test Business",
    "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
    "agreed": true,
    "plan": "Basic",
    "startDate": "2024-01-01"
  }'
```

## Troubleshooting

### Common Issues
1. **File storage resets**: This is expected behavior on Vercel. Use a database for persistent storage.
2. **CORS errors**: Your app has CORS enabled, but you may need to specify allowed origins.
3. **Timeout errors**: Increase `maxDuration` in `vercel.json` if needed.

### Logs
View deployment logs:
```bash
vercel logs
```

## Next Steps
For production deployment, consider:
1. Adding a proper database
2. Implementing authentication
3. Adding error monitoring
4. Setting up custom domain
