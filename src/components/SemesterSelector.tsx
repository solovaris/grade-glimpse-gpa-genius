
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Semester } from "@/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface SemesterSelectorProps {
  semesters: Semester[];
  currentSemesterId: string;
  onSelectSemester: (semesterId: string) => void;
  onAddSemester: (name: string) => void;
}

export function SemesterSelector({ 
  semesters, 
  currentSemesterId,
  onSelectSemester,
  onAddSemester
}: SemesterSelectorProps) {
  const [newSemesterName, setNewSemesterName] = useState("");

  const handleAddSemester = () => {
    if (newSemesterName.trim()) {
      onAddSemester(newSemesterName.trim());
      setNewSemesterName("");
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Select value={currentSemesterId} onValueChange={onSelectSemester}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select semester" />
        </SelectTrigger>
        <SelectContent className="min-w-[220px]">
          {semesters.map((semester) => (
            <SelectItem key={semester.id} value={semester.id}>
              {semester.name} ({semester.courses.length} courses)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline" className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Semester</DialogTitle>
            <DialogDescription>
              Create a new semester to track your courses and grades.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="semester-name" className="text-right">
                Name
              </Label>
              <Input
                id="semester-name"
                value={newSemesterName}
                onChange={(e) => setNewSemesterName(e.target.value)}
                className="col-span-3"
                placeholder="e.g. Fall 2025"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleAddSemester} disabled={!newSemesterName.trim()}>
                Add Semester
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
