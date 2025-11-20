import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export enum MilitaryBranch {
  ARMY = 'army',
  NAVY = 'navy',
  AIR_FORCE = 'air_force',
  MARINES = 'marines',
  COAST_GUARD = 'coast_guard',
  SPACE_FORCE = 'space_force'
}

export enum ServiceStatus {
  ACTIVE = 'active',
  VETERAN = 'veteran',
  RESERVE = 'reserve',
  RETIRED = 'retired'
}

export enum DisabilityRating {
  NONE = '0%',
  TEN = '10%',
  TWENTY = '20%',
  THIRTY = '30%',
  FORTY = '40%',
  FIFTY = '50%',
  SIXTY = '60%',
  SEVENTY = '70%',
  EIGHTY = '80%',
  NINETY = '90%',
  HUNDRED = '100%'
}

interface VeteranProfileAttributes {
  id: string;
  userId: string;
  militaryBranch: MilitaryBranch;
  serviceStatus: ServiceStatus;
  serviceNumber?: string;
  rank?: string;
  yearsOfService?: number;
  dateEnlisted?: Date;
  dateSeparated?: Date;
  disabilityRating?: DisabilityRating;
  vaFileNumber?: string;
  tricareId?: string;
  vaFacility?: string;
  serviceConnectedConditions?: string[];
  benefits?: {
    healthcare: boolean;
    disability: boolean;
    education: boolean;
    housing: boolean;
    employment: boolean;
  };
  deployments?: Array<{
    location: string;
    startDate: Date;
    endDate: Date;
    operation?: string;
  }>;
  awards?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface VeteranProfileCreationAttributes extends Optional<VeteranProfileAttributes, 'id'> {}

class VeteranProfile extends Model<VeteranProfileAttributes, VeteranProfileCreationAttributes> implements VeteranProfileAttributes {
  public id!: string;
  public userId!: string;
  public militaryBranch!: MilitaryBranch;
  public serviceStatus!: ServiceStatus;
  public serviceNumber?: string;
  public rank?: string;
  public yearsOfService?: number;
  public dateEnlisted?: Date;
  public dateSeparated?: Date;
  public disabilityRating?: DisabilityRating;
  public vaFileNumber?: string;
  public tricareId?: string;
  public vaFacility?: string;
  public serviceConnectedConditions?: string[];
  public benefits?: {
    healthcare: boolean;
    disability: boolean;
    education: boolean;
    housing: boolean;
    employment: boolean;
  };
  public deployments?: Array<{
    location: string;
    startDate: Date;
    endDate: Date;
    operation?: string;
  }>;
  public awards?: string[];
  public emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  public metadata?: Record<string, any>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

VeteranProfile.init(
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
      onDelete: 'CASCADE',
      unique: true
    },
    militaryBranch: {
      type: DataTypes.ENUM(...Object.values(MilitaryBranch)),
      allowNull: false
    },
    serviceStatus: {
      type: DataTypes.ENUM(...Object.values(ServiceStatus)),
      allowNull: false
    },
    serviceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    rank: {
      type: DataTypes.STRING,
      allowNull: true
    },
    yearsOfService: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dateEnlisted: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    dateSeparated: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    disabilityRating: {
      type: DataTypes.ENUM(...Object.values(DisabilityRating)),
      allowNull: true
    },
    vaFileNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tricareId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vaFacility: {
      type: DataTypes.STRING,
      allowNull: true
    },
    serviceConnectedConditions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    benefits: {
      type: DataTypes.JSONB,
      defaultValue: {
        healthcare: false,
        disability: false,
        education: false,
        housing: false,
        employment: false
      }
    },
    deployments: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    awards: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    emergencyContact: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  },
  {
    sequelize,
    tableName: 'veteran_profiles',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['militaryBranch'] },
      { fields: ['serviceStatus'] }
    ]
  }
);

// Associations
User.hasOne(VeteranProfile, { foreignKey: 'userId', as: 'veteranProfile' });
VeteranProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default VeteranProfile;
