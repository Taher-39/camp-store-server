import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  ProductUpdateValidationSchema,
  ProductValidationSchema,
  updateSalesAndStockValidationSchema,
} from './product.validation';
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getBestSellingProductsController,
  getSingleProductController,
  updateProductController,
  updateProductSalesAndStockController,
} from './product.controller';

const router = Router();

//Product routes
router.post(
  '/',
  validateRequest(ProductValidationSchema),
  createProductController,
);
router.post(
  '/update-sales-and-stock',
  validateRequest(updateSalesAndStockValidationSchema),
  updateProductSalesAndStockController,
);
router.get('/', getAllProductsController);
router.get('/best-selling-products', getBestSellingProductsController);
router.get('/:id', getSingleProductController);
router.put(
  '/:id',
  validateRequest(ProductUpdateValidationSchema),
  updateProductController,
);
router.delete('/:id', deleteProductController);

export const ProductRoutes = router;
