# 🚀 CarbonEmission Pro - Deployment Guide

## 📋 Deployment Options

### 1. **Heroku (Recommended for Hackathon)**
- ✅ Easy and fast deployment
- ✅ Free tier available
- ✅ Automatic builds
- ✅ Built-in MongoDB addon

### 2. **Vercel + MongoDB Atlas**
- ✅ Excellent for React apps
- ✅ Serverless functions
- ✅ Global CDN
- ✅ Free tier available

### 3. **Railway**
- ✅ Simple deployment
- ✅ Built-in database
- ✅ Automatic deployments
- ✅ Free tier available

### 4. **AWS/GCP/Azure**
- ✅ Production-ready
- ✅ Scalable infrastructure
- ✅ Advanced features
- ⚠️ More complex setup

---

## 🚀 Option 1: Heroku Deployment (Recommended)

### **Step 1: Prepare for Heroku**

1. **Install Heroku CLI**
   ```bash
   # Download from: https://devcenter.heroku.com/articles/heroku-cli
   # Or use package manager:
   # Windows: choco install heroku
   # Mac: brew install heroku
   # Ubuntu: snap install heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

### **Step 2: Create Heroku App**

```bash
# Create new Heroku app
heroku create carbon-emission-pro

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key-for-production
heroku config:set OPENAI_API_KEY=your-openai-api-key-here
heroku config:set CLIENT_URL=https://carbon-emission-pro.herokuapp.com
```

### **Step 3: Configure for Heroku**

1. **Update package.json scripts**
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "heroku-postbuild": "cd client && npm install && npm run build"
     }
   }
   ```

2. **Create Procfile**
   ```bash
   echo "web: node server.js" > Procfile
   ```

3. **Update server.js for production**
   ```javascript
   // Add this to server.js before app.listen()
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, 'client/build')));
     
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
     });
   }
   ```

### **Step 4: Deploy to Heroku**

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Add Heroku remote
heroku git:remote -a carbon-emission-pro

# Deploy
git push heroku main

# Open the app
heroku open
```

### **Step 5: Seed Database**

```bash
# Run seed script on Heroku
heroku run node scripts/seedData.js
```

---

## 🌐 Option 2: Vercel + MongoDB Atlas

### **Step 1: Setup MongoDB Atlas**

1. **Create MongoDB Atlas account**
   - Go to https://cloud.mongodb.com
   - Create free cluster
   - Get connection string

2. **Create .env.local**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbon-emissions
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   ```

### **Step 2: Deploy Backend to Vercel**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Create vercel.json**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server.js"
       },
       {
         "src": "/(.*)",
         "dest": "/client/build/index.html"
       }
     ]
   }
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### **Step 3: Deploy Frontend to Vercel**

1. **Go to client directory**
   ```bash
   cd client
   ```

2. **Create vercel.json in client**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "build"
         }
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ]
   }
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

---

## 🚂 Option 3: Railway Deployment

### **Step 1: Setup Railway**

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

### **Step 2: Deploy**

```bash
# Initialize Railway project
railway init

# Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-super-secret-jwt-key
railway variables set OPENAI_API_KEY=your-openai-api-key
railway variables set MONGODB_URI=mongodb://localhost:27017/carbon-emissions

# Deploy
railway up
```

---

## 🐳 Option 4: Docker Deployment

### **Step 1: Create Dockerfile**

```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci --only=production
RUN cd client && npm ci --only=production

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
```

### **Step 2: Create docker-compose.yml**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/carbon-emissions
      - JWT_SECRET=your-super-secret-jwt-key
      - OPENAI_API_KEY=your-openai-api-key
    depends_on:
      - mongo

  mongo:
    image: mongo:4.4
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### **Step 3: Deploy with Docker**

```bash
# Build and start
docker-compose up -d

# Seed database
docker-compose exec app node scripts/seedData.js
```

---

## ☁️ Option 5: AWS Deployment

### **Step 1: Setup AWS**

1. **Install AWS CLI**
   ```bash
   # Download from: https://aws.amazon.com/cli/
   aws configure
   ```

2. **Create Elastic Beanstalk application**
   ```bash
   # Install EB CLI
   pip install awsebcli

   # Initialize EB
   eb init

   # Create environment
   eb create production
   ```

### **Step 2: Configure for AWS**

1. **Create .ebextensions/01-packages.config**
   ```yaml
   packages:
     yum:
       git: []
   ```

2. **Create .ebextensions/02-nodejs.config**
   ```yaml
   option_settings:
     aws:elasticbeanstalk:container:nodejs:
       NodeCommand: "npm start"
       NodeVersion: 16.x
   ```

