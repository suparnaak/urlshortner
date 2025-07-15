export const MESSAGES = {
  VALIDATION: {
    NAME_REQUIRED: "Name is required",
    NAME_INVALID: "Name should contain only letters and spaces.",
    NAME_TOO_SHORT: "Name must be at least 2 characters",
    EMAIL_REQUIRED: "Email is required",
    INVALID_EMAIL: "Enter a valid email",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_TOO_SHORT: "Password must be at least 6 characters",
    CONFIRM_PASSWORD_REQUIRED: "Confirm Password is required",
    PASSWORDS_NOT_MATCHING: "Passwords do not match",
    ORIGINAL_URL_REQUIRED: 'A valid URL is required',
  },

  AUTH: {
    EMAIL_EXISTS: "User with this email already exists",
    LOGIN_FAILED: "Invalid email or password",
    JWT_MISSING: "JWT secret not configured",
    UNAUTHORIZED: 'Unauthorized access',        
    INVALID_TOKEN: 'Invalid or expired token',
    LOGIN_REQUIRED: 'Please login',

    REGISTER_SUCCESS: "Registration successful. Please log in.",
    LOGIN_SUCCESS: "Login successful",
    LOGOUT:"Logged out successfully",
  },

  SHORT_URL:{
    URL_NOT_FOUND:"No URL found",
    DELETED_SUCCESSFUL:"URL deleted successfully",

  },

  GENERAL: {
    SERVER_ERROR: "Something went wrong. Please try again later.",
  },
};

//status codes
export enum STATUS {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
