import { generateRefreshToken, generateWebAccessToken } from '@src/lib/jwt';
import { loginUser, registerUser } from '@src/services/auth.services';
import { Request, Response } from 'express';

//sign up
export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await registerUser({ username, email, password });
    //generate tokens
    const accessToken = generateWebAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res
      .status(201)
      .json({ message: 'User registered successfully', user, accessToken, refreshToken });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error, Error signing up user, Please try again' });
    console.log('Error signing up user', error);
  }
};

//login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await loginUser({ email, password });
    //generate tokens
    const accessToken = generateWebAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res
      .status(200)
      .json({ message: 'User logged in successfully', user, accessToken, refreshToken });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error, Error logging in user, Please try again' });
    console.log('Error logging in user', error);
  }
};

//logout
export const logout = async (_req: Request, _res: Response) => { };

//get user
export const getUser = async (_req: Request, _res: Response) => { };

//refresh token
export const refreshToken = async (_req: Request, _res: Response) => { };
