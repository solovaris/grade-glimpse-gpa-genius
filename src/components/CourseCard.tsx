
import { useState } from "react";
import { Course } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { defaultGradePoints, gradeLabels, gradeColors } from "@/data/defaultCourses";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CourseCardProps {
  course: Course;
  grade: string;
  onGradeChange: (courseId: string, grade: string) => void;
  onDelete: (courseId: string) => void;
}

export function CourseCard({ course, grade, onGradeChange, onDelete }: CourseCardProps) {
  const [showMore, setShowMore] = useState(false);
  const mainGrades = ['O', 'A+', 'A', 'B+', 'B'];
  const extraGrades = ['C', 'P', 'F', 'W', 'I', 'FA'];

  return (
    <Card className="course-card animate-scale-in mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{course.name}</h3>
            <p className="text-sm text-muted-foreground">{course.credits} Credit{course.credits !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onDelete(course.id)}
                  >
                    <span className="sr-only">Delete</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete course</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-6 gap-2">
            {mainGrades.map((g) => (
              <Button
                key={g}
                variant={grade === g ? "default" : "outline"}
                className={`grade-button ${grade === g ? "grade-selected" : ""}`}
                style={grade === g ? { backgroundColor: gradeColors[g] } : {}}
                onClick={() => onGradeChange(course.id, g)}
              >
                {g}
              </Button>
            ))}
            <Button
              variant="outline"
              className="grade-button"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>
          
          {showMore && (
            <div 
              className="grid grid-cols-6 gap-2 animate-slide-down mt-2"
            >
              {extraGrades.map((g) => (
                <Button
                  key={g}
                  variant={grade === g ? "default" : "outline"}
                  className={`grade-button ${grade === g ? "grade-selected" : ""}`}
                  style={grade === g ? { backgroundColor: gradeColors[g] } : {}}
                  onClick={() => onGradeChange(course.id, g)}
                >
                  {g}
                </Button>
              ))}
            </div>
          )}
          
          {grade && (
            <p className="text-sm font-medium animate-fade-in" 
               style={{ color: gradeColors[grade] || 'currentColor' }}>
              {gradeLabels[grade] || grade} ({defaultGradePoints[grade]} points)
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
