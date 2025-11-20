import { Router } from 'express';
import * as bodyScanController from '../controllers/bodyScanController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, bodyScanController.getAllBodyScans);
router.get('/:id', authenticateToken, bodyScanController.getBodyScanById);
router.post('/', authenticateToken, bodyScanController.createBodyScan);
router.put('/:id', authenticateToken, bodyScanController.updateBodyScan);
router.delete('/:id', authenticateToken, bodyScanController.deleteBodyScan);

export default router;
