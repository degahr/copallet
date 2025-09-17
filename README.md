# CoPallet - Logistics SaaS Platform

A complete freight marketplace platform connecting shippers with carriers for pallet transportation across Europe.

## 🚀 MVP Features (100% Complete)

### ✅ Core Platform
- **User Authentication**: Signup, login, role-based access (Shipper/Carrier/Dispatcher/Admin)
- **Shipment Management**: Create, list, track, and manage pallet shipments
- **Marketplace**: Browse loads, place bids, accept/reject offers
- **Live Tracking**: Real-time GPS tracking with ETA updates
- **Proof of Delivery**: Photo + signature capture
- **Messaging System**: Real-time chat per shipment
- **Notification Center**: In-app notifications for all events

### ✅ Advanced Features
- **ROI Calculator**: Real-time profit/ROI calculations for carriers
- **Carrier Verification**: Document upload and admin approval workflow
- **Admin Panel**: User management and verification oversight
- **Shipment Analytics**: Dashboard and reporting
- **Rating System**: Carrier/shipper rating and reviews
- **Shipment Templates**: Reusable configurations for shippers
- **Auto-Bid Rules**: Automated bidding for carriers
- **Cost Model**: Personalized carrier cost calculations

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Context API** for state management
- **Lucide React** for icons

### Backend (Express + TypeScript)
- **Express.js** with TypeScript
- **In-memory database** for development/testing (ready for PostgreSQL)
- **JWT** authentication with refresh tokens
- **Zod** for schema validation
- **CORS** enabled for frontend connections
- **Structured logging** with Pino
- **Rate limiting** and security middleware
- **Mock data seeding** for immediate testing

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20.19+ or 22.12+ (Vite requirement)
- **npm** or **yarn** package manager

### Environment Setup

**Option 1: Automatic Setup (Recommended)**
```bash
# Run the setup script
./setup-env.sh        # Linux/Mac
# or
setup-env.bat         # Windows
```

**Option 2: Manual Setup**
1. **Frontend Environment Variables**
   ```bash
   # Copy the example environment file
   cp env.example .env.local
   
   # Edit .env.local and set your API URL
   VITE_API_URL=http://localhost:3001/api
   ```

2. **Backend Environment Variables**
   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env
   
   # Edit backend/.env if needed (defaults work for local development)
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

### Step 1: Clone and Install Dependencies

   ```bash
# Clone the repository
git clone <repository>
cd logistics-saas-platform

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
   npm install
cd ..
```

### Step 2: Start the Backend Server

```bash
# Navigate to backend directory
cd backend

# Start the backend development server
npm run dev

# The backend will start on http://localhost:3001
# You'll see logs showing:
# 🚀 CoPallet Backend running on port 3001
# 📊 Environment: development
# 🌐 Health check: http://localhost:3001/health
# 🧪 Test endpoint: http://localhost:3001/api/test
```

**Backend Features:**
- ✅ **In-memory database** with pre-seeded mock data
- ✅ **JWT authentication** with sample users
- ✅ **CORS enabled** for frontend connections
- ✅ **All API endpoints** ready for testing

### Step 3: Start the Frontend Server

   ```bash
# In a new terminal, navigate to project root
cd /Users/degar/logistics-saas-platform

# Start the frontend development server
   npm run dev

# The frontend will start on http://localhost:5173 (or next available port)
# You'll see: VITE v7.1.5 ready in XXX ms
# ➜ Local: http://localhost:5173/
```

### Step 4: Access the Application

1. **Open your browser** and go to `http://localhost:5173`
2. **Login with sample accounts:**
   - **Admin**: `admin@copallet.com` / `admin123`
   - **Shipper 1**: `shipper@example.com` / `admin123`
   - **Shipper 2**: `logistics@company.com` / `admin123`
   - **Carrier 1**: `carrier@example.com` / `admin123`
   - **Carrier 2**: `fleet@transport.com` / `admin123`
   - **Carrier 3 (Pending)**: `driver@freight.com` / `admin123`

### Step 5: Verify Everything Works

1. **Check API Connection**: The dashboard shows backend connection status
2. **Test Authentication**: Login with any sample account
3. **Browse Features**: Navigate through shipments, marketplace, etc.
4. **Test API Endpoints**: Visit `/api-test` page for API testing

## 📊 Mock Data Included

The backend automatically seeds the database with:

