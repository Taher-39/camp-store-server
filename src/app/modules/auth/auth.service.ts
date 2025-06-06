import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TSingnin } from './auth.interface';
import config from '../../config';
import jwt from 'jsonwebtoken';
import { IUser } from '../user/user.interface';
import crypto from 'crypto';
import { USER_ROLE, USER_STATUS } from '../user/user.constant';
import { createToken, isPasswordMatched, verifyToken } from './auth.util';
import { transporter } from '../../utils/mailTransporter';
import nodemailer from 'nodemailer';
import { sendVerificationEmail } from '../../utils/sendVerificationEmail';


export const registerAndSendVerificationService = async (payload: IUser): Promise<IUser> => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) throw new AppError(httpStatus.CONFLICT, 'Email already registered');

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const verificationCodeExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 min
  const cooldown = new Date(Date.now() + 2 * 60 * 1000); // 2 min

  const user = await User.create({
    ...payload,
    role: USER_ROLE.CUSTOMER,
    verificationCode: code,
    verificationCodeExpires,
    verificationCooldownUntil: cooldown,
    isVerified: false
  });
  await sendVerificationEmail(user.email, code);
  return user;
};


//send verification code into registered email
export const verifyUserByEmailCodeService = async (email: string, code: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  if (user.isVerified) throw new AppError(httpStatus.BAD_REQUEST, 'User already verified');

  if (user.verificationCode !== code) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid code');
  if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Verification code expired');
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  return user;
};

export const resendVerificationCodeService = async (email: string) => {
  if (!email) throw new AppError(httpStatus.BAD_REQUEST, 'Email is required');

  const user = await User.findOne({ email });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  if (user.isVerified) throw new AppError(httpStatus.BAD_REQUEST, 'User already verified');

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationCodeExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
  const cooldown = new Date(Date.now() + 2 * 60 * 1000); // optional cooldown tracking

  user.verificationCode = code;
  user.verificationCodeExpires = verificationCodeExpires;
  user.verificationCooldownUntil = cooldown;
  await user.save();

  await sendVerificationEmail(email, code);

  return { email, codeSent: true };
};

export const signInService = async (payload: TSingnin) => {
  const user = (await User.findOne({ email: payload.email }).select(
    '+password',
  )) as IUser;

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (
    user.status === USER_STATUS.BANNED ||
    user.status === USER_STATUS.SUSPENDED
  ) {
    const statusText =
      user.status === USER_STATUS.BANNED ? 'banned' : 'suspended';
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${statusText}`);
  }

  const passwordMatch = await isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!passwordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password not matched');
  }

  const jwtPayload = {
    email: user.email as string,
    role: user.role as string,
  };
  
  const accessToken = jwt.sign(
    jwtPayload,
    config.JWT_ACCESS_SECRET,
    { expiresIn: '30d' } 
  );

  const refreshToken = jwt.sign(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    {
      expiresIn: '365d' ,
    },
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const changePasswordService = async (
  email: string,
  oldPassword: string,
  newPassword: string,
) => {
  // Find the user by email
  const user = (await User.findOne({ email }).select('+password')) as IUser;
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (
    user.status === USER_STATUS.BANNED ||
    user.status === USER_STATUS.SUSPENDED
  ) {
    const statusText =
      user.status === USER_STATUS.BANNED ? 'banned' : 'suspended';
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${statusText}`);
  }

  // Check if the old password is correct
  const isOldPasswordValid = await isPasswordMatched(
    oldPassword,
    user.password,
  );
  if (!isOldPasswordValid) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old password is incorrect');
  }

  // Update user's password
  user.password = newPassword;
  await user.save();

  return { message: 'Password changed successfully!' };
};


// Generate Token
export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User with this email does not exist',
    );
  }

  // Generate a password reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Save token and expiry time in the user model
  user.resetPasswordToken = tokenHash;
  user.resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // Token expires in 10 minutes
  await user.save();

  // Send reset link via email
  const resetUrl = `http://localhost:5173/resetPassword/${resetToken}`; //need replace with hosted client
  const message = `Click this link to reset your password: ${resetUrl}`;

  await transporter.sendMail({
    to: user.email,
    from: config.GMAIL,
    subject: 'Password Reset',
    text: message,
  });

  return {
    message: 'Password reset email sent!',
  };
};

// Reset Password Service
export const resetPasswordService = async (
  token: string,
  newPassword: string,
) => {
  // Hash the token and find the user by token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetTokenExpires: { $gt: Date.now() }, // Ensure the token is not expired
  });

  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Token is invalid or has expired',
    );
  }

  // Update password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  return {
    message: 'Password reset successfully!',
  };
};

export const refreshTokenService = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.JWT_REFRESH_SECRET as string);

  const { email, iat } = decoded;

  // checking if the user is exist
  const user = (await User.findOne({ email }).select('+password')) as IUser;
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (
    user.status === USER_STATUS.BANNED ||
    user.status === USER_STATUS.SUSPENDED
  ) {
    const statusText =
      user.status === USER_STATUS.BANNED ? 'banned' : 'suspended';
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${statusText}`);
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string,
  );

  return {
    accessToken,
  };
};
