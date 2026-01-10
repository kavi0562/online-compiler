import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roleRequired, currentRole }) {
  // Use currentRole from state if available, otherwise fallback to storage
  const role = currentRole || localStorage.getItem("role") || "";
  const isAuthenticated = !!localStorage.getItem("token");

  // 1. If not logged in, go to Login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 2. Logging for Debugging
  console.log(`[AUTH_GATE] Role: ${role} | Required: ${roleRequired}`);

  // 3. Authorization Logic
  // GOD MODE: Admins can access EVERYTHING
  if (role === 'admin') {
    return children;
  }

  if (roleRequired) {
    // If a normal User tries to access Admin page, send them back to User Dashboard
    if (role === 'user' && roleRequired === 'admin') {
      console.warn("RESTRICTED_ACCESS: User attempting to enter Admin Core");
      return <Navigate to="/user" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;