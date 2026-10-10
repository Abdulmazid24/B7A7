import { describe, test, expect } from "vitest";
import { formatCurrency, formatDate, getStatusBadgeClasses, getGradeBadgeClasses } from "../lib/utils";

describe("Formatting and Badge Styling Utility Functions", () => {
  test("formatCurrency formats USD amounts correctly", () => {
    expect(formatCurrency(1200)).toBe("$1,200.00");
    expect(formatCurrency(0)).toBe("$0.00");
  });

  test("formatDate handles valid ISO dates and nulls safely", () => {
    expect(formatDate(undefined)).toBe("N/A");
    expect(formatDate(null)).toBe("N/A");
    expect(formatDate("invalid-date-string")).toBe("N/A");
    expect(formatDate("2026-10-10T12:00:00Z")).toContain("2026");
  });

  test("getStatusBadgeClasses returns emerald colors for active statuses", () => {
    expect(getStatusBadgeClasses("ACTIVE")).toContain("emerald");
    expect(getStatusBadgeClasses("PAID")).toContain("emerald");
    expect(getStatusBadgeClasses("ENROLLED")).toContain("emerald");
  });

  test("getStatusBadgeClasses returns rose colors for failed or dropped statuses", () => {
    expect(getStatusBadgeClasses("FAILED")).toContain("rose");
    expect(getStatusBadgeClasses("DROPPED")).toContain("rose");
    expect(getStatusBadgeClasses("BLOCKED")).toContain("rose");
  });

  test("getGradeBadgeClasses maps letter grades to appropriate tailwind classes", () => {
    expect(getGradeBadgeClasses("A+")).toContain("emerald");
    expect(getGradeBadgeClasses("B")).toContain("blue");
    expect(getGradeBadgeClasses("C")).toContain("amber");
    expect(getGradeBadgeClasses("F")).toContain("rose");
  });
});
