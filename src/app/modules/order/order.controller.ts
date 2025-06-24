import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import {
  createOrderService,
  getAllOrdersService,
  getOrderService,
  updateOrderService,
  deleteOrderService,
  getOrdersByEmailService,
} from './order.service';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';

export const createOrderCntrl = catchAsync(async (req, res) => {
  let updateOrderInfo = { ...req.body };
  updateOrderInfo.email = req.user.email;

  const result = await createOrderService(updateOrderInfo);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Order created successfully!',
    data: result,
  });
});

export const getOrdersByUserIdCntrl = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }
  const email = req.user.email;
  const orders = await getOrdersByEmailService(email);
  const sortedOrders = [...orders].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Orders retrieved successfully!',
    data: sortedOrders,
  });
});

export const getAllOrdersCntrl = catchAsync(async (req, res) => {
  const result = await getAllOrdersService();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Orders retrieved successfully!',
    data: result,
  });
});

export const getOrderCntrl = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getOrderService(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order retrieved successfully!',
    data: result,
  });
});

export const updateOrderCntrl = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updateOrderService(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order updated successfully!',
    data: result,
  });
});

export const deleteOrderCntrl = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteOrderService(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order deleted successfully!',
    data: null,
  });
});
