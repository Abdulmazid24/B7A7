/**
 * University Academic Grading Standard (UGC 4.0 Scale)
 */

export interface GradeCalculationResult {
  letter: string;
  point: number;
  description: string;
}

export function calculateGrade(total: number): GradeCalculationResult {
  const rounded = Math.round(total * 100) / 100;

  if (rounded >= 80) return { letter: "A+", point: 4.0, description: "Outstanding" };
  if (rounded >= 75) return { letter: "A", point: 3.75, description: "Excellent" };
  if (rounded >= 70) return { letter: "A-", point: 3.5, description: "Very Good" };
  if (rounded >= 65) return { letter: "B+", point: 3.25, description: "Good" };
  if (rounded >= 60) return { letter: "B", point: 3.0, description: "Satisfactory" };
  if (rounded >= 55) return { letter: "B-", point: 2.75, description: "Above Average" };
  if (rounded >= 50) return { letter: "C+", point: 2.5, description: "Average" };
  if (rounded >= 45) return { letter: "C", point: 2.25, description: "Below Average" };
  if (rounded >= 40) return { letter: "D", point: 2.0, description: "Pass" };
  return { letter: "F", point: 0.0, description: "Fail" };
}

export function calculateWeightedGPA(
  courses: { credits: number; gradePoint: number }[]
): number {
  if (!courses || courses.length === 0) return 0.0;

  let totalCreditPoints = 0;
  let totalCredits = 0;

  for (const c of courses) {
    totalCreditPoints += c.credits * c.gradePoint;
    totalCredits += c.credits;
  }

  if (totalCredits === 0) return 0.0;
  return Math.round((totalCreditPoints / totalCredits) * 100) / 100;
}
