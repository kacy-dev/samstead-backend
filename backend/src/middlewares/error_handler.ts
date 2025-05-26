import { Request, Response, NextFunction } from 'express';
import { app_error } from '../utils/app_error';
import { ERROR_CODES, STATUS_CODES } from '../utils/error_codes';


export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof app_error) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.errorCode
        });
    }

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_CODES.INTERNAL_ERROR.message,
        code: ERROR_CODES.INTERNAL_ERROR.code
    });
}