### Sample Users
- **Admin User**: `admin@copallet.com` (Full access)
- **Shipper User 1**: `shipper@example.com` (Can create shipments)
- **Shipper User 2**: `logistics@company.com` (Additional shipper for testing)
- **Carrier User 1**: `carrier@example.com` (Can bid on shipments)
- **Carrier User 2**: `fleet@transport.com` (Additional carrier for testing)
- **Carrier User 3**: `driver@freight.com` (Pending verification - for admin testing)

### Comprehensive Sample Data
- ✅ **6 Users** with different roles and verification statuses
- ✅ **6 Sample Shipments** with various statuses (open, assigned, in-transit, delivered)
- ✅ **11 Bids** including accepted, pending, and declined bids
- ✅ **6 Messages** showing real conversations between shippers and carriers
- ✅ **5 Notifications** for different user actions and events
- ✅ **3 Tracking Points** for in-transit shipments with GPS coordinates
- ✅ **1 POD (Proof of Delivery)** with photo and signature for completed shipment
- ✅ **2 Ratings & Reviews** showing mutual feedback between users
- ✅ **2 Shipment Templates** for quick shipment creation
- ✅ **3 Auto-Bid Rules** for automated carrier bidding
- ✅ **3 Carrier Cost Models** with different pricing strategies
- ✅ **Cross-border Routes** (Netherlands, Germany, Belgium, Austria, Italy, Switzerland)
- ✅ **Different Shipment Types** (Electronics, dangerous goods, temperature-controlled, chemicals)
- ✅ **Pre-configured** for immediate testing of all features

### Available Features to Test
- 🔐 **Authentication** (Login/Signup)
- 📦 **Shipment Management** (Create, List, Detail)
- 🏪 **Marketplace** (Browse, Bid, Accept)
- 📍 **Live Tracking** (Mock GPS updates)
- 💬 **Messaging** (Per-shipment chat)
- 📸 **POD Capture** (Photo + Signature)
- 🔔 **Notifications** (In-app notification center)
- 📊 **Analytics** (Shipment reporting)
- ⭐ **Rating System** (Carrier reviews)
- 🏢 **Admin Panel** (User management)
- 🤖 **Auto-Bid Rules** (Automated bidding)
- 📋 **Templates** (Reusable shipment configs)
- 💰 **Cost Model** (ROI calculations)
- ✅ **Verification** (Document upload)

## 🔧 Development Commands

### Frontend Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Commands
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
```

### Stopping Services
```bash
# Stop all processes (run from project root)
pkill -f "vite"      # Stop all frontend servers
pkill -f "tsx"       # Stop all backend servers
pkill -f "nodemon"   # Stop nodemon processes
```

## 🌐 API Endpoints

### Health & Testing
- `GET /health` - Backend health check
- `GET /api/test` - API test endpoint

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh tokens
- `GET /api/auth/me` - Get current user

### Shipments
- `GET /api/shipments` - List shipments
- `POST /api/shipments` - Create shipment
- `GET /api/shipments/:id` - Get shipment details
- `PUT /api/shipments/:id` - Update shipment
- `POST /api/shipments/:id/bids` - Place bid
- `PUT /api/shipments/:id/bids/:bidId/accept` - Accept bid

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/upload-document` - Upload documents

### Admin
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/verify` - Update verification status
- `GET /api/admin/stats` - Platform statistics

## 🔍 Checking Backend Status

### Quick Backend Health Check
```bash
# Test if backend is responding
curl http://localhost:3001/health

# Test API endpoint
curl http://localhost:3001/api/test
```

### Check Running Processes
```bash
# Check if backend processes are running
ps aux | grep tsx
ps aux | grep nodemon

# Check if port 3001 is in use
lsof -i :3001
netstat -an | grep 3001
```

### Backend Status Indicators
**✅ Backend Running Successfully:**
- You see: `🚀 CoPallet Backend running on port 3001`
- Health check returns: `{"status":"OK","message":"CoPallet Backend is running! 🚀"}`
- API test returns: `{"message":"CoPallet API is working!"}`

**❌ Backend Not Running:**
- `curl: (7) Failed to connect to localhost port 3001`
- No processes found with `ps aux | grep tsx`
- Port 3001 not in use with `lsof -i :3001`

## 🚀 Production Deployment on Render

This guide will help you deploy both the frontend and backend to Render.com, a modern cloud platform that makes deployment simple.

### Prerequisites
- GitHub repository with your code
- Render.com account (free tier available)
- Basic understanding of environment variables

### Step 1: Prepare Your Repository

#### 1.1 Create Environment Files
Create these files in your repository:

**Backend Environment File** (`backend/.env`):
```bash
# Production Environment Configuration
NODE_ENV=production
PORT=3001

