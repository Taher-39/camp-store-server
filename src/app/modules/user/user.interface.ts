// user.interface.ts
import { Document, Types, Model } from 'mongoose';
import {
  USER_ROLE,
  USER_STATUS,
} from './user.constant';

export interface IAddress {
  phone: string;
  country: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name?: string;
  avatar?: string;
  role: USER_ROLE;
  status: USER_STATUS;
  resetPasswordToken?: string;
  resetTokenExpires?: Date;
  passwordChangedAt?: Date;
  isDeleted: boolean;

  // E-commerce specific fields
  addresses?: IAddress[];
  lastLogin?: Date;
  // for email verification
  verificationCode?: string,
  verificationCodeExpires?: Date,
  isVerified?: boolean
  verificationCooldownUntil?: Date,

}

export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
