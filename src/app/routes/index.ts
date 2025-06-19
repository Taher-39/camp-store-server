import { Router } from 'express';
import { ProductRoutes } from '../modules/products/product.route';
import { UserRoute } from '../modules/user/user.route';
import { AuthRoute } from '../modules/auth/auth.route';
import { CouponRoute } from '../modules/coupon/coupon.route';
import { OrderRoute } from '../modules/order/order.route';
import { ReviewRoute } from '../modules/review/review.route';
// import { paymentRoutes } from '../modules/payment/payment.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/user',
    route: UserRoute,
  },
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/coupons',
    route: CouponRoute,
  },
  {
    path: '/orders',
    route: OrderRoute,
  },
  {
    path: '/reviews',
    route: ReviewRoute,
  },
  // {
  //   path: '/payment',
  //   route: paymentRoutes,
  // },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
