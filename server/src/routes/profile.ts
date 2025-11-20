import { Router } from 'express';
import * as profileController from '../controllers/profileController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, profileController.getProfile);
router.put('/', authenticateToken, profileController.updateProfile);
router.delete('/', authenticateToken, profileController.deleteProfile);

export default router;
