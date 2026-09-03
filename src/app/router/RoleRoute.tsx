import { Navigate, useLocation } from "react-router-dom";

// Backend mapping: 0=Student, 1=Teacher, 2=Admin, 3=SuperAdmin
const roleMap: Record<number, string> = {
  0: "Student",
  1: "Teacher", 
  2: "Admin",
  3: "SuperAdmin"
};

export default function RoleRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[]; // Ab string bhejna: ["Student", "Admin"]
}) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Support both numeric role codes and string role names from different backends
  let userRoleName = '';
  if (typeof user.role === 'number') {
    userRoleName = roleMap[user.role] || String(user.role);
  } else if (typeof user.role === 'string') {
    const lower = user.role.toLowerCase();
    userRoleName = lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  if (!allowedRoles.includes(userRoleName)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
