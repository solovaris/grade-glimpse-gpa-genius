
import { Course, CourseGrade, GradePoints, GradeStats } from "@/types";
import { defaultGradePoints } from "@/data/defaultCourses";

export function calculateGPA(
  courses: Course[],
  grades: CourseGrade[],
  gradePoints: GradePoints = defaultGradePoints
): number {
  let totalCredits = 0;
  let weightedSum = 0;

  courses.forEach((course) => {
    const gradeEntry = grades.find((g) => g.courseId === course.id);
    if (gradeEntry && gradeEntry.grade) {
      const gradePoint = gradePoints[gradeEntry.grade] || 0;
      weightedSum += gradePoint * course.credits;
      totalCredits += course.credits;
    }
  });

  return totalCredits > 0 ? weightedSum / totalCredits : 0;
}

export function getLetterGradeFromGPA(gpa: number): string {
  if (gpa >= 9.5) return "O";
  if (gpa >= 9.0) return "A+";
  if (gpa >= 8.0) return "A";
  if (gpa >= 7.0) return "B+";
  if (gpa >= 6.0) return "B";
  if (gpa >= 5.0) return "C";
  if (gpa >= 4.0) return "P";
  return "F";
}

export function calculateRemainingGPA(
  currentGPA: number,
  currentCredits: number,
  targetGPA: number,
  remainingCredits: number
): number {
  if (remainingCredits <= 0) return 0;
  
  const totalCredits = currentCredits + remainingCredits;
  const neededGPAPoints = targetGPA * totalCredits;
  const currentGPAPoints = currentGPA * currentCredits;
  const remainingGPANeeded = (neededGPAPoints - currentGPAPoints) / remainingCredits;
  
  return Math.max(0, Math.min(10, remainingGPANeeded));
}

export function calculateStats(
  courses: Course[],
  grades: CourseGrade[],
  gradePoints: GradePoints = defaultGradePoints
): GradeStats {
  const countByGrade: { [key: string]: number } = {};
  let totalCredits = 0;
  let completedCredits = 0;

  Object.keys(gradePoints).forEach(grade => {
    countByGrade[grade] = 0;
  });

  courses.forEach(course => {
    totalCredits += course.credits;
    const gradeEntry = grades.find(g => g.courseId === course.id);
    
    if (gradeEntry && gradeEntry.grade) {
      countByGrade[gradeEntry.grade] = (countByGrade[gradeEntry.grade] || 0) + 1;
      
      // Only count credits for passing grades
      if (["O", "A+", "A", "B+", "B", "C", "P"].includes(gradeEntry.grade)) {
        completedCredits += course.credits;
      }
    }
  });

  return {
    countByGrade,
    totalCredits,
    completedCredits,
  };
}
