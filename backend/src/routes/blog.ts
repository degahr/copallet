import { Router } from 'express';
import { 
  createBlogPost, 
  updateBlogPost, 
  getBlogPost, 
  getBlogPostBySlug, 
  getAllBlogPosts, 
  getPublishedBlogPosts, 
  getBlogPostsByCategory, 
  deleteBlogPost 
} from '../db/memory';
import { CreateBlogPostSchema, UpdateBlogPostSchema } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth/authMiddleware';
import { CustomError } from '../middleware/errorHandler';

const router = Router();

// GET /api/blog - Get all published blog posts (public)
router.get('/', asyncHandler(async (req, res) => {
  const { category, featured } = req.query;
  
  let posts = getPublishedBlogPosts();
  
  if (category) {
    posts = getBlogPostsByCategory(category as string);
  }
  
  if (featured === 'true') {
    posts = posts.filter(post => post.featured);
  }
  
  res.json({
    posts,
    total: posts.length
  });
}));

// GET /api/blog/admin - Get all blog posts (admin only)
router.get('/admin', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user!.role !== 'admin') {
    throw new CustomError('Admin access required', 403);
  }
  
  const posts = getAllBlogPosts();
  res.json({
    posts,
    total: posts.length
  });
}));

// GET /api/blog/:id - Get blog post by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = getBlogPost(id);
  
  if (!post) {
    throw new CustomError('Blog post not found', 404);
  }
  
  res.json({ post });
}));

// GET /api/blog/slug/:slug - Get blog post by slug
router.get('/slug/:slug', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    throw new CustomError('Blog post not found', 404);
  }
  
  res.json({ post });
}));

// POST /api/blog - Create new blog post (admin only)
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user!.role !== 'admin') {
    throw new CustomError('Admin access required', 403);
  }
  
  const validatedData = CreateBlogPostSchema.parse(req.body);
  
  // Generate slug from title
  const slug = validatedData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const post = createBlogPost({
    ...validatedData,
    slug,
    date: new Date(),
    status: validatedData.status || 'draft',
    publishedAt: validatedData.status === 'published' ? new Date() : undefined,
  });
  
  res.status(201).json({
    message: 'Blog post created successfully',
    post
  });
}));

// PUT /api/blog/:id - Update blog post (admin only)
router.put('/:id', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user!.role !== 'admin') {
    throw new CustomError('Admin access required', 403);
  }
  
  const { id } = req.params;
  const validatedData = UpdateBlogPostSchema.parse(req.body);
  
  const existingPost = getBlogPost(id);
  if (!existingPost) {
    throw new CustomError('Blog post not found', 404);
  }
  
  const updateData = {
    ...validatedData,
    publishedAt: validatedData.status === 'published' && existingPost.status !== 'published' 
      ? new Date() 
      : existingPost.publishedAt,
  };
  
  const post = updateBlogPost(id, updateData);
  
  res.json({
    message: 'Blog post updated successfully',
    post
  });
}));

// DELETE /api/blog/:id - Delete blog post (admin only)
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user!.role !== 'admin') {
    throw new CustomError('Admin access required', 403);
  }
  
  const { id } = req.params;
  
  const existingPost = getBlogPost(id);
  if (!existingPost) {
    throw new CustomError('Blog post not found', 404);
  }
  
  const deleted = deleteBlogPost(id);
  
  if (deleted) {
    res.json({ message: 'Blog post deleted successfully' });
  } else {
    throw new CustomError('Failed to delete blog post', 500);
  }
}));

export default router;