### **Step 3: Deploy**

```bash
# Deploy to AWS
eb deploy

# Setup RDS for MongoDB
eb create --database.engine mongodb
```

---

## 🔧 Environment Variables

### **Required Variables**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/carbon-emissions
JWT_SECRET=your-super-secret-jwt-key-change-this
OPENAI_API_KEY=your-openai-api-key-here
CLIENT_URL=https://your-domain.com
```

### **Optional Variables**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
WEATHER_API_KEY=your-weather-api-key
CARBON_INTENSITY_API_KEY=your-carbon-intensity-api-key
```

---

## 📊 Database Setup

### **MongoDB Atlas (Recommended)**

1. **Create cluster**
   - Go to https://cloud.mongodb.com
   - Create free cluster
   - Get connection string

2. **Update connection string**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbon-emissions
   ```

### **Local MongoDB**

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb

   # macOS
   brew install mongodb

   # Windows
   # Download from: https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB**
   ```bash
   mongod
   ```

### **Seed Database**

```bash
# After deployment, seed the database
node scripts/seedData.js
```

---

## 🚀 Quick Deploy Scripts

### **Heroku Quick Deploy**

```bash
#!/bin/bash
# quick-deploy-heroku.sh

echo "🚀 Deploying CarbonEmission Pro to Heroku..."

# Create Heroku app
heroku create carbon-emission-pro

# Add MongoDB
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set OPENAI_API_KEY=$OPENAI_API_KEY

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Seed database
heroku run node scripts/seedData.js

echo "✅ Deployment complete!"
echo "🌐 App URL: https://carbon-emission-pro.herokuapp.com"
```

### **Vercel Quick Deploy**

```bash
#!/bin/bash
# quick-deploy-vercel.sh

echo "🚀 Deploying CarbonEmission Pro to Vercel..."

# Install Vercel CLI
npm i -g vercel

# Deploy backend
vercel --prod

# Deploy frontend
cd client
vercel --prod

echo "✅ Deployment complete!"
```

---

## 🔍 Post-Deployment Checklist

### **✅ Verify Deployment**

1. **Check Application**
   - [ ] App loads without errors
   - [ ] Login works with demo credentials
   - [ ] Dashboard displays data
   - [ ] Real-time monitoring works
   - [ ] AI chatbot responds

2. **Check Database**
   - [ ] Data is seeded correctly
   - [ ] Users can be created
   - [ ] Emissions data is stored
   - [ ] Optimizations are saved

3. **Check Performance**
   - [ ] Page load times are acceptable
   - [ ] Charts render correctly
   - [ ] Real-time updates work
   - [ ] Mobile responsiveness

### **🔧 Troubleshooting**

**Common Issues:**

1. **Build Failures**
   ```bash
   # Check Node.js version
   node --version
   
   # Clear cache
   npm cache clean --force
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Database Connection Issues**
   ```bash
   # Check MongoDB connection
   mongo $MONGODB_URI
   
   # Verify environment variables
   echo $MONGODB_URI
   ```

3. **API Errors**
   ```bash
   # Check server logs
   heroku logs --tail
   
   # Check environment variables
   heroku config
   ```

---

## 🎯 Hackathon Demo Setup

### **Pre-Demo Checklist**

1. **Deploy to Heroku** (5 minutes)
   ```bash
   # Quick Heroku deployment
   heroku create your-app-name
   heroku addons:create mongolab:sandbox
   git push heroku main
   heroku run node scripts/seedData.js
   ```

2. **Test Demo Flow** (2 minutes)
   - Login with demo credentials
   - Show dashboard
   - Demonstrate AI features
   - Test chatbot

3. **Prepare Demo Data** (1 minute)
   - Ensure sample data is loaded
   - Check all features work
   - Prepare backup screenshots

### **Demo URLs**
- **Production**: https://your-app-name.herokuapp.com
- **Local**: http://localhost:3000
- **Backup**: Screenshots and video recording

---

## 🏆 Production Optimization

### **Performance Optimization**

1. **Enable Compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add Caching**
   ```javascript
   const redis = require('redis');
   const client = redis.createClient();
   ```

3. **Database Indexing**
   ```javascript
   // Add indexes for better performance
   emissionSchema.index({ plantId: 1, timestamp: -1 });
   ```

### **Security Hardening**

1. **Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
   ```

2. **CORS Configuration**
   ```javascript
   app.use(cors({
     origin: process.env.CLIENT_URL,
     credentials: true
   }));
   ```

3. **Helmet Security**
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

---

**Ready to deploy and win the hackathon! 🚀🏆**