# JWT Secrets (Generate strong random strings)
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration (Update with your frontend URL)
CORS_ORIGIN=https://your-frontend-app.onrender.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend Environment File** (`.env`):
```bash
# Frontend Environment Configuration
VITE_API_URL=https://your-backend-app.onrender.com
VITE_APP_NAME=CoPallet
VITE_APP_VERSION=1.0.0
```

#### 1.2 Update Backend CORS Configuration
Update `backend/src/index.ts` to include your production frontend URL:

```typescript
// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://your-frontend-app.onrender.com' // Add your production URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
```

#### 1.3 Update Frontend API Configuration
Update `src/services/api.ts` to use environment variables:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiService = {
  // ... existing code
  baseURL: API_BASE_URL,
  // ... rest of the service
};
```

### Step 2: Deploy Backend to Render

#### 2.1 Create Backend Service
1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect Repository**: Link your GitHub repository
4. **Configure Service**:
   - **Name**: `copallet-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: `20` (or latest)

#### 2.2 Set Environment Variables
In the Render dashboard, go to **Environment** tab and add:

```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-app.onrender.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 2.3 Deploy Backend
1. **Click "Create Web Service"**
2. **Wait for deployment** (5-10 minutes)
3. **Note the URL**: `https://copallet-backend.onrender.com`

### Step 3: Deploy Frontend to Render

#### 3.1 Create Frontend Service
1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Static Site"**
3. **Connect Repository**: Link your GitHub repository
4. **Configure Service**:
   - **Name**: `copallet-frontend`
   - **Root Directory**: `/` (root)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

#### 3.2 Set Environment Variables
In the Render dashboard, go to **Environment** tab and add:

```bash
VITE_API_URL=https://copallet-backend.onrender.com
VITE_APP_NAME=CoPallet
VITE_APP_VERSION=1.0.0
```

#### 3.3 Deploy Frontend
1. **Click "Create Static Site"**
2. **Wait for deployment** (3-5 minutes)
3. **Note the URL**: `https://copallet-frontend.onrender.com`

### Step 4: Update CORS Configuration

#### 4.1 Update Backend CORS
After both services are deployed, update the backend CORS configuration:

1. **Go to Backend Service** → **Environment**
2. **Update CORS_ORIGIN**: `https://copallet-frontend.onrender.com`
3. **Redeploy** the backend service

#### 4.2 Alternative: Use Wildcard CORS (Less Secure)
For easier setup, you can temporarily use wildcard CORS:

```bash
CORS_ORIGIN=*
```

**⚠️ Warning**: This is less secure and should only be used for testing.

### Step 5: Test Your Deployment

#### 5.1 Test Backend
```bash
# Test backend health
curl https://copallet-backend.onrender.com/health

# Test API endpoint
curl https://copallet-backend.onrender.com/api/test
```

#### 5.2 Test Frontend
1. **Visit**: `https://copallet-frontend.onrender.com`
2. **Check browser console** for any errors
3. **Test login** with sample accounts
4. **Verify API calls** are working

### Step 6: Configure Custom Domains (Optional)

#### 6.1 Add Custom Domain
1. **Go to Service Settings** → **Custom Domains**
2. **Add your domain**: `api.yourdomain.com` (backend)
3. **Add your domain**: `app.yourdomain.com` (frontend)
4. **Update DNS records** as instructed by Render

#### 6.2 Update Environment Variables
After adding custom domains, update:

**Backend**:
```bash
CORS_ORIGIN=https://app.yourdomain.com
```

**Frontend**:
```bash
VITE_API_URL=https://api.yourdomain.com
```

### Step 7: Production Optimizations

#### 7.1 Enable HTTPS
- Render automatically provides HTTPS
- Custom domains also get HTTPS certificates

#### 7.2 Configure Auto-Deploy
1. **Go to Service Settings** → **Build & Deploy**
2. **Enable Auto-Deploy**: Deploy on every push to main branch
3. **Set Branch**: `main` or `master`

#### 7.3 Set Up Monitoring
1. **Go to Service Settings** → **Monitoring**
2. **Enable Health Checks**: Monitor service uptime
3. **Set up Alerts**: Get notified of issues

