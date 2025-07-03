import { Schema, model } from 'mongoose';
import { TProduct } from './product.interface';

const productSchema = new Schema<TProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    weight: { type: Number, required: true },
    status: { type: String, required: true },
    price: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    sellCount: { type: Number, default: 0 },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: 'At least one image is required',
      },
    },
  },
  {
    timestamps: true,
  },
);

// remove __v
productSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Product = model<TProduct>('Product', productSchema);
export default Product;
