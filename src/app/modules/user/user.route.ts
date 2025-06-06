import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  userUpdateRoleOrStatusValidationSchema,
  userUpdateValidationSchema,
} from './user.validation';
import {
  deleteUserCntrl,
  getAllUsersCntrl,
  getUserByEmailCntrl,
  updateOwnProfileCntrl,
  updateUserStatusCntrl,
  updateUserRoleCntrl,
} from './user.controller';
import { USER_ROLE } from './user.constant';
import auth from '../../middlewares/auth';
const router = express.Router();

router.put(
  '/me', // Update own profile (name, phone, image)
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.MODARETOR, USER_ROLE.CUSTOMER), // All roles can access
  validateRequest(userUpdateValidationSchema),
  updateOwnProfileCntrl,
);

router.put(
  '/update-role/:userId', // Update role of another user
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), // Only Super Admin and Admin
  validateRequest(userUpdateRoleOrStatusValidationSchema),
  updateUserRoleCntrl,
);

router.put(
  '/update-status/:userId', // Update status of another user
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), // Only Super Admin and Admin
  validateRequest(userUpdateRoleOrStatusValidationSchema),
  updateUserStatusCntrl,
);

router.get('/', auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), getAllUsersCntrl);

router.get(
  '/email/:email',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER, USER_ROLE.MODARETOR),
  getUserByEmailCntrl
);


router.delete(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  deleteUserCntrl,
);

export const UserRoute = router;
