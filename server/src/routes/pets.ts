import { Router } from 'express';
import * as petController from '../controllers/petController';
import { authenticateToken, authorizeUserTypes } from '../middleware/auth';
import { UserType } from '../models/User';

const router = Router();

router.get('/', authenticateToken, authorizeUserTypes(UserType.PET_OWNER), petController.getAllPets);
router.get('/:id', authenticateToken, authorizeUserTypes(UserType.PET_OWNER), petController.getPetById);
router.post('/', authenticateToken, authorizeUserTypes(UserType.PET_OWNER), petController.createPet);
router.put('/:id', authenticateToken, authorizeUserTypes(UserType.PET_OWNER), petController.updatePet);
router.post('/:id/lost', authenticateToken, authorizeUserTypes(UserType.PET_OWNER), petController.reportLostPet);
router.delete('/:id', authenticateToken, authorizeUserTypes(UserType.PET_OWNER), petController.deletePet);

export default router;
