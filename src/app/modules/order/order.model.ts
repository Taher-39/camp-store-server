import mongoose, { Schema, model } from "mongoose";
import { IOrder } from "./order.interface";
import { ORDER_STATUS, Payment_Type } from "../user/user.constant";

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    orderItems: [
      {
        name: String,
        image: String,
        price: Number,
        quantity: Number,
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
      },
    ],
    name: {
      type: String,
      required: true,
    },
    shippingAddress: {
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: false },
    },
    couponCodeUsed: String,
    note: String,
    subtotal: {
      type: Number,
      required: true,
    },
    shipping: {
      type: String,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(Payment_Type),
      default: Payment_Type.CASH_ON_DELIVERY,
    },
    orderStatus: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    }
  },
  {
    timestamps: true,
  },
);

export const Order = mongoose.models.Order || model<IOrder>("Order", OrderSchema);
