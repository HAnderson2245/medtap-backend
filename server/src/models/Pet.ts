import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export enum PetType {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird',
  RABBIT = 'rabbit',
  HAMSTER = 'hamster',
  GUINEA_PIG = 'guinea_pig',
  REPTILE = 'reptile',
  FISH = 'fish',
  HORSE = 'horse',
  OTHER = 'other'
}

export enum PetGender {
  MALE = 'male',
  FEMALE = 'female',
  NEUTERED_MALE = 'neutered_male',
  SPAYED_FEMALE = 'spayed_female'
}

interface PetAttributes {
  id: string;
  ownerId: string;
  name: string;
  petType: PetType;
  breed?: string;
  gender: PetGender;
  dateOfBirth?: Date;
  weight?: number;
  color?: string;
  microchipId?: string;
  veterinarian?: string;
  vetClinicName?: string;
  vetPhone?: string;
  allergies?: string[];
  medications?: string[];
  chronicConditions?: string[];
  vaccinations?: Array<{
    name: string;
    date: Date;
    nextDueDate?: Date;
  }>;
  photos?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  isLost: boolean;
  lostDetails?: {
    lastSeenDate: Date;
    lastSeenLocation: string;
    description: string;
  };
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PetCreationAttributes extends Optional<PetAttributes, 'id' | 'isLost'> {}

class Pet extends Model<PetAttributes, PetCreationAttributes> implements PetAttributes {
  public id!: string;
  public ownerId!: string;
  public name!: string;
  public petType!: PetType;
  public breed?: string;
  public gender!: PetGender;
  public dateOfBirth?: Date;
  public weight?: number;
  public color?: string;
  public microchipId?: string;
  public veterinarian?: string;
  public vetClinicName?: string;
  public vetPhone?: string;
  public allergies?: string[];
  public medications?: string[];
  public chronicConditions?: string[];
  public vaccinations?: Array<{
    name: string;
    date: Date;
    nextDueDate?: Date;
  }>;
  public photos?: string[];
  public emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  public isLost!: boolean;
  public lostDetails?: {
    lastSeenDate: Date;
    lastSeenLocation: string;
    description: string;
  };
  public metadata?: Record<string, any>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Pet.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    petType: {
      type: DataTypes.ENUM(...Object.values(PetType)),
      allowNull: false
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(PetGender)),
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    microchipId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    veterinarian: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vetClinicName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vetPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    allergies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    medications: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    chronicConditions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    vaccinations: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    photos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    emergencyContact: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    isLost: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lostDetails: {
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
    tableName: 'pets',
    timestamps: true,
    indexes: [
      { fields: ['ownerId'] },
      { fields: ['petType'] },
      { fields: ['microchipId'] },
      { fields: ['isLost'] }
    ]
  }
);

// Associations
User.hasMany(Pet, { foreignKey: 'ownerId', as: 'pets' });
Pet.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

export default Pet;
