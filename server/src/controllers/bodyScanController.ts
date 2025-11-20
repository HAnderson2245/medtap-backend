import { Response } from 'express';
import { BodyScan } from '../models';
import { AuthRequest } from '../middleware/auth';

export const getAllBodyScans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { bodyPart, scanType, isActive } = req.query;

    const where: any = { userId };

    if (bodyPart) {
      where.bodyPart = bodyPart;
    }

    if (scanType) {
      where.scanType = scanType;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const bodyScans = await BodyScan.findAll({
      where,
      order: [['date', 'DESC']]
    });

    res.status(200).json({ bodyScans });
  } catch (error) {
    console.error('Get body scans error:', error);
    res.status(500).json({ error: 'Failed to get body scans' });
  }
};

export const getBodyScanById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const bodyScan = await BodyScan.findOne({
      where: { id, userId }
    });

    if (!bodyScan) {
      res.status(404).json({ error: 'Body scan not found' });
      return;
    }

    res.status(200).json({ bodyScan });
  } catch (error) {
    console.error('Get body scan error:', error);
    res.status(500).json({ error: 'Failed to get body scan' });
  }
};

export const createBodyScan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const scanData = req.body;

    const bodyScan = await BodyScan.create({
      userId: userId!,
      ...scanData
    });

    res.status(201).json({ 
      message: 'Body scan created successfully',
      bodyScan 
    });
  } catch (error) {
    console.error('Create body scan error:', error);
    res.status(500).json({ error: 'Failed to create body scan' });
  }
};

export const updateBodyScan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const scanData = req.body;

    const bodyScan = await BodyScan.findOne({
      where: { id, userId }
    });

    if (!bodyScan) {
      res.status(404).json({ error: 'Body scan not found' });
      return;
    }

    await bodyScan.update(scanData);

    res.status(200).json({ 
      message: 'Body scan updated successfully',
      bodyScan 
    });
  } catch (error) {
    console.error('Update body scan error:', error);
    res.status(500).json({ error: 'Failed to update body scan' });
  }
};

export const deleteBodyScan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const bodyScan = await BodyScan.findOne({
      where: { id, userId }
    });

    if (!bodyScan) {
      res.status(404).json({ error: 'Body scan not found' });
      return;
    }

    await bodyScan.destroy();

    res.status(200).json({ message: 'Body scan deleted successfully' });
  } catch (error) {
    console.error('Delete body scan error:', error);
    res.status(500).json({ error: 'Failed to delete body scan' });
  }
};
