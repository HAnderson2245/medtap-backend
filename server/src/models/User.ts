import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

export enum UserType {
  INDIVIDUAL = 'individual',
  PET_OWNER = 'pet_owner',
  VETERAN = 'veteran',
  PHYSICIAN = 'physician',
  INSURANCE = 'insurance',
  LEGAL = 'legal'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification'
}

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  userType: UserType;
  status: UserStatus;
  emailVerified: boolean;
  phoneNumber?: string;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'emailVerified' | 'phoneVerified' | 'twoFactorEnabled' | 'status'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public userType!: UserType;
  public status!: UserStatus;
  public emailVerified!: boolean;
  public phoneNumber?: string;
  public phoneVerified!: boolean;
  public twoFactorEnabled!: boolean;
  public lastLoginAt?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance method to compare passwords
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Hook to hash password before saving
  public static async hashPassword(user: User): Promise<void> {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS || '12'));
      user.password = await bcrypt.hash(user.password, salt);
    }
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 255]
      }
    },
    userType: {
      type: DataTypes.ENUM(...Object.values(UserType)),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(UserStatus)),
      defaultValue: UserStatus.PENDING_VERIFICATION
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: User.hashPassword,
      beforeUpdate: User.hashPassword
    }
  }
);

export default User;
