import { Document, Types } from 'mongoose';

export interface IReview extends Document {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment: string;
  images?: string[];
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}