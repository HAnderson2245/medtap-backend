import { Response } from 'express';
import { MedicalRecord } from '../models';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';

export const getAllRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { recordType, startDate, endDate, search } = req.query;

    const where: any = { userId };

    if (recordType) {
      where.recordType = recordType;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = new Date(startDate as string);
      if (endDate) where.date[Op.lte] = new Date(endDate as string);
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { provider: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const records = await MedicalRecord.findAll({
      where,
      order: [['date', 'DESC']]
    });

    res.status(200).json({ records });
  } catch (error) {
    console.error('Get medical records error:', error);
    res.status(500).json({ error: 'Failed to get medical records' });
  }
};

export const getRecordById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const record = await MedicalRecord.findOne({
      where: { id, userId }
    });

    if (!record) {
      res.status(404).json({ error: 'Medical record not found' });
      return;
    }

    res.status(200).json({ record });
  } catch (error) {
    console.error('Get medical record error:', error);
    res.status(500).json({ error: 'Failed to get medical record' });
  }
};

export const createRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const recordData = req.body;

    const record = await MedicalRecord.create({
      userId: userId!,
      ...recordData
    });

    res.status(201).json({ 
      message: 'Medical record created successfully',
      record 
    });
  } catch (error) {
    console.error('Create medical record error:', error);
    res.status(500).json({ error: 'Failed to create medical record' });
  }
};

export const updateRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const recordData = req.body;

    const record = await MedicalRecord.findOne({
      where: { id, userId }
    });

    if (!record) {
      res.status(404).json({ error: 'Medical record not found' });
      return;
    }

    await record.update(recordData);

    res.status(200).json({ 
      message: 'Medical record updated successfully',
      record 
    });
  } catch (error) {
    console.error('Update medical record error:', error);
    res.status(500).json({ error: 'Failed to update medical record' });
  }
};

export const deleteRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const record = await MedicalRecord.findOne({
      where: { id, userId }
    });

    if (!record) {
      res.status(404).json({ error: 'Medical record not found' });
      return;
    }

    await record.destroy();

    res.status(200).json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    console.error('Delete medical record error:', error);
    res.status(500).json({ error: 'Failed to delete medical record' });
  }
};
