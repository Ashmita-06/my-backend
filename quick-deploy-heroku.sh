#!/bin/bash

echo "🚀 Deploying CarbonEmission Pro to Heroku..."
echo "=============================================="

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first:"
    echo "   https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "🔐 Please login to Heroku first:"
    heroku login
fi

# Get app name from user or use default
read -p "Enter Heroku app name (or press Enter for 'carbon-emission-pro'): " APP_NAME
APP_NAME=${APP_NAME:-carbon-emission-pro}

echo "📦 Creating Heroku app: $APP_NAME"

# Create Heroku app
heroku create $APP_NAME

# Add MongoDB addon
echo "🗄️ Adding MongoDB addon..."
heroku addons:create mongolab:sandbox -a $APP_NAME

# Set environment variables
echo "⚙️ Setting environment variables..."
heroku config:set NODE_ENV=production -a $APP_NAME
heroku config:set JWT_SECRET=$(openssl rand -base64 32) -a $APP_NAME
heroku config:set CLIENT_URL=https://$APP_NAME.herokuapp.com -a $APP_NAME

# Ask for OpenAI API key
read -p "Enter your OpenAI API key (or press Enter to skip): " OPENAI_KEY
if [ ! -z "$OPENAI_KEY" ]; then
    heroku config:set OPENAI_API_KEY=$OPENAI_KEY -a $APP_NAME
    echo "✅ OpenAI API key set"
else
    echo "⚠️ OpenAI API key not set. Chatbot features will be limited."
fi

# Create Procfile if it doesn't exist
if [ ! -f "Procfile" ]; then
    echo "📝 Creating Procfile..."
    echo "web: node server.js" > Procfile
fi

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
fi

# Add all files to git
echo "📤 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy CarbonEmission Pro to Heroku"

# Deploy to Heroku
echo "🚀 Deploying to Heroku..."
git push heroku main

# Wait for deployment to complete
echo "⏳ Waiting for deployment to complete..."
sleep 10

# Check if deployment was successful
if heroku ps -a $APP_NAME | grep -q "web.1.*up"; then
    echo "✅ Deployment successful!"
    
    # Seed database
    echo "🌱 Seeding database with sample data..."
    heroku run node scripts/seedData.js -a $APP_NAME
    
    echo ""
    echo "🎉 CarbonEmission Pro is now live!"
    echo "🌐 App URL: https://$APP_NAME.herokuapp.com"
    echo ""
    echo "🔑 Demo credentials:"
    echo "   Admin: john@example.com / password123"
    echo "   Manager: sarah@example.com / password123"
    echo "   Analyst: mike@example.com / password123"
    echo ""
    echo "📊 Features available:"
    echo "   ✅ Real-time emissions monitoring"
    echo "   ✅ AI-powered optimization"
    echo "   ✅ Cost reduction analysis"
    echo "   ✅ AI chatbot assistant"
    echo "   ✅ Carbon capture recommendations"
    echo ""
    echo "🏆 Ready for your hackathon presentation!"
    
    # Open the app
    read -p "Open the app in browser? (y/n): " OPEN_APP
    if [ "$OPEN_APP" = "y" ] || [ "$OPEN_APP" = "Y" ]; then
        heroku open -a $APP_NAME
    fi
    
else
    echo "❌ Deployment failed. Check the logs:"
    heroku logs --tail -a $APP_NAME
fi
