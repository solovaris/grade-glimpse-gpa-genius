
import { useState, useEffect } from "react";
import { Course, CourseGrade, Semester, SavedState, GradeStats } from "@/types";
import { defaultSemesters, defaultGradePoints } from "@/data/defaultCourses";
import { calculateGPA, calculateStats } from "@/utils/calculations";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/components/ui/use-toast";

export function useGPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>(defaultSemesters);
  const [currentSemesterId, setCurrentSemesterId] = useState<string>(defaultSemesters[0]?.id || "");
  const [courseGrades, setCourseGrades] = useState<CourseGrade[]>([]);
  const [gpaGoal, setGpaGoal] = useState<number | undefined>(undefined);
  const [stats, setStats] = useState<GradeStats | null>(null);

  // Load state from localStorage on first render
  useEffect(() => {
    const savedState = localStorage.getItem("gpa-calculator-state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState) as SavedState;
        setSemesters(parsed.semesters);
        setCurrentSemesterId(parsed.currentSemester);
        setCourseGrades(parsed.courseGrades);
        if (parsed.gpaGoal) {
          setGpaGoal(parsed.gpaGoal);
        }
      } catch (error) {
        console.error("Error loading saved state:", error);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (semesters.length && currentSemesterId) {
      const state: SavedState = {
        semesters,
        currentSemester: currentSemesterId,
        courseGrades,
        gpaGoal
      };
      localStorage.setItem("gpa-calculator-state", JSON.stringify(state));
    }
  }, [semesters, currentSemesterId, courseGrades, gpaGoal]);

  // Calculate stats whenever relevant data changes
  useEffect(() => {
    const currentSemester = semesters.find(sem => sem.id === currentSemesterId);
    if (currentSemester) {
      const calculatedStats = calculateStats(currentSemester.courses, courseGrades);
      setStats(calculatedStats);
    }
  }, [semesters, currentSemesterId, courseGrades]);

  // Get current semester
  const currentSemester = semesters.find(sem => sem.id === currentSemesterId) || semesters[0];

  // Calculate GPA for current semester
  const gpa = currentSemester
    ? calculateGPA(currentSemester.courses, courseGrades)
    : 0;

  // Handle grade change
  const setGrade = (courseId: string, grade: string) => {
    setCourseGrades(prev => {
      // Find if we already have a grade for this course
      const existingIndex = prev.findIndex(g => g.courseId === courseId);
      
      if (existingIndex >= 0) {
        // Update existing grade
        const newGrades = [...prev];
        newGrades[existingIndex] = { ...newGrades[existingIndex], grade };
        return newGrades;
      } else {
        // Add new grade
        return [...prev, { courseId, grade }];
      }
    });
  };

  // Get a grade for a specific course
  const getGrade = (courseId: string): string => {
    return courseGrades.find(g => g.courseId === courseId)?.grade || "";
  };

  // Add a new semester
  const addSemester = (name: string) => {
    const newSemester: Semester = {
      id: uuidv4(),
      name,
      courses: []
    };
    
    setSemesters(prev => [...prev, newSemester]);
    setCurrentSemesterId(newSemester.id);
    toast({
      description: `Created new semester: ${name}`,
    });
  };

  // Add a new course to current semester
  const addCourse = (name: string, credits: number) => {
    const newCourse: Course = {
      id: uuidv4(),
      name,
      credits
    };
    
    setSemesters(prev => 
      prev.map(sem => 
        sem.id === currentSemesterId
          ? { ...sem, courses: [...sem.courses, newCourse] }
          : sem
      )
    );
  };

  // Change semester
  const changeSemester = (semesterId: string) => {
    if (semesters.some(sem => sem.id === semesterId)) {
      setCurrentSemesterId(semesterId);
    }
  };

  // Delete a course
  const deleteCourse = (courseId: string) => {
    // Remove course from current semester
    setSemesters(prev => 
      prev.map(sem => 
        sem.id === currentSemesterId
          ? { ...sem, courses: sem.courses.filter(c => c.id !== courseId) }
          : sem
      )
    );
    
    // Remove any grades associated with this course
    setCourseGrades(prev => prev.filter(g => g.courseId !== courseId));
  };

  // Delete a semester
  const deleteSemester = (semesterId: string) => {
    // Can't delete if it's the only semester
    if (semesters.length <= 1) {
      toast({
        variant: "destructive",
        description: "Cannot delete the only semester."
      });
      return;
    }
    
    // Switch to another semester if deleting the current one
    if (semesterId === currentSemesterId) {
      const otherSemester = semesters.find(s => s.id !== semesterId);
      if (otherSemester) {
        setCurrentSemesterId(otherSemester.id);
      }
    }
    
    // Remove semester
    setSemesters(prev => prev.filter(sem => sem.id !== semesterId));
    
    // Remove grades for courses in this semester
    const coursesInSemester = semesters
      .find(s => s.id === semesterId)
      ?.courses.map(c => c.id) || [];
      
    setCourseGrades(prev => 
      prev.filter(g => !coursesInSemester.includes(g.courseId))
    );
  };

  // Reset all data
  const resetAll = () => {
    setSemesters(defaultSemesters);
    setCurrentSemesterId(defaultSemesters[0].id);
    setCourseGrades([]);
    setGpaGoal(undefined);
    localStorage.removeItem("gpa-calculator-state");
    toast({
      description: "All data has been reset.",
    });
  };

  return {
    semesters,
    currentSemester,
    courseGrades,
    gpa,
    gpaGoal,
    stats,
    setGrade,
    getGrade,
    addSemester,
    addCourse,
    changeSemester,
    deleteCourse,
    deleteSemester,
    setGpaGoal,
    resetAll
  };
}

export default useGPACalculator;
