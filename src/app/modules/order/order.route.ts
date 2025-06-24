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
  getOrdersByUserIdCntrl,
  // addMoney,
  // paymentSuccess,
  // paymentFail,
} from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.CUSTOMER),
  validateRequest(createOrderValidationSchema),
  createOrderCntrl,
);

router.get(
  '/single-user-orders',
  auth(USER_ROLE.CUSTOMER), // Adjust roles as needed
  getOrdersByUserIdCntrl,
);

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.MODARETOR),
  getAllOrdersCntrl,
);
router.get(
  '/:id',
  auth(
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.CUSTOMER,
    USER_ROLE.MODARETOR,
  ),
  getOrderCntrl,
);
router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.MODARETOR),
  validateRequest(orderUpdateValidationSchema),
  updateOrderCntrl,
);
router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.MODARETOR),
  deleteOrderCntrl,
);

// router.post("/addMoney", addMoney);
// router.post("/success", paymentSuccess);
// router.post("/fail", paymentFail);

export const OrderRoute = router;
