import { Document, Model, Types } from 'mongoose';

export interface IOrderItem {
  name: string;
  image: string;
  quantity: number;
  price: number; 
  productId: Types.ObjectId;
}

export interface IOrder extends Document {
  userId?: Types.ObjectId; // Optional: User associated with the order (if logged in)
  orderItems: IOrderItem[];
  name: string;
  shippingAddress: {
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
  };
  couponCodeUsed?: string; // Optional: Coupon code used for the order
  note?: string;
  subtotal: number;
  shipping?: string
  shippingCost: number;
  totalPrice: number;
  paymentMethod: string; // e.g., "COD", "Online Payment"
  orderStatus: string; // e.g., "Pending", "Processing", "Shipped", "Delivered", "Cancelled"
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderModel extends Model<IOrder> {}