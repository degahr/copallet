import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthService } from '../services/auth/AuthService';
import { LoginRequestSchema, SignupRequestSchema } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth/authMiddleware';
import { CustomError } from '../middleware/errorHandler';

const router = Router();

// More lenient rate limiting for auth endpoints in development
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
const authLimiter = rateLimit({
  windowMs: isDevelopment ? 30000 : 900000, // 30 seconds in dev, 15 minutes in prod
  max: isDevelopment ? 50 : 5, // 50 attempts in dev, 5 in prod
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to login and signup
router.use('/login', authLimiter);
router.use('/signup', authLimiter);

// POST /api/auth/signup
router.post('/signup', asyncHandler(async (req, res) => {
  const validatedData = SignupRequestSchema.parse(req.body);
  
  const { user, tokens } = await AuthService.signup(validatedData);
  
  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      createdAt: user.createdAt,
    },
    tokens,
  });
}));

// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const validatedData = LoginRequestSchema.parse(req.body);
  
  const { user, tokens } = await AuthService.login(validatedData);
  
  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      lastLoginAt: user.lastLoginAt,
    },
    tokens,
  });
}));

// POST /api/auth/refresh
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    throw new CustomError('Refresh token required', 400);
  }
  
  const tokens = await AuthService.refreshTokens(refreshToken);
  
  res.json({
    message: 'Tokens refreshed successfully',
    tokens,
  });
}));

// GET /api/auth/me
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const user = await AuthService.getUserById(req.user!.userId);
  
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    },
  });
}));

// POST /api/auth/logout
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  // In a real implementation, you would:
  // 1. Add the token to a blacklist
  // 2. Store blacklisted tokens in Redis
  // 3. Check blacklist in auth middleware
  
  res.json({
    message: 'Logout successful',
  });
}));

export default router;
