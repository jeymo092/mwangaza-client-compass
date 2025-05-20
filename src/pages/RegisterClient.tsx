
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";
import MainSidebar from "@/components/Sidebar";
import ClientForm from "@/components/ClientForm";
import { Client, mockClients } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, FileSpreadsheet, Download, Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const RegisterClient = () => {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIntake, setSelectedIntake] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const handleClientAdded = (client: Client) => {
    setClients((prev) => [client, ...prev]);
  };

  const handleExport = (format: "pdf" | "excel" | "csv") => {
    // In a real application, this would generate and download the file
    const exportType = format === "pdf" ? "PDF" : format === "excel" ? "Excel" : "CSV";
    console.log(`Exporting ${filteredClients.length} clients to ${exportType}`);
    
    // Simulate download
    setTimeout(() => {
      alert(`${filteredClients.length} clients exported as ${exportType}`);
    }, 500);
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = searchTerm === "" || 
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIntake = selectedIntake === null || client.intake === selectedIntake;
    
    return matchesSearch && matchesIntake;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MainSidebar />
        <div className="flex-1">
          <Navbar title="Client Registration" />
          <main className="container-custom py-6">
            <div className="mb-8">
              <ClientForm onClientAdded={handleClientAdded} standalone={true} />
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Registered Clients</CardTitle>
                    <CardDescription>List of all registered clients</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <div className="p-2">
                          <Label htmlFor="filter-intake" className="text-xs">Filter by Intake</Label>
                          <Select 
                            value={selectedIntake || "all"} 
                            onValueChange={(value) => setSelectedIntake(value === "all" ? null : value)}
                          >
                            <SelectTrigger id="filter-intake">
                              <SelectValue placeholder="Select intake" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Intakes</SelectItem>
                              {generateIntakeOptions().map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <div className="relative">
                      <Search className="h-4 w-4 absolute top-3 left-3 text-gray-400" />
                      <Input
                        placeholder="Search clients..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleExport("pdf")}>
                          <FileText className="h-4 w-4 mr-2" />
                          Export as PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport("excel")}>
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Export as Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport("csv")}>
                          <FileText className="h-4 w-4 mr-2" />
                          Export as CSV
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admission No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Intake</TableHead>
                      <TableHead>DOB</TableHead>
                      <TableHead>Original Home</TableHead>
                      <TableHead>Parent/Guardian</TableHead>
                      <TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedClients.length > 0 ? (
                      paginatedClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.admissionNumber}</TableCell>
                          <TableCell>{`${client.firstName} ${client.lastName}`}</TableCell>
                          <TableCell>{client.intake || "N/A"}</TableCell>
                          <TableCell>{client.dateOfBirth}</TableCell>
                          <TableCell>{client.originalHome}</TableCell>
                          <TableCell>{client.parents[0]?.name || "N/A"}</TableCell>
                          <TableCell>{client.parents[0]?.contact || "N/A"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No clients found matching your filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }
                          
                          return (
                            <PaginationItem key={i}>
                              <PaginationLink
                                isActive={currentPage === pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default RegisterClient;
