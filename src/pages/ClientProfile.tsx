
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { SidebarProvider } from "@/components/ui/sidebar";
import { User, FileText, CalendarDays, BookOpen, Home, GraduationCap } from "lucide-react";
import Navbar from "@/components/Navbar";
import MainSidebar from "@/components/Sidebar";
import AcademicProgress from "@/components/AcademicProgress";
import HomeVisitForm from "@/components/HomeVisitForm";
import AftercareProgramForm from "@/components/AftercareProgramForm";
import { Client, HomeVisit, AcademicRecord, mockClients, mockHomeVisits, mockAcademicRecords } from "@/utils/types";
import DepartmentAccess from "@/components/DepartmentAccess";
import { toast } from "@/components/ui/sonner";

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | undefined>(mockClients.find(c => c.id === id));
  const [homeVisits, setHomeVisits] = useState<HomeVisit[]>(
    mockHomeVisits.filter(visit => visit.clientId === id)
  );
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>(
    mockAcademicRecords.filter(record => record.clientId === id)
  );
  const [notes, setNotes] = useState(client?.notes || "");

  if (!client) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <MainSidebar />
          <div className="flex-1">
            <Navbar />
            <main className="container-custom py-6">
              <div className="flex flex-col items-center justify-center h-[60vh]">
                <User className="h-16 w-16 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Client Not Found</h1>
                <p className="text-muted-foreground mb-4">The client you are looking for doesn't exist or has been removed.</p>
                <Button asChild>
                  <Link to="/clients">Back to All Clients</Link>
                </Button>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const handleHomeVisitAdded = (visit: HomeVisit) => {
    setHomeVisits(prev => [visit, ...prev]);
  };

  const handleAcademicRecordAdded = (record: AcademicRecord) => {
    setAcademicRecords(prev => [record, ...prev]);
  };

  const handleNotesUpdate = () => {
    setClient(prev => prev ? { ...prev, notes } : undefined);
    toast.success("Client notes updated successfully");
  };

  const handleClientStatusUpdate = (updatedClient: Client) => {
    setClient(updatedClient);
  };

  // Helper function to get status badge variant
  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case "successful_reintegration": return "success";
      case "early_reintegration": return "warning";
      case "discharge": return "secondary";
      case "referral": return "outline";
      default: return "default";
    }
  };

  // Format status for display
  const formatStatus = (status?: string) => {
    if (!status) return "Active";
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MainSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container-custom py-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Link to="/clients" className="hover:text-foreground">Clients</Link>
                <span>/</span>
                <span className="text-foreground">{client.firstName} {client.lastName}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {client.firstName} {client.lastName}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{client.admissionNumber}</Badge>
                      <Badge variant="secondary" className="capitalize">{client.gender}</Badge>
                      <Badge variant={getStatusBadgeVariant(client.status)}>{formatStatus(client.status)}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/reports/new?clientId=${client.id}`}>
                      <FileText className="mr-1 h-4 w-4" />
                      New Report
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to={`/clients/edit/${client.id}`}>
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                      <p>{client.firstName} {client.lastName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Admission Number</h3>
                      <p>{client.admissionNumber}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
                      <p>{client.dateOfBirth}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
                      <p className="capitalize">{client.gender}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Original Home</h3>
                      <p>
                        {client.originalHome}
                        {client.street && `, ${client.street}`}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Admission Date</h3>
                      <p>{client.admissionDate}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <p className="capitalize">{formatStatus(client.status)}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Parents/Guardians</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {client.parents && client.parents.length > 0 ? (
                      <div className="space-y-4">
                        {client.parents.map((parent) => (
                          <div key={parent.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{parent.name}</h3>
                              <Badge variant="outline">{parent.relationship}</Badge>
                            </div>
                            <p className="text-sm mt-1">
                              <span className="text-muted-foreground">Contact:</span> {parent.contact}
                            </p>
                            {parent.location && (
                              <p className="text-sm mt-1">
                                <span className="text-muted-foreground">Location:</span> {parent.location}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No parent/guardian information</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid grid-cols-5 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="academic">Academic</TabsTrigger>
                    <TabsTrigger value="home-visits">Home Visits</TabsTrigger>
                    <TabsTrigger value="aftercare">Aftercare</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-lg">Academic Overview</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{academicRecords.length}</div>
                          <p className="text-sm text-muted-foreground">Total academic records</p>
                          
                          {academicRecords.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Average Score:</span>
                                <span className="font-medium">
                                  {Math.round(academicRecords.reduce((sum, record) => sum + record.score, 0) / academicRecords.length)}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Last Assessment:</span>
                                <span className="text-sm">
                                  {academicRecords.sort((a, b) => 
                                    new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime()
                                  )[0].assessmentDate}
                                </span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full" onClick={() => document.getElementById("academic-tab")?.click()}>
                            View Academic Records
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-lg">Home Visits</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{homeVisits.length}</div>
                          <p className="text-sm text-muted-foreground">Total home visits conducted</p>
                          
                          {homeVisits.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm font-medium">Latest visit:</p>
                              <p className="text-sm">
                                {homeVisits.sort((a, b) => 
                                  new Date(b.date).getTime() - new Date(a.date).getTime()
                                )[0].date}
                              </p>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full" onClick={() => document.getElementById("home-visits-tab")?.click()}>
                            View Home Visits
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Client Summary</CardTitle>
                        <CardDescription>
                          Key information and recent activities
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="border-l-4 border-primary pl-4 py-2">
                          <h3 className="font-medium">Admission Information</h3>
                          <p className="text-sm">
                            Admitted on {client.admissionDate} with number {client.admissionNumber}.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-secondary pl-4 py-2">
                          <h3 className="font-medium">Academic Status</h3>
                          <p className="text-sm">
                            {academicRecords.length > 0 
                              ? `Has ${academicRecords.length} academic records across ${new Set(academicRecords.map(r => r.subjectId)).size} subjects.`
                              : "No academic records available yet."}
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-muted pl-4 py-2">
                          <h3 className="font-medium">Home Environment</h3>
                          <p className="text-sm">
                            {homeVisits.length > 0
                              ? `${homeVisits.length} home visits conducted. Latest visit: ${homeVisits.sort((a, b) => 
                                  new Date(b.date).getTime() - new Date(a.date).getTime()
                                )[0].date}.`
                              : "No home visits conducted yet."}
                          </p>
                        </div>

                        {client.status === "successful_reintegration" && client.aftercareDetails && (
                          <div className="border-l-4 border-green-500 pl-4 py-2">
                            <h3 className="font-medium">Reintegration Program</h3>
                            <p className="text-sm">
                              Successfully reintegrated into {client.aftercareDetails.programType.replace('_', ' ')} 
                              {client.aftercareDetails.institutionName && `: ${client.aftercareDetails.institutionName}`}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="academic" id="academic-tab">
                    <AcademicProgress 
                      clientId={client.id}
                      academicRecords={academicRecords}
                      onRecordAdded={handleAcademicRecordAdded}
                    />
                  </TabsContent>

                  <TabsContent value="home-visits" id="home-visits-tab">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Home Visit Reports</CardTitle>
                          <CardDescription>
                            Record of all home assessment visits
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {homeVisits.length > 0 ? (
                            <div className="space-y-6">
                              {homeVisits
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((visit) => (
                                  <div key={visit.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-2">
                                      <h3 className="font-medium">Visit on {visit.date}</h3>
                                      <Badge variant="outline">By {visit.conductedBy}</Badge>
                                    </div>
                                    <div className="space-y-3">
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Summary</h4>
                                        <p className="text-sm">{visit.summary}</p>
                                      </div>
                                      {visit.recommendations && (
                                        <div>
                                          <h4 className="text-sm font-medium text-muted-foreground">Recommendations</h4>
                                          <p className="text-sm">{visit.recommendations}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 text-muted-foreground">
                              <CalendarDays className="mx-auto h-8 w-8 mb-2" />
                              <p>No home visits recorded yet</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <DepartmentAccess allowedRoles={["admin", "social_worker"]}>
                        <HomeVisitForm 
                          clientId={client.id}
                          onVisitAdded={handleHomeVisitAdded}
                        />
                      </DepartmentAccess>
                    </div>
                  </TabsContent>

                  <TabsContent value="aftercare" id="aftercare-tab">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-muted-foreground" />
                            <CardTitle>Aftercare & Reintegration Status</CardTitle>
                          </div>
                          <CardDescription>
                            Current status and reintegration progress
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {client.status === "successful_reintegration" && client.aftercareDetails ? (
                            <div className="space-y-4">
                              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="success">Successfully Reintegrated</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {client.aftercareDetails.startDate && `Since ${client.aftercareDetails.startDate}`}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium">Program</h4>
                                    <p className="capitalize">{client.aftercareDetails.programType.replace('_', ' ')}</p>
                                  </div>
                                  
                                  {client.aftercareDetails.institutionName && (
                                    <div>
                                      <h4 className="text-sm font-medium">Institution</h4>
                                      <p>{client.aftercareDetails.institutionName}</p>
                                    </div>
                                  )}
                                  
                                  {client.aftercareDetails.contactPerson && (
                                    <div>
                                      <h4 className="text-sm font-medium">Contact Person</h4>
                                      <p>{client.aftercareDetails.contactPerson}</p>
                                    </div>
                                  )}
                                  
                                  {client.aftercareDetails.contactDetails && (
                                    <div>
                                      <h4 className="text-sm font-medium">Contact Details</h4>
                                      <p>{client.aftercareDetails.contactDetails}</p>
                                    </div>
                                  )}
                                </div>
                                
                                {client.aftercareDetails.notes && (
                                  <div className="mt-3">
                                    <h4 className="text-sm font-medium">Notes</h4>
                                    <p className="text-sm mt-1">{client.aftercareDetails.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : client.status && client.status !== "active" ? (
                            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={getStatusBadgeVariant(client.status)}>{formatStatus(client.status)}</Badge>
                              </div>
                              <p className="text-sm">No detailed program information available.</p>
                            </div>
                          ) : (
                            <div className="text-center py-6 text-muted-foreground">
                              <GraduationCap className="mx-auto h-8 w-8 mb-2" />
                              <p>Client currently active in the program</p>
                              <p className="text-sm mt-1">Update status when client is reintegrated or discharged</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <DepartmentAccess allowedRoles={["admin", "social_worker"]}>
                        <AftercareProgramForm 
                          client={client}
                          onStatusUpdate={handleClientStatusUpdate}
                        />
                      </DepartmentAccess>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" id="notes-tab">
                    <Card>
                      <CardHeader>
                        <CardTitle>Client Notes</CardTitle>
                        <CardDescription>
                          Record observations, progress, and important information
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea 
                          value={notes} 
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Enter notes about the client's progress, behavior, special needs, etc."
                          className="min-h-[200px]"
                        />
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button onClick={handleNotesUpdate}>Save Notes</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ClientProfile;
