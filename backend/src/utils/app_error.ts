export class app_error extends Error {
    public statusCode: number;
    public errorCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number, errorCode: number, isOperational: true) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;
        
        Error.captureStackTrace(this, this.constructor);
    }
}