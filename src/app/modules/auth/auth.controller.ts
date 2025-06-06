import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import validator from 'validator';
import {
  changePasswordService,
  forgotPasswordService,
  resetPasswordService,
  signInService,
  refreshTokenService,
  verifyUserByEmailCodeService,
  registerAndSendVerificationService,
  resendVerificationCodeService,
} from './auth.service';
import config from '../../config';
import AppError from '../../errors/AppError';


export const registerController = catchAsync(async (req, res) => {
  const user = await registerAndSendVerificationService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User registered. Verification code sent to email.',
    data: user,
  });
});

export const verifyEmailController = catchAsync(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !validator.isEmail(email)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'একটি বৈধ ইমেইল প্রয়োজন');
  }

  const user = await verifyUserByEmailCodeService(email, code);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Email verified successfully.',
    data: user,
  });
});

export const resendVerificationCodeController = catchAsync(async (req, res) => {
  const { email } = req.body;

  const result = await resendVerificationCodeService(email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Verification code resent successfully.',
    data: result,
  });
});


export const signInController = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await signInService(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User is logged in succesfully!',
    data: {
      accessToken,
    },
  });
});

export const changePasswordController = catchAsync(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  const result = await changePasswordService(email, oldPassword, newPassword);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: '',
  });
});

// Forgot Password Controller
export const forgotPasswordController = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await forgotPasswordService(email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: '',
  });
});
// Reset Password Controller
export const resetPasswordController = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await resetPasswordService(token, newPassword);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: '',
  });
});

export const refreshTokenController = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await refreshTokenService(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
});
