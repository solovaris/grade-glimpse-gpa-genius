
import { Card, CardContent } from "@/components/ui/card";
import { getLetterGradeFromGPA } from "@/utils/calculations";
import { Progress } from "@/components/ui/progress";
import { gradeColors } from "@/data/defaultCourses";

interface GPADisplayProps {
  gpa: number;
  goal?: number;
  showProgress?: boolean;
}

export function GPADisplay({ gpa, goal, showProgress = true }: GPADisplayProps) {
  const formattedGPA = gpa.toFixed(2);
  const letterGrade = getLetterGradeFromGPA(gpa);
  const progressValue = (gpa / 10) * 100;
  const progressColor = gradeColors[letterGrade] || "#3b82f6";

  return (
    <Card className="gpa-card">
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">Current GPA</h3>
          <div className="flex items-center justify-center mb-2">
            <span 
              className="text-5xl font-bold animate-float" 
              style={{ color: progressColor }}
            >
              {formattedGPA}
            </span>
            <span className="text-2xl ml-2 text-muted-foreground">/10</span>
          </div>
          <p className="text-lg font-semibold" style={{ color: progressColor }}>
            {letterGrade} - {letterGrade === "O" ? "Outstanding" : 
                           letterGrade === "A+" ? "Excellent" : 
                           letterGrade === "A" ? "Very Good" : 
                           letterGrade === "B+" ? "Good" : 
                           letterGrade === "B" ? "Above Average" : 
                           letterGrade === "C" ? "Average" : 
                           letterGrade === "P" ? "Pass" : "Fail"}
          </p>
          
          {showProgress && (
            <div className="mt-4 space-y-1">
              <Progress 
                value={progressValue} 
                className="h-2.5" 
                style={{ 
                  backgroundColor: "rgba(124, 58, 237, 0.1)",
                  "--progress-color": progressColor
                } as React.CSSProperties} 
              />
              
              {goal !== undefined && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {formattedGPA}</span>
                  <span>Goal: {goal.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
