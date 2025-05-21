
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const LogoutButton = ({ variant = "ghost" }: LogoutButtonProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session
    sessionStorage.removeItem("currentUser");
    toast.success("Successfully logged out");
    navigate("/");
  };

  return (
    <Button variant={variant} onClick={handleLogout}>
      <LogOut className="h-4 w-4 mr-2" />
      Log out
    </Button>
  );
};

export default LogoutButton;
