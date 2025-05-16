
export interface Course {
  id: string;
  name: string;
  credits: number;
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
}

export interface CourseGrade {
  courseId: string;
  grade: string;
}

export type GradePoints = {
  [key: string]: number;
};

export interface GradeStats {
  countByGrade: {
    [key: string]: number;
  };
  totalCredits: number;
  completedCredits: number;
}

export interface SavedState {
  currentSemester: string;
  semesters: Semester[];
  courseGrades: CourseGrade[];
  gpaGoal?: number;
}
