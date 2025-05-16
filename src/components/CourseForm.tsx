
import { useState } from "react";
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
import { toast } from "@/components/ui/use-toast";

interface CourseFormProps {
  onAddCourse: (name: string, credits: number) => void;
}

export function CourseForm({ onAddCourse }: CourseFormProps) {
  const [courseName, setCourseName] = useState("");
  const [credits, setCredits] = useState("3.0");
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (!courseName.trim()) {
      toast({
        variant: "destructive",
        description: "Please enter a course name"
      });
      return;
    }

    const creditsNum = parseFloat(credits);
    if (isNaN(creditsNum) || creditsNum <= 0) {
      toast({
        variant: "destructive",
        description: "Please enter valid credits (greater than 0)"
      });
      return;
    }

    onAddCourse(courseName.trim(), creditsNum);
    setCourseName("");
    setCredits("3.0");
    setOpen(false);
    
    toast({
      description: `Added course: ${courseName}`
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Course</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Enter the details for the new course you want to add.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="course-name" className="text-right">
              Course Name
            </Label>
            <Input
              id="course-name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Introduction to Programming"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="credits" className="text-right">
              Credits
            </Label>
            <Input
              id="credits"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="col-span-3"
              type="number"
              step="0.5"
              min="0.5"
              max="10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
