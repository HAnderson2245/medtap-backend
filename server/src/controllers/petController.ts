import { Response } from 'express';
import { Pet } from '../models';
import { AuthRequest } from '../middleware/auth';

export const getAllPets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;

    const pets = await Pet.findAll({
      where: { ownerId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ pets });
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ error: 'Failed to get pets' });
  }
};

export const getPetById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;
    const { id } = req.params;

    const pet = await Pet.findOne({
      where: { id, ownerId }
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    res.status(200).json({ pet });
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({ error: 'Failed to get pet' });
  }
};

export const createPet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;
    const petData = req.body;

    const pet = await Pet.create({
      ownerId: ownerId!,
      ...petData
    });

    res.status(201).json({ 
      message: 'Pet added successfully',
      pet 
    });
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({ error: 'Failed to add pet' });
  }
};

export const updatePet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;
    const { id } = req.params;
    const petData = req.body;

    const pet = await Pet.findOne({
      where: { id, ownerId }
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    await pet.update(petData);

    res.status(200).json({ 
      message: 'Pet updated successfully',
      pet 
    });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({ error: 'Failed to update pet' });
  }
};

export const reportLostPet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;
    const { id } = req.params;
    const { lastSeenDate, lastSeenLocation, description } = req.body;

    const pet = await Pet.findOne({
      where: { id, ownerId }
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    await pet.update({
      isLost: true,
      lostDetails: {
        lastSeenDate,
        lastSeenLocation,
        description
      }
    });

    res.status(200).json({ 
      message: 'Pet reported as lost',
      pet 
    });
  } catch (error) {
    console.error('Report lost pet error:', error);
    res.status(500).json({ error: 'Failed to report lost pet' });
  }
};

export const deletePet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;
    const { id } = req.params;

    const pet = await Pet.findOne({
      where: { id, ownerId }
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    await pet.destroy();

    res.status(200).json({ message: 'Pet removed successfully' });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({ error: 'Failed to remove pet' });
  }
};
