export const ERROR_CODES = {
    USER_NOT_FOUND: { 
        code: 1001, 
        message: "User not found"
    },
    INVALID_TOKEN: { 
        code: 1002, 
        message: "Invalid Token Provided"
    },
    UNAUTHORIZED: { 
        code: 1003, 
        message: "Unauthorized Access, No token provided"
    },
    UNAUTHORIZED_ACCESS: { 
        code: 1003, 
        message: "You are not authorized to access this resource."
    },
    INTERNAL_ERROR: { 
        code: 5000, 
        message: "Something went wrong"
    },
    ADMIN_EXISTS: { 
        code: 1004, 
        message: "Can't register as Admin, Multiple Admins is Prohibited"
    },
    ADMIN_NOT_FOUND: { 
        code: 1005, 
        message: "Admin not found or doesn't exist"
    },
    OTP_EXPIRED: { 
        code: 1006, 
        message: "OTP Expired!, Pls request for an OTP"
    },
    INVALID_OTP: { 
        code: 1007, 
        message: "Invalid OTP Provided"
    },
    INVALID_CREDENTIALS: { 
        code: 1008, 
        message: "Invalid Credentials provided"
    },
    ACCOUNT_LOCKED: { 
        code: 1009, 
        message: "Account is locked due to multiple failed login attempts"
    },
    LOGIN_FAILED: { 
        code: 1010, 
        message: "Error during login"
    },
    REGISTRATION_FAILED: { 
        code: 1011, 
        message: "Error during registration"
    },
    OTP_VERIFICATION_FAILED: { 
        code: 1012, 
        message: "OTP verification failed!, Pls request for another OTP"
    },
} as const;

export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
} as const;