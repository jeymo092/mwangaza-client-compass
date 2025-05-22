
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FileText, Search, Calendar, Download, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import MainSidebar from "@/components/Sidebar";
import { HomeVisit, mockHomeVisits, mockClients, currentUser } from "@/utils/types";
import { toast } from "@/components/ui/sonner";
import jsPDF from "jspdf";
// Using the correct import for jspdf-autotable
import autoTable from "jspdf-autotable";
import DepartmentAccess from "@/components/DepartmentAccess";

const Reports = () => {
  const [reports, setReports] = useState<HomeVisit[]>(mockHomeVisits);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const filteredReports = reports
    .filter(report => {
      // Apply date filter
      if (dateFilter === "all") return true;
      if (dateFilter === "last-month") {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return new Date(report.date) >= lastMonth;
      }
      if (dateFilter === "last-week") {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        return new Date(report.date) >= lastWeek;
      }
      return true;
    })
    .filter(report => {
      // Apply search query
      if (!searchQuery) return true;
      
      const clientName = (() => {
        const client = mockClients.find(c => c.id === report.clientId);
        return client ? `${client.firstName} ${client.lastName}`.toLowerCase() : "";
      })();
      
      return (
        clientName.includes(searchQuery.toLowerCase()) ||
        report.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.conductedBy.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Export to PDF function
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text("Mwangaza Rehabilitation Center - Home Visit Reports", 14, 15);
      doc.setFontSize(12);
      doc.text(`Generated on ${new Date().toLocaleDateString()} by ${currentUser.name}`, 14, 23);
      
      // Prepare data for table
      const tableData = filteredReports.map(report => {
        const client = mockClients.find(c => c.id === report.clientId);
        return [
          client ? `${client.firstName} ${client.lastName}` : "Unknown Client",
          report.date,
          report.conductedBy,
          report.summary.substring(0, 60) + (report.summary.length > 60 ? "..." : ""),
        ];
      });
      
      // Generate table
      autoTable(doc, {
        head: [["Client Name", "Visit Date", "Conducted By", "Summary"]],
        body: tableData,
        startY: 30,
        headStyles: { fillColor: [41, 128, 185] },
      });
      
      // Save the PDF
      doc.save("mwangaza-home-visit-reports.pdf");
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("Failed to export PDF:", error);
      toast.error("Failed to export PDF");
    }
  };
  
  // Export to CSV function using browser-native approach
  const exportToCSV = () => {
    try {
      // Prepare headers
      const headers = ["Client Name", "Visit Date", "Conducted By", "Summary", "Recommendations"];
      
      // Prepare data rows
      const dataRows = filteredReports.map(report => {
        const client = mockClients.find(c => c.id === report.clientId);
        return [
          client ? `${client.firstName} ${client.lastName}` : "Unknown Client",
          report.date,
          report.conductedBy,
          report.summary,
          report.recommendations || ""
        ];
      });
      
      // Combine headers and rows
      const csvContent = [
        headers.join(','), 
        ...dataRows.map(row => 
          row.map(cell => 
            // Handle special characters and commas in cell values
            typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n')) 
              ? `"${cell.replace(/"/g, '""')}"` 
              : cell
          ).join(',')
        )
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "mwangaza-home-visit-reports.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSV exported successfully");
    } catch (error) {
      console.error("Failed to export CSV:", error);
      toast.error("Failed to export CSV");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MainSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container-custom py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                <h1 className="text-3xl font-bold">Reports</h1>
              </div>
              <div className="flex items-center gap-2">
                <DepartmentAccess allowedRoles={["admin", "social_worker"]}>
                  <Button variant="outline" onClick={exportToPDF} className="flex items-center gap-1">
                    <Save className="h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button variant="outline" onClick={exportToCSV} className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                </DepartmentAccess>
                <DepartmentAccess allowedRoles={["admin", "social_worker"]}>
                  <Button asChild>
                    <Link to="/reports/new">
                      New Home Visit Report
                    </Link>
                  </Button>
                </DepartmentAccess>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by client, staff, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-full md:w-[200px]">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="last-month">Last month</SelectItem>
                    <SelectItem value="last-week">Last week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => {
                  const client = mockClients.find(c => c.id === report.clientId);
                  
                  return (
                    <Card key={report.id}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                          <div>
                            <CardTitle>
                              {client ? `${client.firstName} ${client.lastName}` : "Unknown Client"}
                            </CardTitle>
                            <CardDescription>
                              Visit conducted on {report.date} by {report.conductedBy}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/clients/${report.clientId}`}>
                                View Client
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Summary</h3>
                            <p>{report.summary}</p>
                          </div>
                          {report.recommendations && (
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Recommendations</h3>
                              <p>{report.recommendations}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card className="py-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No Reports Found</h2>
                    <p className="text-muted-foreground max-w-md mb-6">
                      {searchQuery
                        ? "No reports match your search criteria. Try adjusting your filters."
                        : "There are no home visit reports in the system yet."}
                    </p>
                    <Button asChild>
                      <Link to="/reports/new">
                        Create New Report
                      </Link>
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Reports;
