import httpStatus from "http-status";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errors/AppError";
import { USER_ROLE } from "./user.constant";

export const updateOwnProfileService = async (_id: string, payload: Partial<IUser>) => {
  const user = await User.findById(_id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Update only name, phone, avater and address
  const updateData = {
    ...(payload.name && { name: payload.name }),
    ...(payload.avatar && { avatar: payload.avatar }),
    ...(payload.addresses && { addresses: payload.addresses }),
  };

  const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });
  return updatedUser;
};

export const updateUserStatusService = async (
  _id: string,
  payload: Partial<IUser>,
  requestingUserRole: string,
  requestingUserId: string // ID of the requesting user (Super Admin or Admin)
) => {
  const user = await User.findById(_id); // Target user (the one being modified)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Admin cannot modify Super Admin
  if (requestingUserRole === USER_ROLE.ADMIN && user.role === USER_ROLE.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "Admin cannot modify Super Admin");
  }

  // Prevent Super Admin from modifying their own Status or status
  if (requestingUserRole === USER_ROLE.SUPER_ADMIN && requestingUserId === user._id.toString()) {
    if (payload.status) {
      throw new AppError(httpStatus.FORBIDDEN, "Super Admin cannot change their own Status");
    }
  }

  // Only allow updating Status and status fields for other users
  const updateData = {
    ...(payload.status && { status: payload.status })
  };

  const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });
  return updatedUser;
};

export const updateUserRoleService = async (
  _id: string,
  payload: Partial<IUser>,
  requestingUserRole: string,
  requestingUserId: string // ID of the requesting user (Super Admin or Admin)
) => {
  const user = await User.findById(_id); // Target user (the one being modified)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  // Admin cannot modify Super Admin
  if (requestingUserRole === USER_ROLE.ADMIN && user.role === USER_ROLE.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "Admin cannot modify Super Admin");
  }

  // Prevent Super Admin from modifying their own role or status
  if (requestingUserRole === USER_ROLE.SUPER_ADMIN && requestingUserId === user._id.toString()) {
    if (payload.role) {
      throw new AppError(httpStatus.FORBIDDEN, "Super Admin cannot change their own role");
    }
  }

  // Only allow updating role and status fields for other users
  const updateData = {
    ...(payload.role && { role: payload.role })
  };

  const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });
  return updatedUser;
};

export const getAllUsersService = async () => {
  return await User.find({isDeleted: false});
};

export const getUserByEmailService = async (email: string) => {
  return await User.findOne({ email });
};

export const deleteUserService = async (_id: string) => {
  const user = await User.findById(_id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,"User not found");
  }

  if (user.role === USER_ROLE.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN,"Super Admin cannot be deleted");
  }

  return await User.findByIdAndUpdate(_id, { isDeleted: true });
};
