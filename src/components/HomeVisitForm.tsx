
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { HomeVisit } from "@/utils/types";
import { currentUser } from "@/utils/types";

interface HomeVisitFormProps {
  clientId: string;
  onVisitAdded: (visit: HomeVisit) => void;
}

const HomeVisitForm = ({ clientId, onVisitAdded }: HomeVisitFormProps) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [summary, setSummary] = useState("");
  const [recommendations, setRecommendations] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !summary) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newVisit: HomeVisit = {
      id: `hv${Date.now()}`,
      clientId,
      date,
      conductedBy: currentUser.name,
      summary,
      recommendations
    };

    onVisitAdded(newVisit);
    toast.success("Home visit report added successfully");

    // Reset form
    setDate(new Date().toISOString().split("T")[0]);
    setSummary("");
    setRecommendations("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Home Visit Report</CardTitle>
        <CardDescription>Record details of the home visit</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visitDate">Visit Date</Label>
            <Input
              id="visitDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Visit Summary</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe the home environment, family interactions, observations..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendations">Recommendations</Label>
            <Textarea
              id="recommendations"
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="Suggest follow-up actions, interventions, or support needed..."
              className="min-h-[80px]"
            />
          </div>

          <CardFooter className="flex justify-end p-0 pt-4">
            <Button type="submit">Submit Report</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default HomeVisitForm;
