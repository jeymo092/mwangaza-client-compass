
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { User, roleToDepartmentMap, departments } from "@/utils/types";

const Index = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Department user accounts
  const departmentUsers: User[] = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@mwangaza.org",
      role: "admin",
      departmentId: "admin"
    },
    {
      id: "2",
      name: "Social Worker",
      email: "social@mwangaza.org",
      role: "social_worker",
      departmentId: "social_work"
    },
    {
      id: "3",
      name: "Psychologist",
      email: "psycho@mwangaza.org",
      role: "psychologist",
      departmentId: "psychology"
    },
    {
      id: "4",
      name: "Educator",
      email: "teacher@mwangaza.org",
      role: "educator",
      departmentId: "education"
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    // Find user with matching email
    const user = departmentUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
    
    // Simple authentication (in a real app, this would check password hash)
    setTimeout(() => {
      setIsLoading(false);
      
      if (user && password === "password123") {
        // Store user info in session storage
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        toast.success(`Welcome ${user.name}! Logged in as ${user.role.replace('_', ' ')}`);
        navigate("/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Mwangaza</h1>
          <p className="text-lg text-muted-foreground">Rehabilitation Center</p>
        </div>

        <Card className="border-muted/40 shadow-lg">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="staff@mwangaza.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <CardFooter className="flex justify-end p-0 pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-sm space-y-2">
          <p className="text-muted-foreground font-semibold">Department Logins</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
            {departmentUsers.map(user => (
              <div key={user.id} className="text-xs bg-background/80 p-2 rounded-md shadow-sm">
                <p className="font-bold">{user.name}</p>
                <p>Email: {user.email}</p>
                <p>Password: password123</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
