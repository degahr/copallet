# CoPallet Deployment Checklist

## Pre-Deployment Checklist

### ✅ Repository Preparation
- [ ] Code is pushed to GitHub repository
- [ ] All environment files are created
- [ ] CORS configuration is updated
- [ ] API service uses environment variables
- [ ] Build scripts are tested locally

### ✅ Environment Variables
- [ ] JWT secrets are generated (use `openssl rand -base64 32`)
- [ ] CORS_ORIGIN is set to frontend URL
- [ ] VITE_API_URL is set to backend URL
- [ ] NODE_ENV is set to production
- [ ] Rate limiting is configured

### ✅ Security
- [ ] Strong JWT secrets are generated
- [ ] CORS is properly configured
- [ ] HTTPS is enabled
- [ ] Security headers are set
- [ ] Rate limiting is active

## Backend Deployment (Render)

### ✅ Service Configuration
- [ ] Service name: `copallet-backend`
- [ ] Root directory: `backend`
- [ ] Environment: `Node`
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Node version: `20`

### ✅ Environment Variables Set
- [ ] `NODE_ENV=production`
- [ ] `PORT=3001`
- [ ] `JWT_SECRET=<generated-secret>`
- [ ] `JWT_REFRESH_SECRET=<generated-secret>`
- [ ] `JWT_EXPIRES_IN=15m`
- [ ] `JWT_REFRESH_EXPIRES_IN=7d`
- [ ] `CORS_ORIGIN=https://your-frontend-url.onrender.com`
- [ ] `RATE_LIMIT_WINDOW_MS=900000`
- [ ] `RATE_LIMIT_MAX_REQUESTS=100`

### ✅ Deployment
- [ ] Service is deployed successfully
- [ ] Health check passes: `https://your-backend.onrender.com/health`
- [ ] API test passes: `https://your-backend.onrender.com/api/test`
- [ ] Backend URL is noted: `https://your-backend.onrender.com`

## Frontend Deployment (Render)

### ✅ Service Configuration
- [ ] Service name: `copallet-frontend`
- [ ] Root directory: `/` (root)
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`

### ✅ Environment Variables Set
- [ ] `VITE_API_URL=https://your-backend.onrender.com`
- [ ] `VITE_APP_NAME=CoPallet`
- [ ] `VITE_APP_VERSION=1.0.0`

### ✅ Deployment
- [ ] Service is deployed successfully
- [ ] Frontend is accessible: `https://your-frontend.onrender.com`
- [ ] Frontend URL is noted: `https://your-frontend.onrender.com`

## Post-Deployment Configuration

### ✅ CORS Update
- [ ] Backend CORS_ORIGIN is updated with frontend URL
- [ ] Backend is redeployed after CORS update
- [ ] Frontend can connect to backend

### ✅ Testing
- [ ] Frontend loads without errors
- [ ] Login functionality works
- [ ] API calls are successful
- [ ] No CORS errors in browser console
- [ ] All features are accessible

### ✅ Production Optimizations
- [ ] HTTPS is enabled (automatic on Render)
- [ ] Auto-deploy is configured
- [ ] Health checks are enabled
- [ ] Monitoring is set up
- [ ] Custom domains are configured (optional)

## Troubleshooting Checklist

### ❌ Common Issues
- [ ] **Build Failures**: Check Node.js version, package.json scripts
- [ ] **CORS Errors**: Verify CORS_ORIGIN environment variable
- [ ] **Environment Variables**: Ensure all variables are set correctly
- [ ] **Service Timeouts**: Consider upgrading from free tier
- [ ] **Memory Issues**: Optimize build or upgrade plan

### ❌ Debugging Steps
1. Check Render build logs
2. Verify environment variables
3. Test backend endpoints directly
4. Check browser console for errors
5. Verify CORS configuration

## Security Checklist

### 🔒 Security Measures
- [ ] JWT secrets are strong and unique
- [ ] CORS is properly configured (not wildcard)
- [ ] HTTPS is enforced
- [ ] Rate limiting is active
- [ ] Security headers are set
- [ ] Environment variables are secure

## Performance Checklist

### ⚡ Performance Optimizations
- [ ] Frontend is built for production
- [ ] Backend is optimized for production
- [ ] Static assets are cached
- [ ] Gzip compression is enabled
- [ ] CDN is configured (optional)
- [ ] Database is optimized (future)

## Monitoring Checklist

### 📊 Monitoring Setup
- [ ] Health checks are configured
- [ ] Error tracking is set up
- [ ] Performance monitoring is active
- [ ] Logs are being collected
- [ ] Alerts are configured
- [ ] Uptime monitoring is enabled

## Backup & Recovery

### 💾 Backup Strategy
- [ ] Database backups are configured (future)
- [ ] Environment variables are documented
- [ ] Deployment process is documented
- [ ] Recovery procedures are defined
- [ ] Rollback plan is prepared

## Documentation

### 📚 Documentation Updates
- [ ] Deployment guide is complete
- [ ] Environment variables are documented
- [ ] Troubleshooting guide is updated
- [ ] API documentation is current
- [ ] User guide is updated

---

## Quick Commands

### Test Backend
```bash
curl https://your-backend.onrender.com/health
curl https://your-backend.onrender.com/api/test
```

### Test Frontend
```bash
# Visit in browser
https://your-frontend.onrender.com
```

### Generate JWT Secrets
```bash
openssl rand -base64 32
```

### Check Deployment Status
```bash
# Check Render dashboard
https://dashboard.render.com
```

---

**Deployment Date**: ___________
**Backend URL**: ___________
**Frontend URL**: ___________
**Deployed By**: ___________
