
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateRemainingGPA } from "@/utils/calculations";
import { toast } from "@/components/ui/use-toast";
import { GradeStats } from "@/types";

interface GPAGoalSettingProps {
  currentGPA: number;
  gpaGoal: number | undefined;
  onSetGoal: (goal: number | undefined) => void;
  stats: GradeStats | null;
}

export function GPAGoalSetting({ currentGPA, gpaGoal, onSetGoal, stats }: GPAGoalSettingProps) {
  const [goal, setGoal] = useState(gpaGoal?.toString() || "");
  
  useEffect(() => {
    if (gpaGoal !== undefined) {
      setGoal(gpaGoal.toString());
    }
  }, [gpaGoal]);

  const handleSave = () => {
    const parsedGoal = parseFloat(goal);
    if (isNaN(parsedGoal) || parsedGoal < 0 || parsedGoal > 10) {
      toast({
        variant: "destructive",
        description: "Please enter a valid GPA goal between 0 and 10"
      });
      return;
    }
    
    onSetGoal(parsedGoal);
    toast({
      description: `GPA goal set to ${parsedGoal.toFixed(2)}`
    });
  };

  const handleClear = () => {
    onSetGoal(undefined);
    setGoal("");
    toast({
      description: "GPA goal cleared"
    });
  };

  // Calculate remaining needed GPA
  const remainingNeededGPA = stats && gpaGoal !== undefined 
    ? calculateRemainingGPA(
        currentGPA,
        stats.completedCredits,
        gpaGoal,
        stats.totalCredits - stats.completedCredits
      )
    : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">GPA Goal</CardTitle>
      </CardHeader>
      <CardContent>
        {gpaGoal === undefined ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Set a target GPA to track your progress
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Set Goal</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set GPA Goal</DialogTitle>
                  <DialogDescription>
                    Enter your target GPA to track your progress towards it.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gpa-goal" className="text-right">
                      Target GPA
                    </Label>
                    <Input
                      id="gpa-goal"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="col-span-3"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="e.g. 8.5"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleSave}>Save Goal</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Current Goal</p>
                <p className="text-2xl font-bold">{gpaGoal.toFixed(2)}</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Edit</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update GPA Goal</DialogTitle>
                    <DialogDescription>
                      Modify your target GPA or clear it.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="gpa-goal-update" className="text-right">
                        Target GPA
                      </Label>
                      <Input
                        id="gpa-goal-update"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="col-span-3"
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleClear}>
                      Clear Goal
                    </Button>
                    <DialogClose asChild>
                      <Button onClick={handleSave}>Update Goal</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {remainingNeededGPA !== null && stats && stats.totalCredits > stats.completedCredits && (
              <div className="pt-2 border-t">
                <p className="text-sm font-medium">Required Average for Remaining Courses</p>
                <p className={`text-lg font-bold ${remainingNeededGPA > 10 ? 'text-destructive' : ''}`}>
                  {remainingNeededGPA > 10 
                    ? "Not achievable" 
                    : remainingNeededGPA.toFixed(2)}
                </p>
                {remainingNeededGPA > 10 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Consider adjusting your goal to something more achievable
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
