
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Course, CourseGrade, GradeStats } from "@/types";
import { defaultGradePoints, defaultSemesters, gradeLabels, gradeColors } from "@/data/defaultCourses";
import { calculateGPA, calculateStats } from "@/utils/calculations";

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>GPA Calculator</Text>
        <Text style={styles.subtitleText}>Made with ♥ by Lovable</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.container}>
        {courses.map((course) => (
          <View key={course.id} style={styles.card}>
            <Text style={styles.courseName}>
              {course.name} ({course.credits} {course.credits !== 1 ? 'Credits' : 'Credit'})
            </Text>
            <View style={styles.grid}>
              {mainGrades.map((grade) => (
                <TouchableOpacity
                  key={grade}
                  style={[
                    styles.gridButton,
                    getGrade(course.id) === grade && [styles.selectedButton, 
                      {backgroundColor: getColorFromHex(gradeColors[grade] || '#6200EE')}]
                  ]}
                  onPress={() => setGrade(course.id, grade)}
                >
                  <Text style={styles.gridText}>{grade}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.gridButton}
                onPress={() => toggleShowMore(course.id)}
              >
                <Text style={styles.gridText}>
                  {showMore[course.id] ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {showMore[course.id] && (
              <View style={[styles.grid, styles.extraGrid]}>
                {extraGrades.map((grade) => (
                  <TouchableOpacity
                    key={grade}
                    style={[
                      styles.gridButton,
                      getGrade(course.id) === grade && [styles.selectedButton,
                        {backgroundColor: getColorFromHex(gradeColors[grade] || '#6200EE')}]
                    ]}
                    onPress={() => setGrade(course.id, grade)}
                  >
                    <Text style={styles.gridText}>{grade}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {getGrade(course.id) && (
              <Text style={[styles.gradeLabel, {
                color: getColorFromHex(gradeColors[getGrade(course.id)] || '#FFFFFF')
              }]}>
                {gradeLabels[getGrade(course.id)] || getGrade(course.id)} 
                ({defaultGradePoints[getGrade(course.id)]} points)
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.gpaContainer}>
        <Text style={styles.gpaLabel}>Semester GPA</Text>
        <Text style={styles.gpaValue}>{gpa.toFixed(2)}/10</Text>
        {stats && (
          <Text style={styles.creditsText}>
            Completed: {stats.completedCredits}/{stats.totalCredits} credits
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

// Helper function to convert HEX colors to React Native compatible colors
const getColorFromHex = (hex: string): string => {
  return hex;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerContainer: {
    backgroundColor: '#1A1F2C',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#333',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
  },
  card: {
    backgroundColor: '#1A1F2C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  extraGrid: {
    marginTop: 12,
  },
  gridButton: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  gpaContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#1A1F2C',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
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
    marginVertical: 4,
  },
  creditsText: {
    color: '#ccc',
    fontSize: 14,
  }
});

export default MobileApp;
