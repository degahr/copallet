#!/bin/bash

# CoPallet Deployment Script for Render
# This script helps prepare the application for deployment

echo "🚀 CoPallet Deployment Preparation Script"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Create environment files if they don't exist
echo "📝 Creating environment files..."

# Backend environment file
if [ ! -f "backend/.env" ]; then
    cat > backend/.env << EOF
# Production Environment Configuration
NODE_ENV=production
PORT=3001

# JWT Secrets (Generate strong random strings)
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration (Update with your frontend URL)
CORS_ORIGIN=https://copallet-web.onrender.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    echo "✅ Created backend/.env"
else
    echo "⚠️  backend/.env already exists, skipping..."
fi

# Frontend environment file
if [ ! -f ".env" ]; then
    cat > .env << EOF
# Frontend Environment Configuration
VITE_API_URL=https://copallet-w9do.onrender.com
VITE_APP_NAME=CoPallet
VITE_APP_VERSION=1.0.0
EOF
    echo "✅ Created .env"
else
    echo "⚠️  .env already exists, skipping..."
fi

# Check if backend builds successfully
echo "🔨 Testing backend build..."
cd backend
if npm run build; then
    echo "✅ Backend builds successfully"
else
    echo "❌ Backend build failed"
    exit 1
fi
cd ..

# Check if frontend builds successfully
echo "🔨 Testing frontend build..."
if npm run build; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Create a Render account at https://render.com"
echo "3. Follow the deployment guide in README.md"
echo ""
echo "🔧 Environment variables generated:"
echo "- JWT_SECRET: $(grep JWT_SECRET backend/.env | cut -d'=' -f2)"
echo "- JWT_REFRESH_SECRET: $(grep JWT_REFRESH_SECRET backend/.env | cut -d'=' -f2)"
echo ""
echo "⚠️  Remember to:"
echo "- Update CORS_ORIGIN in backend/.env with your frontend URL"
echo "- Update VITE_API_URL in .env with your backend URL"
echo "- Keep your JWT secrets secure!"
