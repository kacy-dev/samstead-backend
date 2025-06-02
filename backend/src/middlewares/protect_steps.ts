import { Request, Response, NextFunction } from 'express';
import User from '../models/auth/User_model';
import { STATUS_CODES, ERROR_CODES } from '../utils/error_codes';

export const ensureVerified = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userData) {
      const user = await User.findById(req.user?.id);
      if (!user?.isActive) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
          code: ERROR_CODES.UNAUTHORIZED.code,
          message: 'Verify your account before proceeding.',
        });
      }
      req.userData = user;
    }
    next();
  };
  

  export const ensurePlanSelected = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.userData ?? await User.findById(req.user?.id);
    if (!user?.selectedPlan) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        code: ERROR_CODES.UNAUTHORIZED.code,
        message: 'Select a subscription plan before making payment.',
      });
    }
    req.userData = user;
    next();
  };
  
  export const ensurePaymentComplete = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.userData ?? await User.findById(req.user?.id);
    if (!user?.isPaid) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        code: ERROR_CODES.UNAUTHORIZED.code,
        message: 'Complete your payment to continue.',
      });
    }
    req.userData = user;
    next();
  };


export const checkOnboardingComplete = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).select('+isActive +selectedPlan +isPaid');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        message: 'Please verify your email with OTP before proceeding.',
        success: false,
      });
    }

    if (!user.selectedPlan) {
      return res.status(401).json({
        message: 'Please select a subscription plan to continue.',
        nextStep: 'subscription-selection',
        success: false,
      });
    }

    if (!user.isPaid) {
      return res.status(401).json({
        message: 'Payment for the selected plan is required.',
        nextStep: 'payment-verification',
        success: false,
      });
    }

    // All checks passed, proceed to login
    next();
  } catch (error) {
    console.error('Onboarding middleware error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

  
