
import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";
import MainSidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { testConnection } from "@/utils/db";
import { useNavigate } from "react-router-dom";
import DepartmentAccess from "@/components/DepartmentAccess";
import { Database, ServerCog } from "lucide-react";

const DatabaseConfig = () => {
  const navigate = useNavigate();
  const [host, setHost] = useState(localStorage.getItem('DB_HOST') || 'localhost');
  const [user, setUser] = useState(localStorage.getItem('DB_USER') || 'root');
  const [password, setPassword] = useState(localStorage.getItem('DB_PASSWORD') || '');
  const [database, setDatabase] = useState(localStorage.getItem('DB_NAME') || 'mwangaza_db');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // Test connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (host && user && database) {
        setConnectionStatus('testing');
        const isConnected = await testConnection();
        setConnectionStatus(isConnected ? 'success' : 'error');
      }
    };
    
    checkConnection();
  }, []);

  const handleSaveConfig = () => {
    // Save to localStorage
    localStorage.setItem('DB_HOST', host);
    localStorage.setItem('DB_USER', user);
    localStorage.setItem('DB_PASSWORD', password);
    localStorage.setItem('DB_NAME', database);
    
    // Update environment variables (in client-side context)
    process.env.DB_HOST = host;
    process.env.DB_USER = user;
    process.env.DB_PASSWORD = password;
    process.env.DB_NAME = database;
    
    toast.success("Database configuration saved");
    testConnection();
  };

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    
    // Temporarily set environment variables for testing
    const prevHost = process.env.DB_HOST;
    const prevUser = process.env.DB_USER;
    const prevPassword = process.env.DB_PASSWORD;
    const prevDatabase = process.env.DB_NAME;
    
    process.env.DB_HOST = host;
    process.env.DB_USER = user;
    process.env.DB_PASSWORD = password;
    process.env.DB_NAME = database;
    
    const result = await testConnection();
    
    // Restore previous values if test failed
    if (!result) {
      process.env.DB_HOST = prevHost;
      process.env.DB_USER = prevUser;
      process.env.DB_PASSWORD = prevPassword;
      process.env.DB_NAME = prevDatabase;
    }
    
    setConnectionStatus(result ? 'success' : 'error');
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
                <Database className="h-6 w-6 mr-2" />
                <h1 className="text-3xl font-bold">Database Configuration</h1>
              </div>
            </div>
            
            <DepartmentAccess allowedRoles={["admin"]}>
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ServerCog className="mr-2 h-5 w-5" />
                    MySQL Database Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your MySQL database connection for the application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="host">Database Host</Label>
                    <Input
                      id="host"
                      value={host}
                      onChange={(e) => setHost(e.target.value)}
                      placeholder="localhost"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user">Database User</Label>
                    <Input
                      id="user"
                      value={user}
                      onChange={(e) => setUser(e.target.value)}
                      placeholder="root"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Database Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="database">Database Name</Label>
                    <Input
                      id="database"
                      value={database}
                      onChange={(e) => setDatabase(e.target.value)}
                      placeholder="mwangaza_db"
                    />
                  </div>
                  
                  {connectionStatus === 'success' && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800 flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Connected successfully to database
                    </div>
                  )}
                  
                  {connectionStatus === 'error' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                        Failed to connect to database
                      </div>
                      <p className="text-sm mt-1">Please check your connection details and ensure the MySQL server is running.</p>
                    </div>
                  )}
                  
                  {connectionStatus === 'testing' && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 flex items-center">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500 mr-2"></div>
                      Testing connection...
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleTestConnection}
                    disabled={connectionStatus === 'testing'}
                  >
                    Test Connection
                  </Button>
                  <Button 
                    onClick={handleSaveConfig}
                    disabled={connectionStatus === 'testing'}
                  >
                    Save Configuration
                  </Button>
                </CardFooter>
              </Card>
            </DepartmentAccess>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DatabaseConfig;
