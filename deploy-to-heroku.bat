@echo off
echo 🚀 Deploying CarbonEmission Pro to Heroku...
echo ==============================================

REM Check if Heroku CLI is installed
heroku --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Heroku CLI is not installed.
    echo.
    echo 📥 Please install Heroku CLI first:
    echo    1. Go to: https://devcenter.heroku.com/articles/heroku-cli
    echo    2. Download the Windows installer
    echo    3. Run the installer
    echo    4. Restart your terminal
    echo.
    echo After installing, run this script again.
    pause
    exit /b 1
)

echo ✅ Heroku CLI is installed

REM Check if user is logged in
heroku auth:whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Heroku first:
    heroku login
    if %errorlevel% neq 0 (
        echo ❌ Login failed. Please try again.
        pause
        exit /b 1
    )
)

echo ✅ Logged in to Heroku

REM Get app name from user
set /p APP_NAME="Enter Heroku app name (or press Enter for 'carbon-emission-pro'): "
if "%APP_NAME%"=="" set APP_NAME=carbon-emission-pro

echo 📦 Creating Heroku app: %APP_NAME%

REM Create Heroku app
heroku create %APP_NAME%
if %errorlevel% neq 0 (
    echo ❌ Failed to create Heroku app. The name might already be taken.
    echo Please try a different name.
    pause
    exit /b 1
)

echo ✅ Heroku app created

REM Add MongoDB addon
echo 🗄️ Adding MongoDB addon...
heroku addons:create mongolab:sandbox -a %APP_NAME%
if %errorlevel% neq 0 (
    echo ⚠️ Failed to add MongoDB addon. You can add it manually later.
)

REM Set environment variables
echo ⚙️ Setting environment variables...
heroku config:set NODE_ENV=production -a %APP_NAME%
heroku config:set JWT_SECRET=your-super-secret-jwt-key-for-production-%RANDOM% -a %APP_NAME%
heroku config:set CLIENT_URL=https://%APP_NAME%.herokuapp.com -a %APP_NAME%

REM Ask for OpenAI API key
set /p OPENAI_KEY="Enter your OpenAI API key (or press Enter to skip): "
if not "%OPENAI_KEY%"=="" (
    heroku config:set OPENAI_API_KEY=%OPENAI_KEY% -a %APP_NAME%
    echo ✅ OpenAI API key set
) else (
    echo ⚠️ OpenAI API key not set. Chatbot features will be limited.
)

REM Initialize git if not already done
if not exist .git (
    echo 📁 Initializing git repository...
    git init
    git config user.name "CarbonEmission Pro"
    git config user.email "admin@carbonemissionpro.com"
)

REM Add all files to git
echo 📤 Adding files to git...
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "Deploy CarbonEmission Pro to Heroku"

REM Deploy to Heroku
echo 🚀 Deploying to Heroku...
git push heroku main
if %errorlevel% neq 0 (
    echo ❌ Deployment failed. Check the error messages above.
    echo.
    echo Common solutions:
    echo 1. Make sure you have a Procfile
    echo 2. Check that package.json has correct scripts
    echo 3. Ensure all dependencies are listed
    pause
    exit /b 1
)

REM Wait for deployment to complete
echo ⏳ Waiting for deployment to complete...
timeout /t 15 /nobreak >nul

REM Check if deployment was successful
heroku ps -a %APP_NAME% | findstr "web.1.*up" >nul
if %errorlevel% equ 0 (
    echo ✅ Deployment successful!
    
    REM Seed database
    echo 🌱 Seeding database with sample data...
    heroku run node scripts/seedData.js -a %APP_NAME%
    
    echo.
    echo 🎉 CarbonEmission Pro is now live!
    echo 🌐 App URL: https://%APP_NAME%.herokuapp.com
    echo.
    echo 🔑 Demo credentials:
    echo    Admin: john@example.com / password123
    echo    Manager: sarah@example.com / password123
    echo    Analyst: mike@example.com / password123
    echo.
    echo 📊 Features available:
    echo    ✅ Real-time emissions monitoring
    echo    ✅ AI-powered optimization
    echo    ✅ Cost reduction analysis
    echo    ✅ AI chatbot assistant
    echo    ✅ Carbon capture recommendations
    echo.
    echo 🏆 Ready for your hackathon presentation!
    
    REM Ask to open the app
    set /p OPEN_APP="Open the app in browser? (y/n): "
    if /i "%OPEN_APP%"=="y" (
        start https://%APP_NAME%.herokuapp.com
    )
    
) else (
    echo ❌ Deployment failed. Check the logs:
    heroku logs --tail -a %APP_NAME%
    echo.
    echo Common issues:
    echo 1. Build failed - check package.json
    echo 2. Database connection failed - check MongoDB addon
    echo 3. Port binding failed - check Procfile
)

echo.
echo 📋 Next steps:
echo 1. Test your app at: https://%APP_NAME%.herokuapp.com
echo 2. Check logs with: heroku logs --tail -a %APP_NAME%
echo 3. Scale dynos if needed: heroku ps:scale web=1 -a %APP_NAME%
echo.
pause
