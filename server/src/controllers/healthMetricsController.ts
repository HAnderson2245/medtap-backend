import { Response } from 'express';
import { HealthMetrics } from '../models';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';

export const getAllMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { metricType, startDate, endDate, source } = req.query;

    const where: any = { userId };

    if (metricType) {
      where.metricType = metricType;
    }

    if (source) {
      where.source = source;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Op.gte] = new Date(startDate as string);
      if (endDate) where.timestamp[Op.lte] = new Date(endDate as string);
    }

    const metrics = await HealthMetrics.findAll({
      where,
      order: [['timestamp', 'DESC']]
    });

    res.status(200).json({ metrics });
  } catch (error) {
    console.error('Get health metrics error:', error);
    res.status(500).json({ error: 'Failed to get health metrics' });
  }
};

export const recordMetric = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const metricData = req.body;

    const metric = await HealthMetrics.create({
      userId: userId!,
      timestamp: new Date(),
      ...metricData
    });

    res.status(201).json({ 
      message: 'Health metric recorded successfully',
      metric 
    });
  } catch (error) {
    console.error('Record health metric error:', error);
    res.status(500).json({ error: 'Failed to record health metric' });
  }
};

export const deleteMetric = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const metric = await HealthMetrics.findOne({
      where: { id, userId }
    });

    if (!metric) {
      res.status(404).json({ error: 'Health metric not found' });
      return;
    }

    await metric.destroy();

    res.status(200).json({ message: 'Health metric deleted successfully' });
  } catch (error) {
    console.error('Delete health metric error:', error);
    res.status(500).json({ error: 'Failed to delete health metric' });
  }
};
