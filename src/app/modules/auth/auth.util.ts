import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import type ms from 'ms';

export const isPasswordMatched = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatched = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatched;
};

export const createToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
  expiresIn: string
): string => {
  const signOptions: SignOptions = {
    expiresIn: expiresIn as ms.StringValue, 
  };

  return jwt.sign(jwtPayload, secret, signOptions);
};



export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
