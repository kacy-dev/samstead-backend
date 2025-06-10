import { Request, Response } from 'express';
import { Plan }from '../../models/products/plan_model';
import User from '../../models/auth/User_model';
import { STATUS_CODES, ERROR_CODES } from '../../utils/error_codes';

// Create Plan
export const createPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, monthlyPrice, yearlyPrice, paystackMonthlyCode, paystackYearlyCode, features } = req.body;


    console.log(req.body);

    const adminId = req.admin?._id;
    if (!adminId) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: ERROR_CODES.UNAUTHORIZED_ACCESS.message,
        code: ERROR_CODES.UNAUTHORIZED_ACCESS.code,
      });
      return;
    }

    if (!name || !monthlyPrice || !yearlyPrice || !paystackMonthlyCode || !paystackYearlyCode || !description || !features) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'All fields are required: name, description, prices, Paystack codes, features.',
        code: ERROR_CODES.MISSING_FIELDS.code,
      });
      return;
    }

    const existing = await Plan.findOne({ name });
    if (existing) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: ERROR_CODES.PLAN_ALREADY_EXISTS.message,
        code: ERROR_CODES.PLAN_ALREADY_EXISTS.code,
      });
      return;
    }

    const newPlan = await Plan.create({
      name,
      description,
      monthlyPrice,
      yearlyPrice,
      paystackMonthlyCode,
      paystackYearlyCode,
      features,
      createdBy: adminId,
    });

    console.log(newPlan)

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: 'Plan created successfully',
      plan: newPlan,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code,
    });
  }
};

// Get All Plans
export const getAllPlans = async (_req: Request, res: Response): Promise<void> => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });

    res.status(STATUS_CODES.OK).json({
      success: true,
      plans,
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code,
    });
  }
};

// Get Plan by ID
export const getPlanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planId } = req.params;
    const plan = await Plan.findById(planId);

    if (!plan) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Plan not found',
        code: ERROR_CODES.PLAN_NOT_FOUND.code,
      });
      return;
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      plan,
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code,
    });
  }
};

// Update Plan
export const updatePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planId } = req.params;
    const { name, description, monthlyPrice, yearlyPrice, paystackMonthlyCode, paystackYearlyCode, features } = req.body;

    const updated = await Plan.findByIdAndUpdate(
      planId,
      { name, description, monthlyPrice, yearlyPrice, paystackMonthlyCode, paystackYearlyCode, features },
      { new: true }
    );

    if (!updated) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Plan not found',
        code: ERROR_CODES.PLAN_NOT_FOUND.code,
      });
      return;
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Plan updated successfully',
      plan: updated,
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code,
    });
  }
};

// Delete Plan
export const deletePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planId } = req.params;
    const deleted = await Plan.findByIdAndDelete(planId);

    if (!deleted) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Plan not found',
        code: ERROR_CODES.PLAN_NOT_FOUND.code,
      });
      return;
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Plan deleted successfully',
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_CODES.INTERNAL_ERROR.message,
      code: ERROR_CODES.INTERNAL_ERROR.code,
    });
  }
};
