// Password validation utility functions

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (
  password: string
): PasswordValidationResult => {
  const errors: string[] = [];

  // Check minimum length
  if (password.length < 8) {
    errors.push("At least 8 characters required");
  }

  // Check for at least one character (letter)
  if (!/[a-zA-Z]/.test(password)) {
    errors.push("At least 1 letter (a-z, A-Z) required");
  }

  // Check for at least one digit
  if (!/\d/.test(password)) {
    errors.push("At least 1 digit (0-9) required");
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("At least 1 special character (!@#$%^&*) required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getPasswordStrength = (
  password: string
): "weak" | "medium" | "strong" => {
  const validation = validatePassword(password);

  if (validation.isValid) {
    return "strong";
  }

  // Count how many requirements are met
  let requirementsMet = 0;

  if (password.length >= 8) requirementsMet++;
  if (/[a-zA-Z]/.test(password)) requirementsMet++;
  if (/\d/.test(password)) requirementsMet++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) requirementsMet++;

  if (requirementsMet >= 3) {
    return "medium";
  }

  return "weak";
};

export const getPasswordStrengthColor = (
  strength: "weak" | "medium" | "strong"
): string => {
  switch (strength) {
    case "weak":
      return "#FF5722"; // Red
    case "medium":
      return "#FF9800"; // Orange
    case "strong":
      return "#4CAF50"; // Green
    default:
      return "#9E9E9E"; // Gray
  }
};
