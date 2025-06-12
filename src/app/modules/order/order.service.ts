import { Order } from './order.model';
import { IOrder } from './order.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

export const createOrderService = async (payload: IOrder): Promise<IOrder> => {
  return await Order.create(payload);
};

export const getOrdersByUserIdService = async (userId: string): Promise<IOrder[]> => {
  const orders = await Order.find({ userId: userId })
  if (!orders || orders.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No orders found for this user');
  }

  return orders;
};


export const getAllOrdersService = async (): Promise<IOrder[]> => {
  return await Order.find().populate('userId').populate('orderItems.productId'); // Populate user and product details
};

export const getOrderService = async (id: string): Promise<IOrder | null> => {
  return await Order.findById(id).populate('userId').populate('orderItems.productId');
};

export const updateOrderService = async (
  id: string,
  payload: Partial<IOrder>
): Promise<IOrder | null> => {
  return await Order.findByIdAndUpdate(id, payload, { new: true }).populate('userId').populate('orderItems.productId');
};

export const deleteOrderService = async (id: string): Promise<void> => {
  await Order.findByIdAndDelete(id);
};