import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export enum BodyPartCategory {
  HEAD = 'head',
  NECK = 'neck',
  CHEST = 'chest',
  ABDOMEN = 'abdomen',
  UPPER_EXTREMITY = 'upper_extremity',
  LOWER_EXTREMITY = 'lower_extremity',
  BACK = 'back',
  PELVIS = 'pelvis'
}

export enum BodyScanType {
  SURGERY = 'surgery',
  IMPLANT = 'implant',
  FRACTURE = 'fracture',
  INJURY = 'injury',
  CHRONIC_CONDITION = 'chronic_condition',
  TATTOO = 'tattoo',
  SCAR = 'scar'
}

interface BodyScanAttributes {
  id: string;
  userId: string;
  bodyPart: BodyPartCategory;
  scanType: BodyScanType;
  title: string;
  description?: string;
  date: Date;
  position3D?: {
    x: number;
    y: number;
    z: number;
  };
  metadata?: {
    surgeryType?: string;
    implantDetails?: string;
    fractureType?: string;
    chronicConditionName?: string;
    severity?: string;
    [key: string]: any;
  };
  images?: string[];
  relatedRecords?: string[];
  notes?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BodyScanCreationAttributes extends Optional<BodyScanAttributes, 'id' | 'isActive'> {}

class BodyScan extends Model<BodyScanAttributes, BodyScanCreationAttributes> implements BodyScanAttributes {
  public id!: string;
  public userId!: string;
  public bodyPart!: BodyPartCategory;
  public scanType!: BodyScanType;
  public title!: string;
  public description?: string;
  public date!: Date;
  public position3D?: {
    x: number;
    y: number;
    z: number;
  };
  public metadata?: {
    surgeryType?: string;
    implantDetails?: string;
    fractureType?: string;
    chronicConditionName?: string;
    severity?: string;
    [key: string]: any;
  };
  public images?: string[];
  public relatedRecords?: string[];
  public notes?: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BodyScan.init(
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
    bodyPart: {
      type: DataTypes.ENUM(...Object.values(BodyPartCategory)),
      allowNull: false
    },
    scanType: {
      type: DataTypes.ENUM(...Object.values(BodyScanType)),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    position3D: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    relatedRecords: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: []
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'body_scans',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['bodyPart'] },
      { fields: ['scanType'] },
      { fields: ['date'] }
    ]
  }
);

// Associations
User.hasMany(BodyScan, { foreignKey: 'userId', as: 'bodyScans' });
BodyScan.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default BodyScan;
