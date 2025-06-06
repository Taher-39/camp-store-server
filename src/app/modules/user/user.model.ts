// user.model.ts
import { Schema, model } from 'mongoose';
import {
  USER_ROLE,
  USER_STATUS,
} from './user.constant';
import { IUser, UserModel, IAddress } from './user.interface';
import bcrypt from "bcryptjs";
import config from '../../config';

// Address Schema
const addressSchema = new Schema<IAddress>({
  phone: { type: String, required: true },
  country: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false}
});

// Main User Schema
const userSchema = new Schema<IUser, UserModel>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    name: { type: String },
    avatar: { type: String },
    role: { 
      type: String, 
      enum: Object.values(USER_ROLE), 
      default: USER_ROLE.CUSTOMER 
    },
    status: { 
      type: String, 
      enum: Object.values(USER_STATUS), 
      default: USER_STATUS.ACTIVE 
    },    
    resetPasswordToken: { type: String },
    resetTokenExpires: { type: Date },
    passwordChangedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },

    // E-commerce specific fields
    addresses: [addressSchema],
    lastLogin: { type: Date },
    // for email veryfication 

    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    verificationCooldownUntil: {type: Date, index: true},
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Pre-save hook for password hashing
userSchema.pre('save', async function (next) {
    // Type assertion needed because 'this' in Mongoose hooks has special typing
    const user = this as unknown as IUser & { isModified: (field: string) => boolean };
  
    // Only hash password if it's modified (or new)
    if (!user.isModified('password')) {
      return next();
    }
  
    try {
      user.password = await bcrypt.hash(user.password, Number(config.BCRYPT_SALT_ROUNDS));
      next();
    } catch (error) {
      next(error as Error);
    }
  });
  
  // Post-save hook to clear password in returned document
  userSchema.post('save', function (doc: IUser, next) {
    doc.password = undefined as unknown as string; // Safer than empty string
    next();
  });
  
  // Static methods
  userSchema.statics.isUserExistsByCustomId = async function (id: string): Promise<IUser | null> {
    return await this.findOne({ _id: id }).select('+password');
  };
  
  userSchema.statics.isPasswordMatched = async function (
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  };
  
  userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
    passwordChangedTimestamp: Date | undefined,
    jwtIssuedTimestamp: number,
  ): boolean {
    if (!passwordChangedTimestamp) return false;
    const passwordChangedTime = passwordChangedTimestamp.getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
  };
  
  // Instance method
  userSchema.methods.incrementLoginCount = function (): Promise<void> {
    return this.updateOne({ $inc: { loginCount: 1 } }).exec();
  };
  
  export const User = model<IUser, UserModel>('User', userSchema);