const errorDefinitions = {
  // Validation errors
  INVALID_EMAIL: { message: "Email address is invalid.", status: 400 },
  UNSAFE_EMAIL: { message: "Email provider is not allowed or is disposable.", status: 400 },
  INVALID_USERNAME: { message: "Username is not valid.", status: 400 },
  INVALID_PASSWORD: {
    message: "Password is invalid. {reason}",
    status: 400,
  },
  WEAK_PASSWORD: { message: "Password is too weak. Use a stronger one.", status: 400 },
  UNSAFE_PASSWORD: {
    message: "Password has appeared in data breaches. Choose a different one.",
    status: 400,
  },
  INVALID_MESSAGE_LENGTH: {
    message: "Message must be between {min} and {max} characters.",
    status: 400,
  },

  // Already in use
  EMAIL_IN_USE: { message: "Email is already in use.", status: 409 },
  USERNAME_IN_USE: { message: "Username is already in use.", status: 409 },

  // Authentication / authorization
  INVALID_VALIDATION: { message: "Invalid validation.", status: 400 },
  INVALID_CREDENTIALS: { message: "Invalid credentials.", status: 401 },
  INVALID_REFRESH_TOKEN: { message: "Refresh token expired or invalid.", status: 401 },
  TOO_EARLY_TOKEN_REFRESH: {
    message: "Cannot generate a new access token until the old one is expired.",
    status: 429,
  },
  INVALID_ACCESS_TOKEN: { message: "Access token expired or invalid.", status: 401 },
  USER_NOT_FOUND: { message: "User not found.", status: 401 },

  // General / pages
  PAGE_NOT_FOUND: { message: "Page not found.", status: 404 },

  // Internal
  INTERNAL_SERVER_ERROR: {
    message: "An unexpected error occurred. Please try again later.",
    status: 500,
  },
} as const;

export default errorDefinitions;
