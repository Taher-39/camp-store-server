import { Router } from 'express';
import { ProductRoutes } from '../modules/products/product.route';
import { UserRoute } from '../modules/user/user.route';
import { AuthRoute } from '../modules/auth/auth.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
