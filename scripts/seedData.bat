@echo off
echo 🌱 Seeding database with sample data...
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if MongoDB is running
mongo --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB might not be installed or running. Please ensure MongoDB is running.
    echo    You can start MongoDB with: mongod
    echo.
)

REM Run the seed script
node scripts/seedData.js

if %errorlevel% equ 0 (
    echo.
    echo ✅ Database seeding completed successfully!
    echo.
    echo 🔑 You can now login with these credentials:
    echo    Admin: john@example.com / password123
    echo    Manager: sarah@example.com / password123
    echo    Analyst: mike@example.com / password123
    echo.
    echo 🚀 Start the application with: npm run dev-full
) else (
    echo ❌ Database seeding failed. Please check the error messages above.
)

pause
