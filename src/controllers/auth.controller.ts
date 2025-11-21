// controllers/auth.controller.ts
import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/auth.services';
import { generateToken } from '../lib/jwt';
import { sendWelcomeEmail, sendAdminNotification } from '../services/email.service';

export const signup = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);

    // Generate JWT tokens
    const accessToken = generateToken({ userId: user._id }, 'access');
    const refreshToken = generateToken({ userId: user._id }, 'refresh');

    // Send welcome email to user and notification to admin (non-blocking)
    sendWelcomeEmail(user.email, user.username).catch(err =>
      console.error('Failed to send welcome email:', err)
    );
    sendAdminNotification(user.email, user.username).catch(err =>
      console.error('Failed to send admin notification:', err)
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    console.error('Signup controller error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await loginUser(req.body);

    // Generate JWT tokens
    const accessToken = generateToken({ userId: user._id }, 'access');
    const refreshToken = generateToken({ userId: user._id }, 'refresh');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    console.error('Login controller error:', error);
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};