import { Response } from 'express';
import { Appointment } from '../models';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';

export const getAllAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { status, startDate, endDate, upcoming } = req.query;

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (upcoming === 'true') {
      where.appointmentDate = { [Op.gte]: new Date() };
    } else if (startDate || endDate) {
      where.appointmentDate = {};
      if (startDate) where.appointmentDate[Op.gte] = new Date(startDate as string);
      if (endDate) where.appointmentDate[Op.lte] = new Date(endDate as string);
    }

    const appointments = await Appointment.findAll({
      where,
      order: [['appointmentDate', 'ASC']]
    });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Failed to get appointments' });
  }
};

export const getAppointmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      where: { id, userId }
    });

    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }

    res.status(200).json({ appointment });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: 'Failed to get appointment' });
  }
};

export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const appointmentData = req.body;

    const appointment = await Appointment.create({
      userId: userId!,
      ...appointmentData
    });

    res.status(201).json({ 
      message: 'Appointment created successfully',
      appointment 
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

export const updateAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const appointmentData = req.body;

    const appointment = await Appointment.findOne({
      where: { id, userId }
    });

    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }

    await appointment.update(appointmentData);

    res.status(200).json({ 
      message: 'Appointment updated successfully',
      appointment 
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

export const cancelAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      where: { id, userId }
    });

    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }

    await appointment.update({ status: 'CANCELLED' });  // ← FIXED: Changed to uppercase

    res.status(200).json({ 
      message: 'Appointment cancelled successfully',
      appointment 
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
};

export const deleteAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      where: { id, userId }
    });

    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }

    await appointment.destroy();

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
};
