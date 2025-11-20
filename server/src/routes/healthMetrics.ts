import { Router } from 'express';
import * as healthMetricsController from '../controllers/healthMetricsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, healthMetricsController.getAllMetrics);
router.post('/', authenticateToken, healthMetricsController.recordMetric);
router.delete('/:id', authenticateToken, healthMetricsController.deleteMetric);

export default router;