### Step 8: Database Setup (Future Enhancement)

#### 8.1 Add PostgreSQL Database
1. **Go to Render Dashboard** → **New +** → **PostgreSQL**
2. **Configure Database**:
   - **Name**: `copallet-db`
   - **Database**: `copallet`
   - **User**: `copallet_user`
3. **Note the connection string**

#### 8.2 Update Backend for Database
```bash
# Add to backend environment variables
DATABASE_URL=postgresql://copallet_user:password@dpg-xxx.onrender.com:5432/copallet_db
```

### Troubleshooting Deployment Issues

#### Common Issues and Solutions

**1. Build Failures**
```bash
# Check build logs in Render dashboard
# Common fixes:
- Update Node.js version
- Check package.json scripts
- Verify all dependencies are in dependencies (not devDependencies)
```

**2. CORS Errors**
```bash
# Symptoms: Frontend can't connect to backend
# Solution: Update CORS_ORIGIN environment variable
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

**3. Environment Variables Not Loading**
```bash
# Check environment variables are set correctly
# Redeploy after changing environment variables
```

**4. Service Timeouts**
```bash
# Render free tier has limitations:
- Services sleep after 15 minutes of inactivity
- First request after sleep takes 30+ seconds
# Solution: Upgrade to paid plan or implement keep-alive
```

**5. Memory Issues**
```bash
# Free tier has 512MB RAM limit
# Solution: Optimize build or upgrade plan
```

### Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] Custom domains configured (optional)
- [ ] Auto-deploy enabled
- [ ] Health checks configured
- [ ] Monitoring set up
- [ ] Database connected (future)

### Cost Estimation

**Render Free Tier**:
- Backend: Free (with limitations)
- Frontend: Free
- Database: Free (with limitations)

**Render Paid Plans**:
- Starter: $7/month per service
- Standard: $25/month per service
- Pro: $85/month per service

### Next Steps

1. **Monitor Performance**: Use Render's built-in monitoring
2. **Set Up CI/CD**: Configure automatic deployments
3. **Add Database**: Migrate from in-memory to PostgreSQL
4. **Implement Caching**: Add Redis for better performance
5. **Add CDN**: Use Cloudflare for faster global delivery
6. **Set Up Logging**: Implement structured logging
7. **Add Monitoring**: Use services like Sentry for error tracking

## 🐳 Alternative Deployment Options

### Docker Deployment

#### Frontend Docker Setup
```bash
# Build frontend Docker image
docker build -f Dockerfile.frontend -t copallet-frontend .

# Run frontend container
docker run -p 80:80 copallet-frontend
```

#### Backend Docker Setup
```bash
# Build backend Docker image
docker build -f backend/Dockerfile -t copallet-backend .

# Run backend container
docker run -p 3001:3001 -e NODE_ENV=production copallet-backend
```

### Other Cloud Platforms

#### Vercel (Frontend)
1. **Connect GitHub**: Link your repository
2. **Configure Build**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Set Environment Variables**:
   - `VITE_API_URL`: Your backend URL
4. **Deploy**: Automatic deployment on push

#### Railway (Full Stack)
1. **Connect GitHub**: Link your repository
2. **Add Services**:
   - Backend service (Node.js)
   - Frontend service (Static site)
3. **Configure Environment**: Set all required variables
4. **Deploy**: Automatic deployment

#### Netlify (Frontend)
1. **Connect GitHub**: Link your repository
2. **Configure Build**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. **Set Environment Variables**: Add API URL
4. **Deploy**: Automatic deployment

### Quick Deployment Script

Use the included deployment script to prepare your application:

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment preparation
./deploy.sh
```

This script will:
- ✅ Verify project structure
- ✅ Create environment files with secure JWT secrets
- ✅ Test backend and frontend builds
- ✅ Generate deployment checklist

## 📋 Quick Reference

### Essential Commands
```bash
# Development
npm run dev                    # Start frontend
cd backend && npm run dev     # Start backend

# Production Build
npm run build                 # Build frontend
cd backend && npm run build   # Build backend

# Deployment Preparation
./deploy.sh                   # Prepare for deployment

# Testing
curl http://localhost:3001/health    # Test backend
curl http://localhost:3001/api/test  # Test API
```

