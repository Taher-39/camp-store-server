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
import { transporter } from '../../utils/mailTransporter';
import config from '../../config';

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

export const submitContactCntrl = catchAsync(async (req, res) => {
  const { name, email, message } = req.body;

  // Send email to admin
  await transporter.sendMail({
    from: config.GMAIL,
    to: 'taherpust@gmail.com',
    subject: 'New Contact Form Submission',
    html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
  });

    // Send confirmation to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'আমাদের সঙ্গে যোগাযোগ করার জন্য ধন্যবাদ',
      html: `
    <h2>ধন্যবাদ, ${name}!</h2>
    <p>আমরা আপনার বার্তাটি পেয়েছি এবং খুব শীঘ্রই আপনার সাথে যোগাযোগ করবো।</p>
    <p><strong>আপনার বার্তা:</strong></p>
    <p>${message}</p>
  `,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Contact submitted successfully!',
    data: '',
  });
});
