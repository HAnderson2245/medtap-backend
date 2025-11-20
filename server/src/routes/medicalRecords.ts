import { Router } from 'express';
import * as medicalRecordController from '../controllers/medicalRecordController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, medicalRecordController.getAllRecords);
router.get('/:id', authenticateToken, medicalRecordController.getRecordById);
router.post('/', authenticateToken, medicalRecordController.createRecord);
router.put('/:id', authenticateToken, medicalRecordController.updateRecord);
router.delete('/:id', authenticateToken, medicalRecordController.deleteRecord);

export default router;
