
import { getCurrentUser, UserRole } from "@/utils/types";
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
  // Get current user from session storage
  const currentUser = getCurrentUser();
  
  // Check if current user role is in the allowed roles
  const hasRoleAccess = allowedRoles.includes(currentUser.role);
  
  // If departmentId is provided, check if user has access to that department
  const hasDepartmentAccess = allowedDepartments.length === 0 || 
    (currentUser.departmentId && allowedDepartments.includes(currentUser.departmentId));
  
  // Admin has access to everything regardless of department
  const isAdmin = currentUser.role === "admin";
  
  // Social workers have special access to client-related operations
  const hasSocialWorkerAccess = 
    currentUser.role === "social_worker" && 
    allowedRoles.includes("admin") && 
    (allowedRoles.includes("social_worker") || allowedRoles.includes("admin"));
  
  // Grant access if user is admin, has both role and department access, or has social worker access
  const hasAccess = isAdmin || hasSocialWorkerAccess || (hasRoleAccess && hasDepartmentAccess);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default DepartmentAccess;
