import { describe, test, expect } from "vitest";
import { calculateGrade, calculateWeightedGPA } from "../lib/grading";

describe("Academic Grading System (UGC 4.0 Standard Scale)", () => {
  test("calculates A+ (4.00) for marks >= 80", () => {
    const res85 = calculateGrade(85);
    expect(res85.letter).toBe("A+");
    expect(res85.point).toBe(4.0);

    const res80 = calculateGrade(80);
    expect(res80.letter).toBe("A+");
    expect(res80.point).toBe(4.0);
  });

  test("calculates A (3.75) for marks between 75 and 79.99", () => {
    const res = calculateGrade(76.5);
    expect(res.letter).toBe("A");
    expect(res.point).toBe(3.75);
  });

  test("calculates A- (3.50) for marks between 70 and 74.99", () => {
    const res = calculateGrade(72);
    expect(res.letter).toBe("A-");
    expect(res.point).toBe(3.5);
  });

  test("calculates B+ (3.25) for marks between 65 and 69.99", () => {
    const res = calculateGrade(68);
    expect(res.letter).toBe("B+");
    expect(res.point).toBe(3.25);
  });

  test("calculates B (3.00) for marks between 60 and 64.99", () => {
    const res = calculateGrade(61);
    expect(res.letter).toBe("B");
    expect(res.point).toBe(3.0);
  });

  test("calculates D (2.00) for marks between 40 and 44.99", () => {
    const res = calculateGrade(41);
    expect(res.letter).toBe("D");
    expect(res.point).toBe(2.0);
  });

  test("calculates F (0.00) for marks below 40", () => {
    const res = calculateGrade(35);
    expect(res.letter).toBe("F");
    expect(res.point).toBe(0.0);
  });

  test("computes accurate weighted GPA across diverse course credits", () => {
    const courses = [
      { credits: 3, gradePoint: 4.0 },  // 12.0
      { credits: 3, gradePoint: 3.75 }, // 11.25
      { credits: 4, gradePoint: 3.5 },  // 14.0
      { credits: 1.5, gradePoint: 4.0 },// 6.0
    ];
    // Total Credits: 11.5
    // Total Credit Points: 43.25
    // GPA = 43.25 / 11.5 = 3.7608 => 3.76
    const gpa = calculateWeightedGPA(courses);
    expect(gpa).toBe(3.76);
  });

  test("returns 0.00 GPA for empty course array", () => {
    expect(calculateWeightedGPA([])).toBe(0.0);
  });
});
