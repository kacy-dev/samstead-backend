import { Request, Response } from 'express';
import Plan from '../../models/products/plan_model';
import { STATUS_CODES, ERROR_CODES } from '../../utils/error_codes';

export const createPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, prices, benefits } = req.body;

    // Ensure the authenticated admin is passed via middleware (req.admin)
    const adminId = req.admin?._id;
    if (!adminId) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: ERROR_CODES.UNAUTHORIZED_ACCESS.message,
        code: ERROR_CODES.UNAUTHORIZED_ACCESS.code,
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
      prices,
      benefits,
      createdBy: adminId,
    });

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
  

  
  export const getPlanById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { planId } = req.params;
      const plan = await Plan.findById(planId);
  
      if (!plan) {
        res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: 'Plan not found',
          code: 1102,
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
  

  export const updatePlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const { planId } = req.params;
      const { name, description, prices, benefits } = req.body;
  
      const updated = await Plan.findByIdAndUpdate(
        planId,
        { name, description, prices, benefits },
        { new: true }
      );
  
      if (!updated) {
        res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: 'Plan not found',
          code: 1102,
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
  

  export const deletePlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const { planId } = req.params;
      const deleted = await Plan.findByIdAndDelete(planId);
  
      if (!deleted) {
        res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: 'Plan not found',
          code: 1102,
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
