# MongoDB Atlas Setup Guide

## 🚀 Quick Setup Steps

### 1. Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Verify your email

### 2. Create a Cluster
1. Click **"Build a Cluster"**
2. Select **"M0 Sandbox"** (Free tier)
3. Choose a cloud provider and region (closest to you)
4. Leave cluster name as default or change it
5. Click **"Create Cluster"**

### 3. Configure Database Access
1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Enter username: `autoshop_user` (or your choice)
4. Enter a strong password
5. Select **"Read and write to any database"**
6. Click **"Add User"**

### 4. Configure Network Access
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 5. Get Connection String
1. Go to **"Clusters"** → Click **"Connect"** on your cluster
2. Select **"Drivers"**
3. Copy the connection string
4. Replace `<username>` and `<password>` with your database credentials

### 6. Update Your .env File
Create/update your `.env` file:

```bash
# MongoDB Atlas Connection
DATABASE_URL=mongodb+srv://autoshop_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/autoshop_esign?retryWrites=true&w=majority

# Other settings
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=10
```

## 🔧 Configuration Details

### Connection String Format:
```
mongodb+srv://username:password@cluster-name.xxxxx.mongodb.net/database-name?retryWrites=true&w=majority
```

### What Each Part Means:
- `username`: Your database user (e.g., `autoshop_user`)
- `password`: Your database user's password
- `cluster-name`: Your Atlas cluster name
- `xxxxx`: Your unique cluster identifier
- `database-name`: Your database name (e.g., `autoshop_esign`)

## 🚦 Testing Your Connection

### 1. Install Dependencies (already done)
```bash
npm install mongoose dotenv
```

### 2. Start Your Server
```bash
npm run dev
```

### 3. Check Console Output
You should see:
```
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
Default admin user created
OTAS Tech Solutions - Contract Server running on http://localhost:5000
```

## 📊 Database Collections

Your app will automatically create these collections:

### `users` Collection
```json
{
  "_id": "...",
  "username": "admin",
  "password": "hashed_password",
  "role": "admin",
  "isActive": true,
  "lastLogin": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### `contracts` Collection
```json
{
  "_id": "...",
  "fullName": "John Doe",
  "phoneNumber": "+1234567890",
  "position": "Manager",
  "businessName": "AutoShop",
  "signature": "data:image/png;base64,...",
  "agreed": true,
  "plan": "Premium",
  "startDate": "2024-01-15",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🌐 Vercel Deployment

### Add Environment Variables in Vercel:
1. Go to your Vercel project dashboard
2. Go to **"Settings"** → **"Environment Variables"**
3. Add these variables:
   - `DATABASE_URL` (your MongoDB Atlas connection string)
   - `JWT_SECRET` (strong secret key)
   - `NODE_ENV` = `production`
   - `JWT_EXPIRES_IN` = `24h`
   - `BCRYPT_ROUNDS` = `10`

### Deploy:
```bash
vercel --prod
```

## 🔍 Troubleshooting

### Common Issues:

1. **Connection Failed**:
   - Check username/password in connection string
   - Verify IP access (0.0.0.0/0 for development)
   - Ensure cluster is created and running

2. **Authentication Failed**:
   - Verify database user has correct permissions
   - Check password is URL-encoded (special characters)

3. **Network Timeout**:
   - Check your internet connection
   - Try a different MongoDB region

### Test Connection Manually:
```bash
# Install MongoDB CLI tools
npm install -g mongodb-atlas-cli

# Test connection
mongosh "mongodb+srv://username:password@cluster.xxxxx.mongodb.net/autoshop_esign"
```

## 📈 Migration from JSON Files

Your existing JSON files (`contracts.json`, `users.json`) will NOT be automatically migrated. To migrate:

1. **Backup your JSON files**
2. **Run this migration script** (optional):
```javascript
// Create a temporary migration script
const fs = require('fs');
const mongoose = require('mongoose');
const Contract = require('./models/Contract');
const User = require('./models/User');

async function migrate() {
  await mongoose.connect(process.env.DATABASE_URL);
  
  // Migrate contracts
  const contracts = JSON.parse(fs.readFileSync('contracts.json'));
  for (const contract of contracts) {
    await Contract.create({
      ...contract,
      _id: undefined // Let MongoDB generate new ID
    });
  }
  
  console.log('Migration complete!');
  process.exit(0);
}

migrate();
```

## ✅ Success Indicators

Once setup is complete:
- ✅ Server connects to MongoDB Atlas
- ✅ Default admin user created automatically
- ✅ All API endpoints work with database
- ✅ Data persists between deployments
- ✅ Ready for production scaling

## 🆘 Need Help?

- MongoDB Atlas Documentation: https://docs.mongodb.com/atlas
- Mongoose Documentation: https://mongoosejs.com/docs/
- Check your Atlas cluster logs for connection issues
