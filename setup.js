#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up CarbonEmission Pro...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/carbon-emissions
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OPENAI_API_KEY=your-openai-api-key-here
CLIENT_URL=http://localhost:3000

# Email configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# External APIs (optional)
WEATHER_API_KEY=your-weather-api-key
CARBON_INTENSITY_API_KEY=your-carbon-intensity-api-key
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with default configuration');
} else {
  console.log('✅ .env file already exists');
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies:', error.message);
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('cd client && npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies:', error.message);
  process.exit(1);
}

// Create data directory for CSV files
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log('✅ Created data directory');
}

// Copy CSV files to data directory
const csvFiles = [
  'Carbon_(CO2)_Emissions_by_Country.csv',
  'carbon-monitor-GLOBAL-maingraphdatas.csv',
  'co2.csv',
  'Copy of dataset_combined_final.csv',
  'emissions_by_unit_and_fuel_type_c_d_aa.csv'
];

csvFiles.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const destPath = path.join(dataDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file} to data directory`);
  }
});

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Update the .env file with your actual API keys');
console.log('2. Make sure MongoDB is running on your system');
console.log('3. Start the development servers:');
console.log('   - Backend: npm run dev');
console.log('   - Frontend: npm run client');
console.log('   - Both: npm run dev-full');
console.log('\n🌐 Application will be available at:');
console.log('   - Frontend: http://localhost:3000');
console.log('   - Backend API: http://localhost:5000');
console.log('\n📚 For more information, check the README.md file');
console.log('\n🏆 Good luck with your hackathon! 🚀');
