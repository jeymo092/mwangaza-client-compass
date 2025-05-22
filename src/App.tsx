
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientProfile from "./pages/ClientProfile";
import RegisterClient from "./pages/RegisterClient";
import Reports from "./pages/Reports";
import DatabaseConfig from "./pages/DatabaseConfig";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./utils/types";
import { testConnection } from "./utils/db";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const user = getCurrentUser();
    setIsAuthenticated(!!user.id);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const queryClient = new QueryClient();

const App = () => {
  // Test database connection on app load
  useEffect(() => {
    const initDB = async () => {
      // Check if we have database settings in localStorage
      const hasDBConfig = localStorage.getItem('DB_HOST') && 
                         localStorage.getItem('DB_USER') && 
                         localStorage.getItem('DB_NAME');
      
      if (hasDBConfig) {
        // Set environment variables from localStorage
        process.env.DB_HOST = localStorage.getItem('DB_HOST') || undefined;
        process.env.DB_USER = localStorage.getItem('DB_USER') || undefined;
        process.env.DB_PASSWORD = localStorage.getItem('DB_PASSWORD') || undefined;
        process.env.DB_NAME = localStorage.getItem('DB_NAME') || undefined;
        
        // Test connection
        await testConnection();
      }
    };
    
    initDB();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            } />
            <Route path="/clients/register" element={
              <ProtectedRoute>
                <RegisterClient />
              </ProtectedRoute>
            } />
            <Route path="/clients/:id" element={
              <ProtectedRoute>
                <ClientProfile />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/database-config" element={
              <ProtectedRoute>
                <DatabaseConfig />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