### Sample Login Credentials
- **Admin**: `admin@copallet.com` / `admin123`
- **Shipper**: `shipper@example.com` / `admin123`
- **Carrier**: `carrier@example.com` / `admin123`

### Key URLs (Development)
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Test**: http://localhost:3001/api/test

### Key URLs (Production)
- **Frontend**: https://your-frontend.onrender.com
- **Backend**: https://your-backend.onrender.com
- **Health Check**: https://your-backend.onrender.com/health
- **API Test**: https://your-backend.onrender.com/api/test

## 🚨 Troubleshooting

### Port Already in Use
If you get "Port already in use" errors:
```bash
# Kill all processes and restart
pkill -f "vite"      # Stop all frontend servers
pkill -f "tsx"       # Stop all backend servers
pkill -f "nodemon"   # Stop nodemon processes
# Then restart with npm run dev
```

### CORS Errors
The backend is configured to allow multiple frontend ports (5173-5177). If you encounter CORS issues:
1. Check that backend is running on port 3001
2. Verify frontend is connecting to `http://localhost:3001`
3. Check browser console for specific error messages

### Node.js Version Warning
If you see "Vite requires Node.js version 20.19+":
- The app will still work with Node.js 20.17.0
- Consider upgrading to Node.js 20.19+ or 22.12+ for optimal performance

### API Connection Issues
1. **Check backend status**: Visit `http://localhost:3001/health`
2. **Check frontend API calls**: Open browser DevTools → Network tab
3. **Verify CORS**: Backend logs will show CORS errors if any

## 👥 User Flows & How to Use Features

### 🔐 Authentication Flow

#### **New User Registration**
1. **Go to**: `http://localhost:5173/signup`
2. **Fill out form**:
   - Email: `your-email@example.com`
   - Password: `your-password`
   - Role: Select `Shipper`, `Carrier`, or `Dispatcher`
3. **Click "Create Account"**
4. **Complete onboarding** (if prompted)
5. **You're logged in!** Dashboard appears

#### **Existing User Login**
1. **Go to**: `http://localhost:5173/login`
2. **Use sample credentials**:
   - Admin: `admin@copallet.com` / `admin123`
   - Shipper 1: `shipper@example.com` / `admin123`
   - Shipper 2: `logistics@company.com` / `admin123`
   - Carrier 1: `carrier@example.com` / `admin123`
   - Carrier 2: `fleet@transport.com` / `admin123`
   - Carrier 3 (Pending): `driver@freight.com` / `admin123`
3. **Click "Sign In"**
4. **Dashboard loads** with role-specific features

### 📦 Shipper Workflows

#### **Create a New Shipment**
1. **Login as Shipper**: `shipper@example.com` / `admin123` OR `logistics@company.com` / `admin123`
2. **Navigate to**: Dashboard → "Create New Shipment" OR `/shipments/create`
3. **Fill shipment details**:
   - **From Address**: Pickup location (street, city, postal code)
   - **To Address**: Delivery location
   - **Pickup Window**: When carrier can collect
   - **Delivery Window**: When goods must arrive
   - **Pallets**: Quantity, dimensions, weight
   - **Requirements**: Tail lift, forklift, indoor delivery
   - **Price Guidance**: Min/max you're willing to pay
4. **Click "Create Shipment"**
5. **Shipment appears** in marketplace for carriers to bid

#### **Review and Accept Bids**
1. **Go to**: `/shipments` (Your Shipments)
2. **Click on a shipment** to view details
3. **View bids** in the "Bids" section
4. **Compare offers**:
   - Price offered
   - ETA for pickup
   - Carrier message
5. **Accept a bid**: Click "Accept Bid" button
6. **Shipment status** changes to "Accepted"
7. **Carrier gets notified** automatically

#### **Track Shipment Progress**
1. **Go to**: `/shipments` → Click on accepted shipment
2. **View live tracking**:
   - Current location (mock GPS)
   - ETA updates
   - Status changes
3. **Communicate**: Use messaging system to chat with carrier
4. **Monitor delivery**: Watch for POD (Proof of Delivery) upload

#### **Use Shipment Templates**
1. **Go to**: `/templates`
2. **Create template**:
   - Fill out common shipment details
   - Save as reusable template
3. **Use template**:
   - Click "Create from Template"
   - Modify specific details
   - Submit as new shipment

### 🚛 Carrier Workflows

