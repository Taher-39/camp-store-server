import { Order } from './order.model';
import { IOrder } from './order.interface';

export const createOrderService = async (payload: IOrder): Promise<IOrder> => {
  return await Order.create(payload);
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