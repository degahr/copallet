import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { 
  findUserByEmail, 
  findUserById, 
  createUser, 
  updateUser, 
  createUserProfile,
  getUserProfile,
  User,
  seedDatabase
} from '../../db/memory';
import { UserRole, LoginRequest, SignupRequest } from '../../types';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private static readonly SALT_ROUNDS = 12;
  private static readonly ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
  private static readonly REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  static {
    // Initialize database with seed data
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateTokens(payload: Omit<JWTPayload, 'iat' | 'exp'>): AuthTokens {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'dev-secret-key',
      { expiresIn: this.ACCESS_TOKEN_EXPIRES_IN } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      { userId: payload.userId },
      process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
      { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN } as jwt.SignOptions
    );

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key') as JWTPayload;
  }

  static verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret') as { userId: string };
  }

  static async signup(data: SignupRequest): Promise<{ user: User; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = findUserByEmail(data.email);

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(data.password);

    // Create user
    const newUser = createUser({
      email: data.email,
      passwordHash,
      role: data.role,
      verificationStatus: data.role === 'admin' ? 'approved' : 'pending',
      isActive: true,
    });

    // Create user profile
    createUserProfile({
      userId: newUser.id,
    });

    // Generate tokens
    const tokens = this.generateTokens({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role as UserRole,
    });

    return { user: newUser, tokens };
  }

  static async login(data: LoginRequest): Promise<{ user: User; tokens: AuthTokens }> {
    // Find user
    const user = findUserByEmail(data.email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isValidPassword = await this.comparePassword(data.password, user.passwordHash);
    
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    updateUser(user.id, { lastLoginAt: new Date() });

    // Generate tokens
    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    return { user, tokens };
  }

  static async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const { userId } = this.verifyRefreshToken(refreshToken);

      // Find user
      const user = findUserById(userId);

      if (!user || !user.isActive) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      return this.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role as UserRole,
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static async getUserById(userId: string): Promise<User | null> {
    const user = findUserById(userId);
    return user || null;
  }

  static async updateUserVerificationStatus(
    userId: string,
    status: 'approved' | 'rejected',
    reviewedBy: string,
    rejectionReason?: string
  ): Promise<void> {
    updateUser(userId, {
      verificationStatus: status,
    });
  }
}
