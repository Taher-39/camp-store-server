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
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

//Product routes
router.post(
  '/',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.MODARETOR),
  validateRequest(ProductValidationSchema),
  createProductController,
);
router.post(
  '/update-sales-and-stock',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.MODARETOR),
  validateRequest(updateSalesAndStockValidationSchema),
  updateProductSalesAndStockController,
);
router.get('/', getAllProductsController);
router.get('/best-selling-products', getBestSellingProductsController);
router.get('/:id', getSingleProductController);
router.put(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.MODARETOR),
  validateRequest(ProductUpdateValidationSchema),
  updateProductController,
);
router.delete(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.MODARETOR),
  deleteProductController,
);

export const ProductRoutes = router;
