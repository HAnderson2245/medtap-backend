import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('userType').isIn(['individual', 'pet_owner', 'veteran', 'physician', 'insurance', 'legal']),
    body('firstName').optional().trim().isLength({ min: 1 }),
    body('lastName').optional().trim().isLength({ min: 1 })
  ],
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  authController.login
);

// Get current user
router.get('/me', authenticateToken, authController.getCurrentUser);

// Verify email
router.post('/verify-email', authenticateToken, authController.verifyEmail);

// Logout
router.post('/logout', authenticateToken, authController.logout);

export default router;
