import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export enum AppointmentType {
  IN_PERSON = 'in_person',
  TELEMEDICINE = 'telemedicine',
  PHONE = 'phone',
  HOME_VISIT = 'home_visit'
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled'
}

interface AppointmentAttributes {
  id: string;
  userId: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  providerName: string;
  providerSpecialty?: string;
  facilityName?: string;
  facilityAddress?: string;
  appointmentDate: Date;
  duration: number; // in minutes
  reason?: string;
  notes?: string;
  telemedicineLink?: string;
  reminderSent: boolean;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AppointmentCreationAttributes extends Optional<AppointmentAttributes, 'id' | 'status' | 'reminderSent'> {}

class Appointment extends Model<AppointmentAttributes, AppointmentCreationAttributes> implements AppointmentAttributes {
  public id!: string;
  public userId!: string;
  public appointmentType!: AppointmentType;
  public status!: AppointmentStatus;
  public providerName!: string;
  public providerSpecialty?: string;
  public facilityName?: string;
  public facilityAddress?: string;
  public appointmentDate!: Date;
  public duration!: number;
  public reason?: string;
  public notes?: string;
  public telemedicineLink?: string;
  public reminderSent!: boolean;
  public metadata?: Record<string, any>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    appointmentType: {
      type: DataTypes.ENUM(...Object.values(AppointmentType)),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AppointmentStatus)),
      defaultValue: AppointmentStatus.SCHEDULED
    },
    providerName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    providerSpecialty: {
      type: DataTypes.STRING,
      allowNull: true
    },
    facilityName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    facilityAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 30
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    telemedicineLink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  },
  {
    sequelize,
    tableName: 'appointments',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['appointmentDate'] },
      { fields: ['status'] }
    ]
  }
);

// Associations
User.hasMany(Appointment, { foreignKey: 'userId', as: 'appointments' });
Appointment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Appointment;
