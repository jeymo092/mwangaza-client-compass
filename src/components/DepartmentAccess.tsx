
import { currentUser, UserRole, Department } from "@/utils/types";
import { ReactNode } from "react";

interface DepartmentAccessProps {
  allowedRoles: UserRole[];
  allowedDepartments?: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

const DepartmentAccess = ({ 
  allowedRoles, 
  allowedDepartments = [], 
  children, 
  fallback = <div className="p-4 bg-muted rounded-md">You don't have access to this content.</div> 
}: DepartmentAccessProps) => {
  // Check if current user role is in the allowed roles
  const hasRoleAccess = allowedRoles.includes(currentUser.role);
  
  // If departmentId is provided, check if user has access to that department
  const hasDepartmentAccess = allowedDepartments.length === 0 || 
    (currentUser.departmentId && allowedDepartments.includes(currentUser.departmentId));
  
  // Admin has access to everything regardless of department
  const isAdmin = currentUser.role === "admin";
  
  // Grant access if user is admin or has both role and department access
  const hasAccess = isAdmin || (hasRoleAccess && hasDepartmentAccess);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default DepartmentAccess;