#### **Browse Available Loads**
1. **Login as Carrier**: `carrier@example.com` / `admin123` OR `fleet@transport.com` / `admin123`
2. **Go to**: `/marketplace`
3. **Filter shipments**:
   - By location (from/to cities)
   - By pickup date
   - By pallet requirements
   - By price range
4. **View shipment details**: Click on any shipment
5. **Check requirements**: Ensure you can meet all constraints

#### **Place a Bid**
1. **From marketplace**: Click on desired shipment
2. **Click "Place Bid"**
3. **Fill bid details**:
   - **Your Price**: What you'll charge
   - **ETA Pickup**: When you can collect
   - **Message**: Any notes for shipper
4. **Submit bid**
5. **Wait for response** from shipper

#### **Manage Accepted Shipments**
1. **Go to**: `/shipments` (Your Accepted Shipments)
2. **View shipment details**:
   - Pickup/delivery addresses
   - Time windows
   - Special requirements
3. **Update tracking**:
   - Add GPS coordinates
   - Update ETA
   - Change status (Picked Up → In Transit → Delivered)
4. **Communicate**: Use messaging to coordinate with shipper

#### **Upload Proof of Delivery**
1. **When delivering**: Go to `/pod/{shipment-id}`
2. **Take delivery photo**: Upload image of delivered goods
3. **Get signature**: Capture recipient signature
4. **Add delivery notes**: Any special circumstances
5. **Submit POD**: Complete delivery confirmation
6. **Shipment marked complete**

#### **Set Up Auto-Bid Rules**
1. **Go to**: `/autobid`
2. **Create rule**:
   - **Route**: From/to locations
   - **Max Price**: Your maximum bid
   - **Min Profit**: Minimum profit margin
   - **Requirements**: What shipments you can handle
3. **Activate rule**: System auto-bids on matching shipments
4. **Monitor**: Check auto-bid activity and results

### 👨‍💼 Admin Workflows

#### **Manage User Verifications**
1. **Login as Admin**: `admin@copallet.com` / `admin123`
2. **Go to**: `/admin`
3. **View pending verifications**:
   - New carrier registrations
   - Document uploads
4. **Review documents**:
   - Driver licenses
   - Insurance certificates
   - Vehicle registrations
5. **Approve/Reject**:
   - Click "Approve" for verified users
   - Click "Reject" with reason for issues
6. **Users get notified** of verification status

#### **Monitor Platform Activity**
1. **Go to**: `/admin`
2. **View platform stats**:
   - Total users by role
   - Active shipments
   - Completed deliveries
   - Revenue metrics
3. **Check user activity**:
   - Recent registrations
   - Verification requests
   - Reported issues

### 💬 Communication Features

#### **Shipment Messaging**
1. **From any shipment**: Click "Messages" button
2. **View conversation history**
3. **Send messages**:
   - Type your message
   - Click "Send"
4. **Real-time updates**: Messages appear instantly
5. **Notifications**: Get notified of new messages

#### **Notification Center**
1. **Click bell icon** in header
2. **View notifications**:
   - New bids received
   - Bid accepted/rejected
   - Shipment status changes
   - Messages received
3. **Mark as read**: Click on notifications
4. **Clear all**: Remove old notifications

### 📊 Analytics & Reporting

#### **View Shipment Analytics**
1. **Go to**: `/analytics`
2. **Select time period**: Last week, month, quarter
3. **View metrics**:
   - Shipments completed
   - Average delivery time
   - Revenue generated
   - Carrier performance
4. **Export reports**: Download data as CSV

#### **Rate Carriers/Shippers**
1. **After shipment completion**: Go to `/rating`
2. **Select shipment** to rate
3. **Rate performance**:
   - Communication (1-5 stars)
   - Punctuality (1-5 stars)
   - Care of goods (1-5 stars)
   - Overall experience
4. **Add written review**
5. **Submit rating**: Helps other users make decisions

### 🔧 Advanced Features

#### **ROI Calculator**
1. **Go to**: `/profile` → "ROI Calculator"
2. **Input costs**:
   - Fuel costs
   - Driver wages
   - Vehicle maintenance
   - Insurance
3. **Calculate profit** for potential shipments
4. **Set minimum margins** for bidding

#### **Cost Model Setup**
1. **Go to**: `/costmodel`
2. **Configure rates**:
   - Per kilometer rates
   - Per pallet rates
   - Time-based charges
   - Special service fees
3. **Save model**: Use for automatic pricing

