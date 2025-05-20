
import { currentUser, UserRole } from "@/utils/types";
import { ReactNode } from "react";

interface DepartmentAccessProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

const DepartmentAccess = ({ 
  allowedRoles, 
  children, 
  fallback = <div className="p-4 bg-muted rounded-md">You don't have access to this content.</div> 
}: DepartmentAccessProps) => {
  // Check if current user role is in the allowed roles
  const hasAccess = allowedRoles.includes(currentUser.role);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default DepartmentAccess;
