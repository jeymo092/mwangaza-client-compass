
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { 
  Client, 
  ClientStatus, 
  ReintegrationProgram, 
  AftercareProgramDetails 
} from "@/utils/types";
import { updateClientStatus } from "@/services/clientService";

interface AftercareProgramFormProps {
  client: Client;
  onStatusUpdate: (updatedClient: Client) => void;
}

const AftercareProgramForm = ({ client, onStatusUpdate }: AftercareProgramFormProps) => {
  const [status, setStatus] = useState<ClientStatus>(client.status || "active");
  const [programType, setProgramType] = useState<ReintegrationProgram>("school");
  const [institutionName, setInstitutionName] = useState(client.aftercareDetails?.institutionName || "");
  const [contactPerson, setContactPerson] = useState(client.aftercareDetails?.contactPerson || "");
  const [contactDetails, setContactDetails] = useState(client.aftercareDetails?.contactDetails || "");
  const [startDate, setStartDate] = useState(client.aftercareDetails?.startDate || new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState(client.aftercareDetails?.notes || "");
  const [showProgramDetails, setShowProgramDetails] = useState(status === "successful_reintegration");
  
  useEffect(() => {
    // Only show program details for successful reintegration
    setShowProgramDetails(status === "successful_reintegration");
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let aftercareDetails: AftercareProgramDetails | undefined;
      
      // Only include aftercare details for successful reintegrations
      if (status === "successful_reintegration") {
        aftercareDetails = {
          programType,
          institutionName: institutionName || undefined,
          contactPerson: contactPerson || undefined,
          contactDetails: contactDetails || undefined,
          startDate,
          notes: notes || undefined
        };
      }

      const updatedClient = await updateClientStatus(client.id, status, aftercareDetails);
      
      if (updatedClient) {
        toast.success("Client status updated successfully");
        onStatusUpdate(updatedClient);
      } else {
        toast.error("Failed to update client status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating client status");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aftercare & Reintegration Status</CardTitle>
        <CardDescription>Update client's current status and program details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Client Status</Label>
            <Select 
              value={status} 
              onValueChange={(value: ClientStatus) => setStatus(value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select client status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="successful_reintegration">Successful Reintegration</SelectItem>
                <SelectItem value="early_reintegration">Early Reintegration</SelectItem>
                <SelectItem value="discharge">Discharge</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showProgramDetails && (
            <>
              <div className="space-y-2">
                <Label htmlFor="programType">Program Type</Label>
                <Select 
                  value={programType} 
                  onValueChange={(value: ReintegrationProgram) => setProgramType(value)}
                >
                  <SelectTrigger id="programType">
                    <SelectValue placeholder="Select program type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="training_institution">Training Institution</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="independent_living">Independent Living</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionName">Institution/School Name</Label>
                <Input
                  id="institutionName"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="Name of school or training institution"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Name of contact person"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactDetails">Contact Details</Label>
                  <Input
                    id="contactDetails"
                    value={contactDetails}
                    onChange={(e) => setContactDetails(e.target.value)}
                    placeholder="Phone or email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Program Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional details about the program or arrangement"
                  className="min-h-[100px]"
                />
              </div>
            </>
          )}

          <CardFooter className="flex justify-end p-0 pt-4">
            <Button type="submit">Update Status</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default AftercareProgramForm;
