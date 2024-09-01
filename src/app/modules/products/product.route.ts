import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  ProductUpdateValidationSchema,
  ProductValidationSchema,
} from './product.validation';
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getSingleProductController,
  updateProductController,
} from './product.controller';

const router = Router();

//Product routes
router.post(
  '/',
  validateRequest(ProductValidationSchema),
  createProductController,
);
router.get('/', getAllProductsController);
router.get('/:id', getSingleProductController);
router.put(
  '/:id',
  validateRequest(ProductUpdateValidationSchema),
  updateProductController,
);
router.delete('/:id', deleteProductController);

export const ProductRoutes = router;
