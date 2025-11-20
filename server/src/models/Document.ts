import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export enum DocumentType {
  MEDICAL_FORM = 'medical_form',
  LAB_REPORT = 'lab_report',
  IMAGING_REPORT = 'imaging_report',
  PRESCRIPTION = 'prescription',
  INSURANCE_CARD = 'insurance_card',
  ID_CARD = 'id_card',
  ADVANCE_DIRECTIVE = 'advance_directive',
  CONSENT_FORM = 'consent_form',
  DISCHARGE_SUMMARY = 'discharge_summary',
  BILLING_STATEMENT = 'billing_statement',
  OTHER = 'other'
}

export enum DocumentStatus {
  PENDING = 'pending',
  SIGNED = 'signed',
  EXPIRED = 'expired',
  ARCHIVED = 'archived'
}

interface DocumentAttributes {
  id: string;
  userId: string;
  documentType: DocumentType;
  status: DocumentStatus;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  mimeType: string;
  uploadedAt: Date;
  signedAt?: Date;
  signatureData?: string;
  expiryDate?: Date;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DocumentCreationAttributes extends Optional<DocumentAttributes, 'id' | 'status' | 'uploadedAt'> {}

class Document extends Model<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
  public id!: string;
  public userId!: string;
  public documentType!: DocumentType;
  public status!: DocumentStatus;
  public title!: string;
  public description?: string;
  public fileName!: string;
  public fileSize!: number;
  public fileUrl!: string;
  public mimeType!: string;
  public uploadedAt!: Date;
  public signedAt?: Date;
  public signatureData?: string;
  public expiryDate?: Date;
  public tags?: string[];
  public metadata?: Record<string, any>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Document.init(
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
    documentType: {
      type: DataTypes.ENUM(...Object.values(DocumentType)),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(DocumentStatus)),
      defaultValue: DocumentStatus.PENDING
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uploadedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    signedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    signatureData: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  },
  {
    sequelize,
    tableName: 'documents',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['documentType'] },
      { fields: ['status'] },
      { fields: ['uploadedAt'] }
    ]
  }
);

// Associations
User.hasMany(Document, { foreignKey: 'userId', as: 'documents' });
Document.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Document;