#### **Document Verification (Carriers)**
1. **Go to**: `/verification`
2. **Upload documents**:
   - Driver license
   - Insurance certificate
   - Vehicle registration
   - Company registration
3. **Track status**: See verification progress
4. **Resubmit**: If documents are rejected

### 🎯 Quick Start Scenarios

#### **Scenario 1: First-Time Shipper**
1. **Register** as shipper
2. **Complete onboarding**
3. **Create first shipment** using template
4. **Review bids** from carriers
5. **Accept best bid**
6. **Track delivery** progress
7. **Rate carrier** after completion

#### **Scenario 2: New Carrier**
1. **Register** as carrier
2. **Upload verification documents**
3. **Browse marketplace** for loads
4. **Place first bid**
5. **Get accepted** and manage shipment
6. **Upload POD** upon delivery
7. **Build rating** and reputation

#### **Scenario 3: Admin Oversight**
1. **Login** as admin
2. **Review pending verifications**
3. **Approve qualified carriers**
4. **Monitor platform activity**
5. **Handle user issues**
6. **Generate reports** for stakeholders

## 📁 Project Structure

```
logistics-saas-platform/
├── src/                    # Frontend (React + TypeScript)
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components (Header, Sidebar)
│   │   └── ...             # Other UI components
│   ├── pages/             # Page components
│   │   ├── auth/           # Login, Signup, Onboarding
│   │   ├── shipments/      # Shipment management pages
│   │   ├── marketplace/    # Marketplace pages
│   │   ├── tracking/       # Live tracking pages
│   │   ├── messaging/      # Messaging system
│   │   ├── pod/            # Proof of Delivery
│   │   ├── admin/          # Admin panel
│   │   └── ...             # Other feature pages
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx # Authentication state
│   │   └── ShipmentContext.tsx # Shipment state
│   ├── types/              # TypeScript type definitions
│   ├── services/           # API service layer
│   └── utils/              # Utility functions
├── backend/                # Backend (Express + TypeScript)
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   │   ├── auth/       # Authentication middleware
│   │   │   └── ...         # Other middleware
│   │   ├── routes/         # API routes
│   │   │   ├── auth.ts     # Authentication routes
│   │   │   ├── shipments.ts # Shipment routes
│   │   │   ├── users.ts    # User routes
│   │   │   └── admin.ts    # Admin routes
│   │   ├── services/       # Business logic
│   │   │   └── auth/       # Authentication service
│   │   ├── types/          # Shared types
│   │   ├── db/             # Database layer
│   │   │   ├── memory.ts   # In-memory database
│   │   │   └── schema/     # Database schema
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Main server file
│   ├── package.json        # Backend dependencies
│   └── tsconfig.json       # Backend TypeScript config
├── package.json            # Frontend dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json           # Frontend TypeScript config
└── README.md              # This file
```



## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Role-Based Access Control** (RBAC)
- **Rate Limiting** per endpoint (lenient in development)
- **CORS Protection** with configurable origins
- **Input Validation** with Zod schemas
- **Audit Logging** for all status changes
- **Password Hashing** with bcrypt

### Rate Limiting Configuration

**Development Mode** (NODE_ENV=development):
- General API: 1000 requests per minute
- Auth endpoints: 50 attempts per 30 seconds
- Health checks: No rate limiting

**Production Mode**:
- General API: 100 requests per 15 minutes
- Auth endpoints: 5 attempts per 15 minutes
- All endpoints: Rate limited

To customize rate limiting, set these environment variables:
```env
RATE_LIMIT_WINDOW_MS=60000  # Time window in milliseconds
RATE_LIMIT_MAX_REQUESTS=1000  # Max requests per window
```

## 📊 Monitoring & Observability

- **Structured Logging** with Pino
- **Error Tracking** with Sentry
- **Performance Monitoring** with OpenTelemetry
- **Health Checks** at `/health`
- **Request/Response Logging**

## 🚀 Deployment

### Production Environment Variables

```env
NODE_ENV=production
DB_HOST=your-postgres-host
REDIS_HOST=your-redis-host
JWT_SECRET=your-production-secret
CORS_ORIGIN=https://your-frontend-domain.com
MAPBOX_ACCESS_TOKEN=your-mapbox-token
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
```

### Docker Production Deployment

```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use Zod for all input validation
3. Add proper error handling
4. Write comprehensive tests
5. Update documentation

## 📝 License

ISC License