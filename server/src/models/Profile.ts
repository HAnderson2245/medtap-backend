import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-'
}

interface ProfileAttributes {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: Gender;
  height?: number; // in cm
  weight?: number; // in kg
  bloodType?: BloodType;
  allergies?: string[];
  chronicConditions?: string[];
  medications?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  primaryCarePhysician?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  profilePicture?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProfileCreationAttributes extends Optional<ProfileAttributes, 'id'> {}

class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
  public id!: string;
  public userId!: string;
  public firstName!: string;
  public lastName!: string;
  public dateOfBirth?: Date;
  public gender?: Gender;
  public height?: number;
  public weight?: number;
  public bloodType?: BloodType;
  public allergies?: string[];
  public chronicConditions?: string[];
  public medications?: string[];
  public emergencyContactName?: string;
  public emergencyContactPhone?: string;
  public emergencyContactRelation?: string;
  public primaryCarePhysician?: string;
  public insuranceProvider?: string;
  public insurancePolicyNumber?: string;
  public profilePicture?: string;
  public address?: string;
  public city?: string;
  public state?: string;
  public zipCode?: string;
  public country?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Profile.init(
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(Gender)),
      allowNull: true
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    bloodType: {
      type: DataTypes.ENUM(...Object.values(BloodType)),
      allowNull: true
    },
    allergies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    chronicConditions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    medications: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    emergencyContactName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emergencyContactPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emergencyContactRelation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    primaryCarePhysician: {
      type: DataTypes.STRING,
      allowNull: true
    },
    insuranceProvider: {
      type: DataTypes.STRING,
      allowNull: true
    },
    insurancePolicyNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: 'USA'
    }
  },
  {
    sequelize,
    tableName: 'profiles',
    timestamps: true
  }
);

// Associations
User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Profile;
