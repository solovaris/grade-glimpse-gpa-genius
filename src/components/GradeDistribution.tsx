
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradeStats } from "@/types";
import { gradeColors } from "@/data/defaultCourses";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface GradeDistributionProps {
  stats: GradeStats;
}

export function GradeDistribution({ stats }: GradeDistributionProps) {
  if (!stats) return null;

  const mainGrades = ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'];
  
  const data = mainGrades.map(grade => ({
    grade,
    count: stats.countByGrade[grade] || 0,
    color: gradeColors[grade]
  }));

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle>Grade Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="grade" />
            <YAxis allowDecimals={false} />
            <Tooltip 
              formatter={(value: number) => [`${value} Course${value !== 1 ? 's' : ''}`, 'Count']}
              labelStyle={{ color: '#000' }}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '0.5rem',
                border: '1px solid rgb(229, 231, 235)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#8884d8" 
              radius={[4, 4, 0, 0]}
              barSize={30}
              background={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              animationDuration={1000} 
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <rect 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-secondary rounded-md">
            <p className="text-sm text-muted-foreground">Total Credits</p>
            <p className="text-xl font-bold">{stats.totalCredits}</p>
          </div>
          <div className="text-center p-2 bg-secondary rounded-md">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-xl font-bold">{stats.completedCredits}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
