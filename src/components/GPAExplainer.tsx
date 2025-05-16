
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { defaultGradePoints, gradeLabels, gradeColors } from "@/data/defaultCourses";

export function GPAExplainer() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">GPA Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How is GPA calculated?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm">
                GPA is calculated using this formula:
              </p>
              <pre className="bg-accent p-2 rounded-md my-2 overflow-auto text-xs">
                GPA = Sum(Grade Points × Credits) / Sum(Credits)
              </pre>
              <p className="text-sm">
                Each grade is assigned points. We multiply these points by the
                course credits, sum them all up, then divide by the total credits.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>Grade Point Values</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(defaultGradePoints).map(([grade, points]) => (
                  <div 
                    key={grade}
                    className="flex justify-between items-center p-2 rounded-md text-sm"
                    style={{ backgroundColor: `${gradeColors[grade]}20` }}
                  >
                    <span className="font-medium" style={{ color: gradeColors[grade] }}>
                      {grade}
                    </span>
                    <span>{points} points</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>Grade Interpretations</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {Object.entries(gradeLabels).map(([grade, label]) => (
                  <div 
                    key={grade}
                    className="flex items-center justify-between p-1 text-sm"
                  >
                    <span className="font-medium" style={{ color: gradeColors[grade] }}>
                      {grade}
                    </span>
                    <span className="text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>Tips for a Better GPA</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Focus more on courses with higher credits</li>
                <li>Create a study schedule and stick to it</li>
                <li>Form study groups for difficult courses</li>
                <li>Regularly attend classes and take good notes</li>
                <li>Don't hesitate to ask professors for help</li>
                <li>Set realistic goals for each semester</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
