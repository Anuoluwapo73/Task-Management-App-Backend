// utils/jwt.ts
import config from '../config';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface TokenPayload {
  userId: string | Types.ObjectId;
  email?: string;
}

// Keep your existing functions
export const generateWebAccessToken = (user: Types.ObjectId | string): string => {
  return jwt.sign({ user, type: 'access' }, config.ACCESS_TOKEN_SECRET!, {
    expiresIn: config.ACCESS_TOKEN_EXPIRES,
  });
};

export const generateRefreshToken = (user: Types.ObjectId | string): string => {
  return jwt.sign({ user, type: 'refresh' }, config.REFRESH_TOKEN_SECRET!, {
    expiresIn: config.REFRESH_TOKEN_EXPIRES,
  });
};

// Add the missing generateToken function that your controller imports
export const generateToken = (
  payload: TokenPayload, 
  tokenType: 'access' | 'refresh' = 'access'
): string => {
  if (tokenType === 'access') {
    return generateWebAccessToken(payload.userId);
  } else {
    return generateRefreshToken(payload.userId);
  }
};

// Add token verification utilities
export const verifyWebAccessToken = (token: string): any => {
  return jwt.verify(token, config.ACCESS_TOKEN_SECRET!);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, config.REFRESH_TOKEN_SECRET!);
};