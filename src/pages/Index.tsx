
import { useState, useEffect } from "react";
import useGPACalculator from "@/hooks/useGPACalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCard } from "@/components/CourseCard";
import { GPADisplay } from "@/components/GPADisplay";
import { GradeDistribution } from "@/components/GradeDistribution";
import { SemesterSelector } from "@/components/SemesterSelector";
import { CourseForm } from "@/components/CourseForm";
import { GPAGoalSetting } from "@/components/GPAGoalSetting";
import { GPAExplainer } from "@/components/GPAExplainer";
import { Settings } from "@/components/Settings";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUp } from "lucide-react";

const Index = () => {
  const {
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
  } = useGPACalculator();

  const [showScrollTop, setShowScrollTop] = useState(false);
  const isMobile = useIsMobile();

  // Scroll to top button handler
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                GPA Genius
              </h1>
              <p className="text-muted-foreground">Calculate and track your academic performance</p>
            </div>
            
            <div className="flex items-center gap-2">
              <SemesterSelector
                semesters={semesters}
                currentSemesterId={currentSemester?.id || ""}
                onSelectSemester={changeSemester}
                onAddSemester={addSemester}
              />
              <ThemeToggle />
              <Settings 
                onResetAll={resetAll} 
                onDeleteSemester={deleteSemester}
                currentSemesterId={currentSemester?.id || ""}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-semibold">Courses & Grades</h2>
              <CourseForm onAddCourse={addCourse} />
            </div>
            
            {currentSemester && currentSemester.courses.length > 0 ? (
              <div className="space-y-4">
                {currentSemester.courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    grade={getGrade(course.id)}
                    onGradeChange={setGrade}
                    onDelete={deleteCourse}
                  />
                ))}
              </div>
            ) : (
              <Card className="animate-pulse">
                <CardContent className="py-10 text-center">
                  <h3 className="text-xl font-medium mb-2">No Courses Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first course to start calculating your GPA
                  </p>
                  <CourseForm onAddCourse={addCourse} />
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <div className="sticky top-4 space-y-6">
              <GPADisplay gpa={gpa} goal={gpaGoal} />
              
              {stats && <GradeDistribution stats={stats} />}
              
              <Tabs defaultValue="goal" className="w-full">
                <TabsList className="w-full mb-2">
                  <TabsTrigger value="goal" className="w-1/2">Goal</TabsTrigger>
                  <TabsTrigger value="guide" className="w-1/2">Guide</TabsTrigger>
                </TabsList>
                
                <TabsContent value="goal">
                  <GPAGoalSetting 
                    currentGPA={gpa}
                    gpaGoal={gpaGoal}
                    onSetGoal={setGpaGoal}
                    stats={stats}
                  />
                </TabsContent>
                
                <TabsContent value="guide">
                  <GPAExplainer />
                </TabsContent>
              </Tabs>
              
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Made with ♥ by Lovable
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg animate-fade-in"
          size="icon"
          variant="secondary"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default Index;
