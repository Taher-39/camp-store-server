import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';
import { USER_ROLE, USER_STATUS } from '../modules/user/user.constant';

const auth = (...requiredRoles: USER_ROLE[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Access denied. Invalid token',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Access denied. No token provided.',
      });
    }

    let decoded;
    // checking if the given token is valid
    try {
      decoded = jwt.verify(
        token,
        config.JWT_ACCESS_SECRET as string,
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "unothorized")
    }

    const { email, role } = decoded;

    // checking if the user is exist
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
    }

    if (user.status === USER_STATUS.BANNED || user.status === USER_STATUS.SUSPENDED) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User is banned or suspended");
    }
    if (user.role !== role) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You have no access to this route");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route',
      );
    }

    req.user = {
      _id: user._id.toString(),
      role: user.role,
      email: user.email
    } as JwtPayload;

    next();
  });
};

export default auth;