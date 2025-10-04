# 🚀 Manual Heroku Deployment Guide

## 📋 Prerequisites

### **1. Install Heroku CLI**
1. Go to: https://devcenter.heroku.com/articles/heroku-cli
2. Download the Windows installer
3. Run the installer
4. Restart your terminal/command prompt

### **2. Create Heroku Account**
1. Go to: https://signup.heroku.com
2. Create a free account
3. Verify your email

## 🚀 Step-by-Step Deployment

### **Step 1: Login to Heroku**
```bash
heroku login
```
- This will open a browser window
- Click "Log in" to authorize

### **Step 2: Create Heroku App**
```bash
heroku create carbon-emission-pro
```
- Replace `carbon-emission-pro` with your desired app name
- App names must be unique across all Heroku apps

### **Step 3: Add MongoDB Database**
```bash
heroku addons:create mongolab:sandbox
```
- This adds a free MongoDB database to your app

### **Step 4: Set Environment Variables**
```bash
# Set production environment
heroku config:set NODE_ENV=production

# Set JWT secret (generate a random string)
heroku config:set JWT_SECRET=your-super-secret-jwt-key-for-production

# Set client URL
heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com

# Set OpenAI API key (optional)
heroku config:set OPENAI_API_KEY=your-openai-api-key-here
```

### **Step 5: Initialize Git (if not already done)**
```bash
git init
git add .
git commit -m "Initial commit"
```

### **Step 6: Deploy to Heroku**
```bash
git push heroku main
```
- This will build and deploy your app
- Wait for the build to complete

### **Step 7: Seed Database**
```bash
heroku run node scripts/seedData.js
```
- This populates your database with sample data

### **Step 8: Open Your App**
```bash
heroku open
```
- This opens your app in the browser

## 🔧 Troubleshooting

### **Common Issues:**

**1. Build Failed**
```bash
# Check build logs
heroku logs --tail

# Common solutions:
# - Check package.json has correct scripts
# - Ensure all dependencies are listed
# - Check Procfile exists
```

**2. Database Connection Failed**
```bash
# Check if MongoDB addon is added
heroku addons

# Add MongoDB if missing
heroku addons:create mongolab:sandbox
```

**3. App Crashes on Startup**
```bash
# Check app logs
heroku logs --tail

# Common solutions:
# - Check environment variables
# - Verify database connection
# - Check port binding
```

**4. Frontend Not Loading**
```bash
# Check if build completed
heroku run ls -la client/build

# Rebuild if needed
git commit --allow-empty -m "Rebuild"
git push heroku main
```

## 📊 Verify Deployment

### **Check App Status**
```bash
# Check if app is running
heroku ps

# Check app logs
heroku logs --tail

# Check environment variables
heroku config
```

### **Test Your App**
1. Open: https://your-app-name.herokuapp.com
2. Login with: john@example.com / password123
3. Check dashboard loads with data
4. Test all features

## 🎯 Demo Setup

### **Pre-Demo Checklist:**
- [ ] App loads without errors
- [ ] Login works with demo credentials
- [ ] Dashboard displays real-time data
- [ ] AI features work
- [ ] Mobile responsive

### **Demo Credentials:**
```
Admin: john@example.com / password123
Manager: sarah@example.com / password123
Analyst: mike@example.com / password123
```

### **Demo URLs:**
- **Production**: https://your-app-name.herokuapp.com
- **Local Backup**: http://localhost:3000

## 🚀 Quick Commands Reference

```bash
# Create app
heroku create your-app-name

# Add MongoDB
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set KEY=value

# Deploy
git push heroku main

# Check logs
heroku logs --tail

# Open app
heroku open

# Run commands
heroku run node scripts/seedData.js

# Check status
heroku ps

# Restart app
heroku restart
```

## 🏆 Success!

Once deployed, your CarbonEmission Pro app will be available at:
**https://your-app-name.herokuapp.com**

**Features available:**
- ✅ Real-time emissions monitoring
- ✅ AI-powered optimization
- ✅ Cost reduction analysis
- ✅ AI chatbot assistant
- ✅ Carbon capture recommendations

**Ready for your hackathon presentation! 🚀🏆**
