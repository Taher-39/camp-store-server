import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import {
  deleteUserService,
  getAllUsersService,
  getUserByEmailService,
  updateOwnProfileService,
  updateUserRoleService,
  updateUserStatusService,
} from './user.service';
import sendResponse from '../../utils/sendResponse';

export const updateOwnProfileCntrl = catchAsync(async (req, res) => {
  const userId = req.user._id; // Logged in user's ID
  const result = await updateOwnProfileService(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile updated successfully!',
    data: result,
  });
});

export const updateUserRoleCntrl = catchAsync(async (req, res) => {
  const { userId } = req.params; // User ID to update
  const requestingUserRole = req.user.role; // Role of the requesting user
  const requestingUserId = req.user._id; // ID of the requesting user (logged-in user)

  const result = await updateUserRoleService(
    userId,
    req.body,
    requestingUserRole,
    requestingUserId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User role updated successfully!',
    data: result,
  });
});

export const updateUserStatusCntrl = catchAsync(async (req, res) => {
  const { userId } = req.params; // User ID to update
  const requestingUserRole = req.user.role; // Status of the requesting user
  const requestingUserId = req.user._id; // ID of the requesting user (logged-in user)

  const result = await updateUserStatusService(
    userId,
    req.body,
    requestingUserRole,
    requestingUserId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User status updated successfully!',
    data: result,
  });
});

export const getAllUsersCntrl = catchAsync(async (req, res) => {
  const users = await getAllUsersService();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users GET successfully!',
    data: users,
  });
});

export const getUserByEmailCntrl = catchAsync(async (req, res) => {
  const { email } = req.params;
  const user = await getUserByEmailService(email);

  sendResponse(res, {
    statusCode: user ? httpStatus.OK : httpStatus.NOT_FOUND,
    success: !!user,
    message: user ? 'User GET successfully!' : 'User not found',
    data: user || null,
  });
});

export const deleteUserCntrl = catchAsync(async (req, res) => {
  const user = await deleteUserService(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User DELETE successfully!',
    data: user,
  });
});
