export const ERROR_CODES = {
    USER_NOT_FOUND: { code: 1001, message: "User not found" },
    INVALID_TOKEN: { code: 1002, message: "Invalid Token Provided" },
    UNAUTHORIZED: { code: 1003, message: "Unauthorized Access, No token provided" },
    UNAUTHORIZED_ACCESS: { code: 1003, message: "You are not authorized to access this resource." },
    USER_EXISTS: { code: 1004, message: "User with the credentials already exists" },
    ADMIN_EXISTS: { code: 1005, message: "Can't register as Admin, Multiple Admins is Prohibited" },
    ADMIN_NOT_FOUND: { code: 1006, message: "Admin not found or doesn't exist" },
    OTP_EXPIRED: { code: 1007, message: "OTP Expired!, Please request a new OTP" },
    OTP_RESEND_TOO_EARLY: { code: 1025, message: "Please wait at least 1 minute before requesting a new OTP" },
    INVALID_OTP: { code: 1008, message: "Invalid OTP Provided" },
    INVALID_CREDENTIALS: { code: 1009, message: "Invalid Credentials provided" },
    ACCOUNT_LOCKED: { code: 1010, message: "Account is locked due to multiple failed login attempts" },
    LOGIN_FAILED: { code: 1011, message: "Error during login" },
    REGISTRATION_FAILED: { code: 1012, message: "Error during registration" },
    OTP_VERIFICATION_FAILED: { code: 1013, message: "OTP verification failed! Please request another OTP" },
    PLAN_SELECTION_REQUIRED: { code: 1014, message: "Subscription plan selection is required before proceeding" },
    PLAN_NOT_FOUND: { code: 1015, message: "Selected subscription plan does not exist" },
    PAYMENT_FAILED: { code: 1016, message: "Payment processing failed" },
    PROFILE_INCOMPLETE: { code: 1017, message: "User profile is incomplete. Please update your profile to proceed" },
    MISSING_FIELDS: { code: 1018, message: "Required fields are missing" },
    PLAN_CREATION_FAILED: { code: 1019, message: "Failed to create subscription plan" },
    PLAN_ALREADY_EXISTS: { code: 1020, message: "A plan with this name or features already exists" },
    INVALID_PLAN_ID: { code: 1021, message: "Invalid plan ID provided" },
    INTERNAL_ERROR: { code: 5000, message: "Something went wrong" }
  } as const;
  
  export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
  } as const;
  