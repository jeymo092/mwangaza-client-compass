
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Client, mockClients } from "@/utils/types";
import { FileText, FileSpreadsheet, Download } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientFormProps {
  onClientAdded: (client: Client) => void;
  standalone?: boolean;
}

const ClientForm = ({ onClientAdded, standalone = false }: ClientFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [originalHome, setOriginalHome] = useState("");
  const [street, setStreet] = useState("");
  const [intake, setIntake] = useState(getCurrentIntake());
  
  const [parentName, setParentName] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [parentLocation, setParentLocation] = useState("");
  const [parentRelationship, setParentRelationship] = useState("Mother");

  function getCurrentIntake() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // Generate available intakes (current month and past 11 months)
  const generateIntakeOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      const intakeValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const intakeLabel = new Date(date.getFullYear(), date.getMonth(), 1)
        .toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      
      options.push({ value: intakeValue, label: intakeLabel });
    }
    
    return options;
  };

  const intakeOptions = generateIntakeOptions();

  // Generate the next admission number
  const generateAdmissionNumber = () => {
    const currentYear = new Date().getFullYear();
    const lastAdmissionNumber = mockClients
      .map(client => client.admissionNumber)
      .filter(num => num.startsWith(`MWZ${currentYear}`))
      .sort()
      .pop();

    let nextNumber = 1;
    if (lastAdmissionNumber) {
      const lastNumberStr = lastAdmissionNumber.substring(7); // Extract the number part
      nextNumber = parseInt(lastNumberStr, 10) + 1;
    }
    
    return `MWZ${currentYear}${nextNumber.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !dateOfBirth || !originalHome || !parentName || !parentContact) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newClient: Client = {
      id: `c${Date.now()}`,
      admissionNumber: generateAdmissionNumber(),
      firstName,
      lastName,
      dateOfBirth,
      gender,
      originalHome,
      street,
      intake: intake,
      admissionDate: new Date().toISOString().split('T')[0],
      parents: [
        {
          id: `p${Date.now()}`,
          name: parentName,
          contact: parentContact,
          location: parentLocation,
          relationship: parentRelationship
        }
      ]
    };

    onClientAdded(newClient);
    toast.success(`Client registered with admission number: ${newClient.admissionNumber}`);

    // Reset form
    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setGender("male");
    setOriginalHome("");
    setStreet("");
    setIntake(getCurrentIntake());
    setParentName("");
    setParentContact("");
    setParentLocation("");
    setParentRelationship("Mother");
  };

  return (
    <Card className={standalone ? "max-w-4xl mx-auto" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Register New Client</CardTitle>
          <CardDescription>
            Enter client details. An admission number will be automatically assigned.
          </CardDescription>
        </div>
        {standalone && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={(value) => setGender(value as "male" | "female" | "other")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="intake">Intake</Label>
              <Select value={intake} onValueChange={setIntake}>
                <SelectTrigger id="intake">
                  <SelectValue placeholder="Select intake" />
                </SelectTrigger>
                <SelectContent>
                  {intakeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originalHome">Original Home</Label>
              <Input
                id="originalHome"
                value={originalHome}
                onChange={(e) => setOriginalHome(e.target.value)}
                placeholder="E.g., Nairobi"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="E.g., Eastleigh"
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Parent/Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentName">Name</Label>
                <Input
                  id="parentName"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Enter parent's name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentRelationship">Relationship</Label>
                <Select value={parentRelationship} onValueChange={setParentRelationship}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mother">Mother</SelectItem>
                    <SelectItem value="Father">Father</SelectItem>
                    <SelectItem value="Guardian">Guardian</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="parentContact">Contact</Label>
                <Input
                  id="parentContact"
                  value={parentContact}
                  onChange={(e) => setParentContact(e.target.value)}
                  placeholder="E.g., +254712345678"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentLocation">Location</Label>
                <Input
                  id="parentLocation"
                  value={parentLocation}
                  onChange={(e) => setParentLocation(e.target.value)}
                  placeholder="E.g., Nairobi, Eastleigh"
                />
              </div>
            </div>
          </div>

          <CardFooter className="flex justify-end p-0 pt-4">
            <Button type="submit">Register Client</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClientForm;
