import { describe, test, expect } from "vitest";
import { sanitizeInput, validatePasswordStrength, maskSensitiveEmail } from "../lib/security";

describe("Security and Data Sanitization Utilities", () => {
  test("sanitizeInput strips malicious script tags and inline event handlers", () => {
    const malicious = '<script>alert("hack")</script>Hello World';
    expect(sanitizeInput(malicious)).toBe("Hello World");

    const onerrorXss = 'image.png onload="stealCookies()"';
    expect(sanitizeInput(onerrorXss)).not.toContain("onload=");
  });

  test("validatePasswordStrength enforces high entropy passwords", () => {
    const weak = validatePasswordStrength("12345");
    expect(weak.isValid).toBe(false);
    expect(weak.score).toBeLessThan(3);

    const strong = validatePasswordStrength("SecureP@ssw0rd2026!");
    expect(strong.isValid).toBe(true);
    expect(strong.score).toBeGreaterThanOrEqual(4);
  });

  test("maskSensitiveEmail hides internal characters for PII privacy", () => {
    expect(maskSensitiveEmail("admin@university.edu")).toBe("a***n@university.edu");
    expect(maskSensitiveEmail("student@university.edu")).toBe("s*****t@university.edu");
  });
});
