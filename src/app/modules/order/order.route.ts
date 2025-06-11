import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  createOrderValidationSchema,
  orderUpdateValidationSchema,
} from './order.validation';
import {
  createOrderCntrl,
  getAllOrdersCntrl,
  getOrderCntrl,
  updateOrderCntrl,
  deleteOrderCntrl,
} from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.CUSTOMER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), 
  validateRequest(createOrderValidationSchema),
  createOrderCntrl
);

router.get('/', getAllOrdersCntrl);
router.get('/:id', getOrderCntrl);
router.patch('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), validateRequest(orderUpdateValidationSchema), updateOrderCntrl); 
router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), deleteOrderCntrl); 

export const OrderRoute = router;