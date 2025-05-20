
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Users, FileText, Calendar, BarChart3, BookOpen, UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import MainSidebar from "@/components/Sidebar";
import ClientForm from "@/components/ClientForm";
import { mockClients, mockHomeVisits, mockAcademicRecords, Client, departments } from "@/utils/types";
import DepartmentAccess from "@/components/DepartmentAccess";

const Dashboard = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState(mockClients);
  const recentHomeVisits = mockHomeVisits.slice(0, 3);
  const totalAcademicRecords = mockAcademicRecords.length;

  const handleClientAdded = (client: Client) => {
    setClients((prev) => [client, ...prev]);
  };

  const handleRegisterClientClick = () => {
    navigate('/clients/register');
  };

  const StatCard = ({ title, value, description, icon, className }: { title: string, value: string | number, description: string, icon: React.ReactNode, className?: string }) => (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MainSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container-custom py-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <Button onClick={handleRegisterClientClick}>
                <UserPlus className="h-4 w-4 mr-2" />
                Register New Client
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Clients"
                value={clients.length}
                description="Active rehabilitation clients"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                className="bg-blue-50"
              />
              <StatCard
                title="Home Visits"
                value={mockHomeVisits.length}
                description="Completed home assessment visits"
                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                className="bg-green-50"
              />
              <StatCard
                title="Academic Records"
                value={totalAcademicRecords}
                description="Subject performance records"
                icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
                className="bg-purple-50"
              />
              <StatCard
                title="Departments"
                value={departments.length}
                description="Active center departments"
                icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                className="bg-amber-50"
              />
            </div>

            <div className="mt-8">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="reports">Recent Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Clients</CardTitle>
                        <CardDescription>Recently admitted clients</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {clients.slice(0, 5).map((client) => (
                            <div key={client.id} className="flex items-center justify-between border-b pb-2">
                              <div>
                                <p className="font-medium">{client.firstName} {client.lastName}</p>
                                <p className="text-sm text-muted-foreground">{client.admissionNumber}</p>
                              </div>
                              <Button variant="outline" asChild>
                                <Link to={`/clients/${client.id}`}>View</Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <Button variant="outline" asChild>
                            <Link to="/clients">View All Clients</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Home Visits</CardTitle>
                        <CardDescription>Latest client home assessments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentHomeVisits.map((visit) => (
                            <div key={visit.id} className="border-b pb-2">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium">
                                  {clients.find(c => c.id === visit.clientId)?.firstName || ""}
                                  {" "}
                                  {clients.find(c => c.id === visit.clientId)?.lastName || ""}
                                </p>
                                <span className="text-sm text-muted-foreground">{visit.date}</span>
                              </div>
                              <p className="text-sm line-clamp-2">{visit.summary}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <Button variant="outline" asChild>
                            <Link to="/reports">View All Reports</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <DepartmentAccess allowedRoles={["admin", "social_worker"]}>
                    <div className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Department Statistics</CardTitle>
                          <CardDescription>Activity across departments</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-3">
                            {departments.map((dept) => (
                              <Card key={dept.id} className="bg-muted/20">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-medium">{dept.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold">{dept.staffCount}</span>
                                    <span className="text-xs text-muted-foreground">Staff</span>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </DepartmentAccess>
                </TabsContent>

                <TabsContent value="reports" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Reports Summary</CardTitle>
                      <CardDescription>Latest activities and assessments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex justify-between">
                            <h3 className="font-semibold">Home Visits</h3>
                            <span className="text-muted-foreground">{mockHomeVisits.length} total</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {mockHomeVisits.length > 0 ? 
                              `Last visit conducted on ${mockHomeVisits[0].date}` : 
                              "No home visits recorded"}
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-green-500 pl-4 py-2">
                          <div className="flex justify-between">
                            <h3 className="font-semibold">Academic Assessments</h3>
                            <span className="text-muted-foreground">{totalAcademicRecords} total</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {totalAcademicRecords > 0 ? 
                              `Average performance: ${Math.round(mockAcademicRecords.reduce((sum, record) => sum + record.score, 0) / totalAcademicRecords)}%` : 
                              "No academic records"}
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-amber-500 pl-4 py-2">
                          <div className="flex justify-between">
                            <h3 className="font-semibold">Client Admissions</h3>
                            <span className="text-muted-foreground">{clients.length} total</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {clients.length > 0 ?
                              `Latest admission: ${clients[0].admissionDate}` :
                              "No clients registered"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
