import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import {
  createOrderService,
  getAllOrdersService,
  getOrderService,
  updateOrderService,
  deleteOrderService,
} from './order.service';
import sendResponse from '../../utils/sendResponse';

export const createOrderCntrl = catchAsync(async (req, res) => {
  const { userId } = req.user || {}; // Get userId from request (if logged in)
  const orderData = { ...req.body };

  // If a user is logged in, attach the userId to the order data
  if (userId) {
    orderData.userId = userId;
  }
  
  const result = await createOrderService(orderData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Order created successfully!',
    data: result,
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