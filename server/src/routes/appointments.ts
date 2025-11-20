import { Router } from 'express';
import * as appointmentController from '../controllers/appointmentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, appointmentController.getAllAppointments);
router.get('/:id', authenticateToken, appointmentController.getAppointmentById);
router.post('/', authenticateToken, appointmentController.createAppointment);
router.put('/:id', authenticateToken, appointmentController.updateAppointment);
router.patch('/:id/cancel', authenticateToken, appointmentController.cancelAppointment);
router.delete('/:id', authenticateToken, appointmentController.deleteAppointment);

export default router;
