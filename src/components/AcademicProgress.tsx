
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { AcademicRecord, mockSubjects } from "@/utils/types";

interface AcademicProgressProps {
  clientId: string;
  academicRecords: AcademicRecord[];
  onRecordAdded?: (record: AcademicRecord) => void;
}

const AcademicProgress = ({ clientId, academicRecords = [], onRecordAdded }: AcademicProgressProps) => {
  const [subjectId, setSubjectId] = useState("");
  const [score, setScore] = useState("");
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split("T")[0]);
  const [comments, setComments] = useState("");

  const calculateGrade = (score: number): string => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subjectId || !score || !assessmentDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const scoreNum = parseInt(score, 10);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      toast.error("Score must be a number between 0 and 100");
      return;
    }

    const subjectName = mockSubjects.find(s => s.id === subjectId)?.name || "";
    
    const newRecord: AcademicRecord = {
      id: `ar${Date.now()}`,
      clientId,
      subjectId,
      subjectName,
      score: scoreNum,
      grade: calculateGrade(scoreNum),
      assessmentDate,
      comments
    };

    if (onRecordAdded) {
      onRecordAdded(newRecord);
      toast.success("Academic record added successfully");

      // Reset form
      setSubjectId("");
      setScore("");
      setAssessmentDate(new Date().toISOString().split("T")[0]);
      setComments("");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Academic Progress</CardTitle>
          <CardDescription>
            View and add academic assessment records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {academicRecords.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {academicRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.assessmentDate}</TableCell>
                    <TableCell>{record.subjectName}</TableCell>
                    <TableCell>{record.score}/100</TableCell>
                    <TableCell>{record.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No academic records found
            </div>
          )}
        </CardContent>
      </Card>

      {onRecordAdded && (
        <Card>
          <CardHeader>
            <CardTitle>Add Assessment Record</CardTitle>
            <CardDescription>Record a new academic assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subjectId} onValueChange={setSubjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessmentDate">Assessment Date</Label>
                  <Input
                    id="assessmentDate"
                    type="date"
                    value={assessmentDate}
                    onChange={(e) => setAssessmentDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="score">Score (0-100)</Label>
                  <Input
                    id="score"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter score"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Additional notes or observations"
                  />
                </div>
              </div>

              <CardFooter className="flex justify-end p-0 pt-4">
                <Button type="submit">Add Record</Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AcademicProgress;
