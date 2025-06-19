import { Schema, model } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>(
  {
    productId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5 
    },
    comment: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 1000 
    },
    images: [{ 
      type: String 
    }],
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Review = model<IReview>('Review', reviewSchema);