import { Response } from 'express';
import { Profile } from '../models';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const profile = await Profile.findOne({ where: { userId } });

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const profileData = req.body;

    let profile = await Profile.findOne({ where: { userId } });

    if (!profile) {
      // Create profile if it doesn't exist
      profile = await Profile.create({
        userId: userId!,
        ...profileData
      });
    } else {
      // Update existing profile
      await profile.update(profileData);
    }

    res.status(200).json({ 
      message: 'Profile updated successfully',
      profile 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const deleteProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const profile = await Profile.findOne({ where: { userId } });

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    await profile.destroy();

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
};
