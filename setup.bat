@echo off
echo 🚀 Setting up CarbonEmission Pro...
echo.

REM Check Node.js version
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Create .env file if it doesn't exist
if not exist .env (
    echo NODE_ENV=development > .env
    echo PORT=5000 >> .env
    echo MONGODB_URI=mongodb://localhost:27017/carbon-emissions >> .env
    echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production >> .env
    echo OPENAI_API_KEY=your-openai-api-key-here >> .env
    echo CLIENT_URL=http://localhost:3000 >> .env
    echo. >> .env
    echo # Email configuration (optional) >> .env
    echo EMAIL_HOST=smtp.gmail.com >> .env
    echo EMAIL_PORT=587 >> .env
    echo EMAIL_USER=your-email@gmail.com >> .env
    echo EMAIL_PASS=your-app-password >> .env
    echo. >> .env
    echo # External APIs (optional) >> .env
    echo WEATHER_API_KEY=your-weather-api-key >> .env
    echo CARBON_INTENSITY_API_KEY=your-carbon-intensity-api-key >> .env
    echo ✅ Created .env file with default configuration
) else (
    echo ✅ .env file already exists
)

REM Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo ✅ Frontend dependencies installed

REM Create data directory
if not exist data mkdir data
echo ✅ Created data directory

REM Copy CSV files to data directory
if exist "Carbon_(CO2)_Emissions_by_Country.csv" (
    copy "Carbon_(CO2)_Emissions_by_Country.csv" data\
    echo ✅ Copied Carbon_(CO2)_Emissions_by_Country.csv
)
if exist "carbon-monitor-GLOBAL-maingraphdatas.csv" (
    copy "carbon-monitor-GLOBAL-maingraphdatas.csv" data\
    echo ✅ Copied carbon-monitor-GLOBAL-maingraphdatas.csv
)
if exist "co2.csv" (
    copy "co2.csv" data\
    echo ✅ Copied co2.csv
)
if exist "Copy of dataset_combined_final.csv" (
    copy "Copy of dataset_combined_final.csv" data\
    echo ✅ Copied Copy of dataset_combined_final.csv
)
if exist "emissions_by_unit_and_fuel_type_c_d_aa.csv" (
    copy "emissions_by_unit_and_fuel_type_c_d_aa.csv" data\
    echo ✅ Copied emissions_by_unit_and_fuel_type_c_d_aa.csv
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Update the .env file with your actual API keys
echo 2. Make sure MongoDB is running on your system
echo 3. Start the development servers:
echo    - Backend: npm run dev
echo    - Frontend: npm run client
echo    - Both: npm run dev-full
echo.
echo 🌐 Application will be available at:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:5000
echo.
echo 📚 For more information, check the README.md file
echo.
echo 🏆 Good luck with your hackathon! 🚀
pause
