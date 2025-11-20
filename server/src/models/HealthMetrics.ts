import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export enum MetricType {
  HEART_RATE = 'heart_rate',
  BLOOD_PRESSURE = 'blood_pressure',
  TEMPERATURE = 'temperature',
  WEIGHT = 'weight',
  GLUCOSE = 'glucose',
  OXYGEN_SATURATION = 'oxygen_saturation',
  STEPS = 'steps',
  SLEEP = 'sleep',
  CALORIES = 'calories',
  EXERCISE = 'exercise',
  HYDRATION = 'hydration'
}

interface HealthMetricsAttributes {
  id: string;
  userId: string;
  metricType: MetricType;
  value: number;
  unit: string;
  timestamp: Date;
  source?: string; // wearable device name
  additionalData?: {
    systolic?: number;
    diastolic?: number;
    sleepQuality?: string;
    exerciseType?: string;
    duration?: number;
    [key: string]: any;
  };
  notes?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface HealthMetricsCreationAttributes extends Optional<HealthMetricsAttributes, 'id'> {}

class HealthMetrics extends Model<HealthMetricsAttributes, HealthMetricsCreationAttributes> implements HealthMetricsAttributes {
  public id!: string;
  public userId!: string;
  public metricType!: MetricType;
  public value!: number;
  public unit!: string;
  public timestamp!: Date;
  public source?: string;
  public additionalData?: {
    systolic?: number;
    diastolic?: number;
    sleepQuality?: string;
    exerciseType?: string;
    duration?: number;
    [key: string]: any;
  };
  public notes?: string;
  public metadata?: Record<string, any>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HealthMetrics.init(
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
    metricType: {
      type: DataTypes.ENUM(...Object.values(MetricType)),
      allowNull: false
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true
    },
    additionalData: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  },
  {
    sequelize,
    tableName: 'health_metrics',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['metricType'] },
      { fields: ['timestamp'] }
    ]
  }
);

// Associations
User.hasMany(HealthMetrics, { foreignKey: 'userId', as: 'healthMetrics' });
HealthMetrics.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default HealthMetrics;
