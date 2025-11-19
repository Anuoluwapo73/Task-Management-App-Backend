import { login } from './../controllers/auth.controller';
import { IAuth, ILogin } from '@src/common/interface/user-interface';
import User from '@src/models/user.model';
import { omit } from 'lodash';
import { Types } from 'mongoose';

export interface IAuthResponse extends Omit<IAuth, 'password'> {
  _id: string | Types.ObjectId;
}
export const registerUser = async (user: IAuth): Promise<IAuthResponse> => {
  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  const result = await User.create(user);
  const userData = omit(result.toObject(), ['password']);
  return userData as IAuthResponse;
};
//////
export const loginUser = async (user: ILogin): Promise<IAuthResponse> => {
  //find the user
  const userExist = await User.findOne({ email: user.email });
  if (!userExist) {
    throw new Error('User not found');
  }
  const isPasswordMatch = userExist.comparePassword(userExist.password);

  //return error if password does not match
  if (!isPasswordMatch) {
    throw new Error('Invalid password');
  }
  //omit password from user object
  const userData = omit(userExist.toObject(), ['password']);

  //return user data
  return userData as IAuthResponse;
};
