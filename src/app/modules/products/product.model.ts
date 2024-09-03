import { Schema, model } from 'mongoose';
import { TProduct } from './product.interface';

const productSchema = new Schema<TProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, required: true },
    price: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    sellCount: { type: Number, default: 0 },
    image: { type: String }
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
