
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Course, CourseGrade, GradeStats } from "@/types";
import { defaultGradePoints, defaultSemesters, gradeLabels, gradeColors } from "@/data/defaultCourses";
import { calculateGPA, calculateStats } from "@/utils/calculations";

// Create a web-compatible version of React Native components
const ReactNativeWeb = {
  View: (props: any) => <div {...props} style={{...styles[props.style] || {}, ...props.style}} />,
  Text: (props: any) => <span {...props} style={{...styles[props.style] || {}, ...props.style}} />,
  ScrollView: (props: any) => <div {...props} style={{overflowY: 'auto', ...styles[props.style] || {}, ...props.style}} />,
  SafeAreaView: (props: any) => <div {...props} style={{...styles[props.style] || {}, ...props.style}} />,
  TouchableOpacity: (props: any) => <button {...props} onClick={props.onPress} style={{background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', ...styles[props.style] || {}, ...props.style}} />
};

const MobileApp = () => {
  const [semesters, setSemesters] = useState(defaultSemesters);
  const [currentSemesterId, setCurrentSemesterId] = useState(defaultSemesters[0].id);
  const [courseGrades, setCourseGrades] = useState<CourseGrade[]>([]);
  const [showMore, setShowMore] = useState<{[key: string]: boolean}>({});
  
  const currentSemester = semesters.find(sem => sem.id === currentSemesterId) || semesters[0];
  const courses = currentSemester?.courses || [];
  
  // Load saved state from storage
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedState = localStorage.getItem("gpa-calculator-state");
        if (savedState) {
          const parsed = JSON.parse(savedState);
          setSemesters(parsed.semesters);
          setCurrentSemesterId(parsed.currentSemester);
          setCourseGrades(parsed.courseGrades);
        }
      } catch (error) {
        console.error("Error loading saved state:", error);
      }
    };
    loadSavedState();
  }, []);
  
  // Save state whenever it changes
  useEffect(() => {
    if (semesters.length && currentSemesterId) {
      const state = {
        semesters,
        currentSemester: currentSemesterId,
        courseGrades
      };
      localStorage.setItem("gpa-calculator-state", JSON.stringify(state));
    }
  }, [semesters, currentSemesterId, courseGrades]);
  
  // Toggle showing more grades
  const toggleShowMore = (courseId: string) => {
    setShowMore(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };
  
  // Set a grade for a course
  const setGrade = (courseId: string, grade: string) => {
    setCourseGrades(prev => {
      const existingIndex = prev.findIndex(g => g.courseId === courseId);
      
      if (existingIndex >= 0) {
        const newGrades = [...prev];
        newGrades[existingIndex] = { ...newGrades[existingIndex], grade };
        return newGrades;
      } else {
        return [...prev, { courseId, grade }];
      }
    });
  };
  
  // Get the grade for a specific course
  const getGrade = (courseId: string): string => {
    return courseGrades.find(g => g.courseId === courseId)?.grade || "";
  };
  
  // Calculate GPA
  const gpa = currentSemester
    ? calculateGPA(currentSemester.courses, courseGrades)
    : 0;
  
  const stats = currentSemester
    ? calculateStats(currentSemester.courses, courseGrades)
    : null;
  
  const mainGrades = ['O', 'A+', 'A', 'B+', 'B'];
  const extraGrades = ['C', 'P', 'F', 'W', 'I', 'FA'];

  // Use ReactNativeWeb components for web rendering
  return (
    <div className="safe-area" style={styles.safeArea}>
      <div style={styles.headerContainer}>
        <span style={styles.headerText}>GPA Calculator</span>
        <span style={styles.subtitleText}>Made with ♥ by Lovable</span>
      </div>
      
      <div className="scroll-container" style={{...styles.container, overflowY: 'auto'}}>
        {courses.map((course) => (
          <div key={course.id} className="course-card" style={styles.card}>
            <span style={styles.courseName}>
              {course.name} ({course.credits} {course.credits !== 1 ? 'Credits' : 'Credit'})
            </span>
            <div style={styles.grid}>
              {mainGrades.map((grade) => (
                <button
                  key={grade}
                  style={{
                    ...styles.gridButton,
                    ...(getGrade(course.id) === grade ? {...styles.selectedButton, backgroundColor: getColorFromHex(gradeColors[grade] || '#6200EE')} : {})
                  }}
                  onClick={() => setGrade(course.id, grade)}
                >
                  <span style={styles.gridText}>{grade}</span>
                </button>
              ))}
              <button
                style={styles.gridButton}
                onClick={() => toggleShowMore(course.id)}
              >
                <span style={styles.gridText}>
                  {showMore[course.id] ? '▲' : '▼'}
                </span>
              </button>
            </div>
            
            {showMore[course.id] && (
              <div style={{...styles.grid, ...styles.extraGrid}}>
                {extraGrades.map((grade) => (
                  <button
                    key={grade}
                    style={{
                      ...styles.gridButton,
                      ...(getGrade(course.id) === grade ? {...styles.selectedButton, backgroundColor: getColorFromHex(gradeColors[grade] || '#6200EE')} : {})
                    }}
                    onClick={() => setGrade(course.id, grade)}
                  >
                    <span style={styles.gridText}>{grade}</span>
                  </button>
                ))}
              </div>
            )}
            
            {getGrade(course.id) && (
              <span style={{
                ...styles.gradeLabel,
                color: getColorFromHex(gradeColors[getGrade(course.id)] || '#FFFFFF')
              }}>
                {gradeLabels[getGrade(course.id)] || getGrade(course.id)} 
                ({defaultGradePoints[getGrade(course.id)]} points)
              </span>
            )}
          </div>
        ))}
      </div>
      
      <div style={styles.gpaContainer}>
        <span style={styles.gpaLabel}>Semester GPA</span>
        <span style={styles.gpaValue}>{gpa.toFixed(2)}/10</span>
        {stats && (
          <span style={styles.creditsText}>
            Completed: {stats.completedCredits}/{stats.totalCredits} credits
          </span>
        )}
      </div>
    </div>
  );
};

// Helper function to convert HEX colors to web compatible colors
const getColorFromHex = (hex: string): string => {
  return hex;
};

const styles: Record<string, React.CSSProperties> = {
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
    height: '100vh',
    position: 'relative',
  },
  headerContainer: {
    backgroundColor: '#1A1F2C',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitleText: {
    color: '#9b87f5',
    fontSize: 14,
    marginTop: 4,
  },
  container: {
    padding: 16,
    paddingBottom: 100,
    height: 'calc(100vh - 200px)',
  },
  card: {
    backgroundColor: '#1A1F2C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  courseName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    display: 'block',
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  extraGrid: {
    marginTop: 12,
  },
  gridButton: {
    flex: 1,
    margin: '0 3px',
    padding: '10px 0',
    backgroundColor: '#333',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    cursor: 'pointer',
  },
  selectedButton: {
    backgroundColor: '#9b87f5',
  },
  gridText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  gradeLabel: {
    marginTop: 10,
    color: '#fff',
    fontWeight: '500',
    display: 'block',
  },
  gpaContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#1A1F2C',
    padding: 20,
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpaLabel: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '600',
  },
  gpaValue: {
    color: '#9b87f5',
    fontSize: 28,
    fontWeight: 'bold',
    margin: '4px 0',
  },
  creditsText: {
    color: '#ccc',
    fontSize: 14,
  }
};

export default MobileApp;
