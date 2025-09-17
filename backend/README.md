# CoPallet Backend

A production-ready Express.js backend for the CoPallet Logistics SaaS Platform.

## 🚀 Tech Stack

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with PostGIS extension
- **ORM**: Drizzle ORM
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod schema validation
- **Caching**: Redis
- **Queues**: BullMQ
- **File Storage**: S3-compatible (AWS S3 / Cloudflare R2)
- **Geospatial**: Mapbox / OpenRouteService
- **Notifications**: Email (Resend), Web Push, SMS (Twilio)
- **Observability**: Sentry, OpenTelemetry, Pino logging
- **Security**: Helmet, CORS, Rate limiting

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 15+ with PostGIS
- Redis 7+
- Docker & Docker Compose (optional)

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=copallet

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# External Services
MAPBOX_ACCESS_TOKEN=your-mapbox-token
RESEND_API_KEY=your-resend-key
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=copallet-files
```

### 3. Database Setup

#### Option A: Using Docker Compose (Recommended)

```bash
# From project root
docker-compose up postgres redis -d
```

#### Option B: Local Installation

1. Install PostgreSQL with PostGIS extension
2. Create database:
```sql
CREATE DATABASE copallet;
```

3. Install Redis

### 4. Database Migrations

```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed database
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh tokens
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### User Endpoints

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-document` - Upload verification documents
- `GET /api/users/documents` - Get user documents

### Shipment Endpoints

- `GET /api/shipments` - List shipments (with filtering)
- `POST /api/shipments` - Create shipment (shippers only)
- `GET /api/shipments/:id` - Get shipment details
- `PUT /api/shipments/:id` - Update shipment
- `POST /api/shipments/:id/bids` - Place bid (carriers only)
- `PUT /api/shipments/:id/bids/:bidId/accept` - Accept bid (shippers only)
- `GET /api/shipments/:id/tracking` - Get tracking points
- `POST /api/shipments/:id/tracking` - Add tracking point
- `POST /api/shipments/:id/pod` - Submit proof of delivery
- `GET /api/shipments/:id/messages` - Get messages
- `POST /api/shipments/:id/messages` - Send message

### Admin Endpoints

- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/verification` - Update verification status
- `GET /api/admin/verifications` - Get pending verifications
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/audit-logs` - Audit logs

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate migration files
npm run db:migrate      # Run migrations
npm run db:studio       # Open Drizzle Studio
npm run db:seed         # Seed database

# Code Quality
npm run type-check      # TypeScript type checking
npm run lint            # ESLint (when configured)
```

## 🏗️ Project Structure

```
src/
├── controllers/        # Route controllers
├── middleware/         # Express middleware
│   ├── auth/          # Authentication middleware
│   ├── validation/    # Request validation
│   └── rateLimit/     # Rate limiting
├── routes/            # API routes
├── services/          # Business logic
│   ├── auth/          # Authentication service
│   ├── notifications/ # Notification service
│   ├── storage/       # File storage service
│   └── geospatial/    # Mapping/routing service
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
└── db/                # Database configuration
    ├── schema/        # Drizzle schema definitions
    └── migrations/    # Database migrations
```

## 🔒 Security Features

- **JWT Authentication**: Access + refresh token pattern
- **Role-Based Access Control**: Shippers, carriers, dispatchers, admins
- **Rate Limiting**: Configurable per-endpoint limits
- **CORS Protection**: Configurable allowed origins
- **Helmet**: Security headers
- **Input Validation**: Zod schema validation
- **Audit Logging**: Track all status changes
- **Password Hashing**: bcrypt with salt rounds

## 📊 Monitoring & Observability

- **Structured Logging**: Pino logger with JSON output
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: OpenTelemetry traces
- **Health Checks**: `/health` endpoint
- **Request Logging**: Detailed request/response logging

## 🚀 Deployment

### Docker Deployment

```bash
# Build production image
docker build -t copallet-backend .

# Run with environment variables
docker run -p 3001:3001 \
  -e DB_HOST=your-db-host \
  -e REDIS_HOST=your-redis-host \
  -e JWT_SECRET=your-secret \
  copallet-backend
```

### Environment Variables for Production

Ensure these are set in production:

- `NODE_ENV=production`
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `REDIS_HOST`, `REDIS_PASSWORD`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `CORS_ORIGIN` (your frontend URL)
- External service API keys

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use Zod for all input validation
3. Add proper error handling
4. Write comprehensive tests
5. Update documentation

## 📝 License

ISC License
