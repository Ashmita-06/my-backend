#!/bin/bash

echo "🚀 Deploying CarbonEmission Pro to Vercel..."
echo "============================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first:"
    vercel login
fi

echo "📝 Setting up environment variables..."

# Create .env.local for Vercel
cat > .env.local << EOF
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbon-emissions
JWT_SECRET=your-super-secret-jwt-key-for-production
OPENAI_API_KEY=your-openai-api-key-here
CLIENT_URL=https://your-app.vercel.app
EOF

echo "⚠️ Please update .env.local with your actual MongoDB Atlas connection string and API keys"

# Create vercel.json for backend
cat > vercel.json << EOF
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
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
EOF

echo "🚀 Deploying backend to Vercel..."

# Deploy backend
vercel --prod

# Get the backend URL
BACKEND_URL=$(vercel ls | grep -o 'https://[^ ]*' | head -1)
echo "✅ Backend deployed to: $BACKEND_URL"

# Update client for production
cd client

# Create vercel.json for frontend
cat > vercel.json << EOF
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
  ],
  "env": {
    "REACT_APP_API_URL": "$BACKEND_URL"
  }
}
EOF

# Update package.json for Vercel
cat > package.json << EOF
{
  "name": "carbon-emissions-client",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "react-router-dom": "^6.8.1",
    "axios": "^1.3.4",
    "chart.js": "^4.2.1",
    "react-chartjs-2": "^5.2.0",
    "recharts": "^2.5.0",
    "framer-motion": "^10.0.1",
    "styled-components": "^5.3.9",
    "react-query": "^3.39.3",
    "react-hook-form": "^7.43.5",
    "react-hot-toast": "^2.4.0",
    "lucide-react": "^0.263.1",
    "react-icons": "^4.8.0",
    "date-fns": "^2.29.3",
    "react-datepicker": "^4.10.0",
    "react-select": "^5.7.0",
    "react-modal": "^3.16.1",
    "react-tooltip": "^5.7.4",
    "react-loading-skeleton": "^3.1.1",
    "react-intersection-observer": "^9.4.3",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF

echo "🚀 Deploying frontend to Vercel..."

# Deploy frontend
vercel --prod

# Get the frontend URL
FRONTEND_URL=$(vercel ls | grep -o 'https://[^ ]*' | tail -1)
echo "✅ Frontend deployed to: $FRONTEND_URL"

cd ..

echo ""
echo "🎉 CarbonEmission Pro is now live on Vercel!"
echo "🌐 Frontend URL: $FRONTEND_URL"
echo "🔧 Backend URL: $BACKEND_URL"
echo ""
echo "📋 Next steps:"
echo "1. Update MongoDB Atlas connection string in Vercel dashboard"
echo "2. Set environment variables in Vercel dashboard"
echo "3. Run database seeding: vercel run node scripts/seedData.js"
echo ""
echo "🔑 Demo credentials:"
echo "   Admin: john@example.com / password123"
echo "   Manager: sarah@example.com / password123"
echo "   Analyst: mike@example.com / password123"
echo ""
echo "🏆 Ready for your hackathon presentation!"
