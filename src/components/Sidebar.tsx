
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, FileText, BookOpen, BarChart3 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getCurrentUser, departments, UserRole } from "@/utils/types";
import { Badge } from "@/components/ui/badge";
import DepartmentAccess from "./DepartmentAccess";
import LogoutButton from "./LogoutButton";

const MainSidebar = () => {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser.role === "admin";
  
  // Define navigation items with role access
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["admin", "social_worker", "psychologist", "educator"] },
    { name: "Clients", href: "/clients", icon: Users, roles: ["admin", "social_worker", "psychologist", "educator"] },
    { name: "Reports", href: "/reports", icon: FileText, roles: ["admin", "social_worker"] },
    { name: "Education", href: "/education", icon: BookOpen, roles: ["admin", "educator"] },
    { name: "Statistics", href: "/statistics", icon: BarChart3, roles: ["admin"] },
  ];

  // Filter navigation items by user role
  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(currentUser.role as UserRole) || currentUser.role === "admin"
  );

  // Filter departments to show based on user role
  const visibleDepartments = isAdmin 
    ? departments 
    : departments.filter(dept => dept.id === currentUser.departmentId);

  return (
    <Sidebar className="border-r border-r-border">
      <SidebarHeader className="py-4">
        <div className="px-2 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-sidebar-foreground">Mwangaza</h1>
          <p className="text-xs text-sidebar-foreground/80">Rehabilitation Center</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <nav className="space-y-1 px-2 py-5">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md"
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <DepartmentAccess allowedRoles={["admin"]}>
          <div className="px-2 py-5">
            <h3 className="px-3 text-sm font-medium text-sidebar-foreground/70 uppercase tracking-wider">
              All Departments
            </h3>
            <div className="mt-2 space-y-1">
              {departments.map((department) => (
                <NavLink
                  key={department.id}
                  to={`/departments/${department.id}`}
                  className={({ isActive }) =>
                    cn(
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                      "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md"
                    )
                  }
                >
                  <span>{department.name}</span>
                  <Badge
                    variant="outline"
                    className="bg-sidebar-accent/30 text-sidebar-foreground border-sidebar-border"
                  >
                    {department.staffCount}
                  </Badge>
                </NavLink>
              ))}
            </div>
          </div>
        </DepartmentAccess>

        {!isAdmin && visibleDepartments.length > 0 && (
          <div className="px-2 py-5">
            <h3 className="px-3 text-sm font-medium text-sidebar-foreground/70 uppercase tracking-wider">
              Your Department
            </h3>
            <div className="mt-2 space-y-1">
              {visibleDepartments.map((department) => (
                <div
                  key={department.id}
                  className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md bg-sidebar-accent/20"
                >
                  <span>{department.name}</span>
                  <Badge
                    variant="outline"
                    className="bg-sidebar-accent/30 text-sidebar-foreground border-sidebar-border"
                  >
                    {department.staffCount}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </SidebarContent>
      <SidebarFooter className="px-2 py-3 border-t border-sidebar-border">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground font-semibold">
                {currentUser.name.charAt(0)}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-sidebar-foreground">{currentUser.name}</p>
              <p className="text-xs text-sidebar-foreground/70 capitalize">{currentUser.role.replace('_', ' ')}</p>
            </div>
          </div>
          <LogoutButton variant="ghost" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainSidebar;
