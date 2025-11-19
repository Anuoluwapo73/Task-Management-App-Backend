// services/auth.service.ts
import { IAuth, ILogin } from '@src/common/interface/user-interface';
import User from '@src/models/user.model';
import { omit } from 'lodash';
import { Types } from 'mongoose';

export interface IAuthResponse extends Omit<IAuth, 'password'> {
  _id: string | Types.ObjectId;
}

export const registerUser = async (user: IAuth): Promise<IAuthResponse> => {
  try {
    console.log('🔐 Registering user:', user.email);
    
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const result = await User.create(user);
    console.log('✅ User registered successfully:', result._id);
    
    // Use the toJSON method that removes password
    const userData = result.toJSON();
    return userData as IAuthResponse;
  } catch (error: any) {
    console.error('❌ Registration error:', error.message);
    throw error;
  }
};

export const loginUser = async (user: ILogin): Promise<IAuthResponse> => {
  try {
    console.log('🔐 Attempting login for:', user.email);
    
    // Find the user
    const userExist = await User.findOne({ email: user.email });
    if (!userExist) {
      console.log('❌ User not found:', user.email);
      throw new Error('Invalid email or password');
    }

    console.log('🔑 Comparing passwords...');
    // Compare the provided password with stored password
    const isPasswordMatch = await userExist.comparePassword(user.password);

    // Return error if password does not match
    if (!isPasswordMatch) {
      console.log('❌ Password mismatch for user:', user.email);
      throw new Error('Invalid email or password');
    }

    console.log('✅ Login successful for user:', userExist._id);
    
    // Use toJSON method to remove password
    const userData = userExist.toJSON();
    return userData as IAuthResponse;
  } catch (error: any) {
    console.error('❌ Login error:', error.message);
    throw error;
  }
};