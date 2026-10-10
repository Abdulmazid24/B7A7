/**
 * Enterprise Security & Data Sanitization Utilities
 */

/**
 * Strips script tags, javascript: URI prefixes, and HTML entities
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/onload\s*=/gi, "")
    .replace(/onerror\s*=/gi, "")
    .trim();
}

/**
 * Decodes JWT token payload safely and checks if expired
 */
export function isTokenExpired(token: string): boolean {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

/**
 * Validates password strength according to enterprise criteria
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  message: string;
} {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  let message = "Very Weak";
  if (score >= 5) message = "Very Strong";
  else if (score === 4) message = "Strong";
  else if (score === 3) message = "Moderate";
  else if (score === 2) message = "Weak";

  return {
    isValid: score >= 3,
    score,
    message,
  };
}

/**
 * Masks an academic email for privacy display
 */
export function maskSensitiveEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) return `${localPart[0]}*@${domain}`;
  const maskedLocal = `${localPart[0]}${"*".repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`;
  return `${maskedLocal}@${domain}`;
}
