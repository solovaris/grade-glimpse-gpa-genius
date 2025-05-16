
import { Course, Semester } from "@/types";

export const defaultCourses: Course[] = [
  { id: "c1", name: "Glimpses of Glorious India", credits: 2.0 },
  { id: "c2", name: "Engineering Chemistry - B", credits: 3.0 },
  { id: "c3", name: "Computer Hardware and System Essentials", credits: 3.0 },
  { id: "c4", name: "Digital Electronics", credits: 3.0 },
  { id: "c5", name: "Computer Hardware and System Essentials Laboratory", credits: 1.0 },
  { id: "c6", name: "Digital Electronics Laboratory", credits: 1.0 },
  { id: "c7", name: "Computer Programming", credits: 3.0 },
  { id: "c8", name: "Network Analysis", credits: 3.0 },
  { id: "c9", name: "Computer Programming Laboratory", credits: 1.0 },
  { id: "c10", name: "Introduction to Internet of Things", credits: 1.0 },
  { id: "c11", name: "Engineering Mathematics II", credits: 4.0 }
];

export const defaultGradePoints = {
  O: 10,
  "A+": 9.5,
  A: 9,
  "B+": 8,
  B: 7,
  C: 6,
  P: 5,
  F: 0,
  W: 0,
  I: 0,
  FA: 0
};

export const defaultSemesters: Semester[] = [
  {
    id: "sem1",
    name: "Semester 1",
    courses: defaultCourses
  }
];

export const gradeLabels: { [key: string]: string } = {
  O: "Outstanding",
  "A+": "Excellent",
  A: "Very Good",
  "B+": "Good",
  B: "Above Average",
  C: "Average",
  P: "Pass",
  F: "Fail",
  W: "Withdrawal",
  I: "Incomplete",
  FA: "Fail due to Attendance"
};

export const gradeColors: { [key: string]: string } = {
  O: "#8b5cf6",    // Violet
  "A+": "#6366f1", // Indigo
  A: "#3b82f6",    // Blue
  "B+": "#0ea5e9", // Light Blue
  B: "#06b6d4",    // Cyan
  C: "#14b8a6",    // Teal
  P: "#f59e0b",    // Amber
  F: "#ef4444",    // Red
  W: "#6b7280",    // Gray
  I: "#9ca3af",    // Light Gray
  FA: "#dc2626"     // Bright Red
};
