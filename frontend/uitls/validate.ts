import validator from "validator";

export function validateEmail(email: string): string | null {
  if (!validator.isEmail(email)) return "Please enter a valid email address.";
  return null;
}

export function validateUsername(username: string): string | null {
  if (!validator.isLength(username, { min: 3, max: 20 }))
    return "Username must be 3-20 characters long.";
  if (validator.matches(username, /^_|_$/))
    return "Username cannot start or end with an underscore.";
  if (validator.matches(username, /__/))
    return "Username cannot contain consecutive underscores.";
  if (!validator.matches(username, /^[a-z0-9_]+$/))
    return "Username can only contain lowercase letters, numbers, and underscores.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!validator.isLength(password, { min: 8, max: 72 }))
    return "Password must be 8-72 characters long.";
  if (!validator.matches(password, /[A-Z]/))
    return "Password must contain at least one uppercase letter.";
  if (!validator.matches(password, /[a-z]/))
    return "Password must contain at least one lowercase letter.";
  if (!validator.matches(password, /[0-9]/))
    return "Password must contain at least one number.";
  if (!validator.matches(password, /[!@#$%^&*]/))
    return "Password must contain at least one special character (!@#$%^&*).";
  return null;
}
