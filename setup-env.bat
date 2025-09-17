@echo off
REM CoPallet Environment Setup Script for Windows

echo 🚀 Setting up CoPallet environment files...

REM Create frontend environment file
if not exist ".env.local" (
    echo 📝 Creating frontend .env.local file...
    copy env.example .env.local
    echo ✅ Frontend environment file created: .env.local
    echo    Edit this file to customize your API URL if needed
) else (
    echo ⚠️  Frontend .env.local already exists, skipping...
)

REM Create backend environment file
if not exist "backend\.env" (
    echo 📝 Creating backend .env file...
    copy backend\env.example backend\.env
    echo ✅ Backend environment file created: backend\.env
    echo    Edit this file to customize backend settings if needed
) else (
    echo ⚠️  Backend .env already exists, skipping...
)

echo.
echo 🎉 Environment setup complete!
echo.
echo Next steps:
echo 1. Start the backend: cd backend ^&^& npm run dev
echo 2. Start the frontend: npm run dev
echo 3. Visit http://localhost:5173 to see the application
echo.
echo Default credentials:
echo   Admin: admin@copallet.com / admin123
echo   Shipper: shipper@example.com / admin123
echo   Carrier: carrier@example.com / admin123

pause
