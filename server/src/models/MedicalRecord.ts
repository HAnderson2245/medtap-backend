import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export enum RecordType {
  VISIT = 'visit',
  LAB_RESULT = 'lab_result',
  IMAGING = 'imaging',
  PRESCRIPTION = 'prescription',
  PROCEDURE = 'procedure',
  HOSPITALIZATION = 'hospitalization',
  VACCINATION = 'vaccination',
  ALLERGY = 'allergy',
  DIAGNOSIS = 'diagnosis',
  DISCHARGE_SUMMARY = 'discharge_summary'
}

interface MedicalRecordAttributes {
  id: string;
  userId: string;
  recordType: RecordType;
  title: string;
  description?: string;
  date: Date;
  provider?: string;
  facility?: string;
  diagnosis?: string[];
  medications?: string[];
  notes?: string;
  attachments?: string[];
  isCritical: boolean;
  isShared: boolean;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MedicalRecordCreationAttributes extends Optional<MedicalRecordAttributes, 'id' | 'isCritical' | 'isShared'> {}

class MedicalRecord extends Model<MedicalRecordAttributes, MedicalRecordCreationAttributes> implements MedicalRecordAttributes {
  public id!: string;
  public userId!: string;
  public recordType!: RecordType;
  public title!: string;
  public description?: string;
  public date!: Date;
  public provider?: string;
  public facility?: string;
  public diagnosis?: string[];
  public medications?: string[];
  public notes?: string;
  public attachments?: string[];
  public isCritical!: boolean;
  public isShared!: boolean;
  public metadata?: Record<string, any>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MedicalRecord.init(
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
    recordType: {
      type: DataTypes.ENUM(...Object.values(RecordType)),
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
    provider: {
      type: DataTypes.STRING,
      allowNull: true
    },
    facility: {
      type: DataTypes.STRING,
      allowNull: true
    },
    diagnosis: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    medications: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    isCritical: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isShared: {
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
    tableName: 'medical_records',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['recordType'] },
      { fields: ['date'] },
      { fields: ['isCritical'] }
    ]
  }
);

// Associations
User.hasMany(MedicalRecord, { foreignKey: 'userId', as: 'medicalRecords' });
MedicalRecord.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default MedicalRecord;
