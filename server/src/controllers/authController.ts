import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserType, UserStatus } from '../models/User';  // ← FIXED: User is default import
import { Profile } from '../models';
import { validationResult } from 'express-validator';

// Generate JWT token
const generateToken = (user: User): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      userType: user.userType
    },
    jwtSecret as string,  // ← FIXED: Added "as string"
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
};

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password, userType, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: 'User already exists with this email' });
      return;
    }

    // Create user
    const user = await User.create({
      email,
      password,
      userType: userType as UserType,
      status: UserStatus.PENDING_VERIFICATION,
      emailVerified: false,
      phoneVerified: false,
      twoFactorEnabled: false
    });

    // Create profile
    if (firstName && lastName) {
      await Profile.create({
        userId: user.id,
        firstName,
        lastName
      });
    }

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Profile, as: 'profile' }]
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE && user.status !== UserStatus.PENDING_VERIFICATION) {
      res.status(403).json({ error: 'Account is suspended or inactive' });
      return;
    }

    // Update last login
    await user.update({ lastLoginAt: new Date() });

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        status: user.status,
        profile: user.get('profile')
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    const user = await User.findByPk(userId, {
      include: [{ model: Profile, as: 'profile' }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

// Verify email
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { verificationCode } = req.body;

    // In production, verify the code against stored verification token
    // For now, we'll just mark as verified

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await user.update({ 
      emailVerified: true,
      status: UserStatus.ACTIVE
    });

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
};

// Logout (client-side token removal, but log for audit)
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    // Log logout for HIPAA audit trail
    console.log(`[AUDIT] User ${userId} logged out at ${new Date().toISOString()}`);

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
};
