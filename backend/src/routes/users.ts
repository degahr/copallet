import { Router } from 'express';
import { authenticateToken, requireVerified } from '../middleware/auth/authMiddleware';
import { asyncHandler } from '../middleware/errorHandler';
import { getUserProfile, updateUserProfile } from '../db/memory';
import { UpdateProfileRequestSchema } from '../types';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

// GET /api/users/profile
router.get('/profile', requireVerified, asyncHandler(async (req, res) => {
  const user = req.user!;
  const profile = getUserProfile(user.userId);
  
  res.json({ 
    user: {
      id: user.userId,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
    },
    profile 
  });
}));

// PUT /api/users/profile
router.put('/profile', requireVerified, asyncHandler(async (req, res) => {
  const user = req.user!;
  const validatedData = UpdateProfileRequestSchema.parse(req.body);
  
  const updatedProfile = updateUserProfile(user.userId, validatedData);
  
  if (!updatedProfile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  
  res.json({ profile: updatedProfile });
}));

// POST /api/users/upload-document
router.post('/upload-document', requireVerified, asyncHandler(async (req, res) => {
  // TODO: Implement document upload
  res.json({ message: 'Upload document - TODO' });
}));

// GET /api/users/documents
router.get('/documents', requireVerified, asyncHandler(async (req, res) => {
  // TODO: Implement get user documents
  res.json({ message: 'Get user documents - TODO' });
}));

export default router;
