import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  carUpdateValidationSchema,
  carValidationSchema,
} from './car.validation';
import {
  createCarController,
  deleteCarController,
  getAllCarsController,
  getSingleCarController,
  updateCarController,
} from './car.controller';

const router = Router();


//car routes
router.post(
  '/',
  validateRequest(carValidationSchema),
  createCarController,
);
router.get('/', getAllCarsController);
router.get('/:id', getSingleCarController);
router.put(
  '/:id',
  validateRequest(carUpdateValidationSchema),
  updateCarController,
);
router.delete('/:id', deleteCarController);

export const CarRoutes = router;
