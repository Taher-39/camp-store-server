import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {
  createProduct,
  getAllProducts,
  getBestSellingProducts,
  getProductById,
  softDeleteProduct,
  updateProduct,
  updateProductSalesAndStock,
} from './product.service';

export const createProductController = catchAsync(async (req, res) => {
  const result = await createProduct(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Product created successfully',
    data: result,
  });
});

export const getAllProductsController = catchAsync(async (req, res) => {
  const result = await getAllProducts();
  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      statusCode: 404,
      message: 'No Data Found',
      data: [],
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    data: result,
  });
});

export const getSingleProductController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getProductById(id);

  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      statusCode: 404,
      message: 'No Data Found',
      data: [],
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'A Product retrieved successfully',
    data: result,
  });
});

export const getBestSellingProductsController = catchAsync(async (req, res) => {
  const result = await getBestSellingProducts();
  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      statusCode: 404,
      message: 'No Data Found',
      data: [],
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Best selling products retrieved successfully',
    data: result,
  });
});

export const updateProductController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updateProduct(id, req.body);
  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      statusCode: 404,
      message: 'No Data Found',
      data: [],
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

export const updateProductSalesAndStockController = catchAsync(async (req, res) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: 400,
      message: 'Invalid products array.',
    });
  }

  try {
    const result = await updateProductSalesAndStock(products);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product sales and stock updated successfully.',
      data: result,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: 500,
      message: 'Failed to update product sales and stock.',
      error: error,
    });
  }
});


export const deleteProductController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await softDeleteProduct(id);
  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      statusCode: 404,
      message: 'No Data Found',
      data: [],
    });
  }
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product deleted successfully',
    data: result,
  });
});





