import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Protected({ roles, children }) {
  const { user, ready } = useAuth();
  if (!ready) return <p className="p-8 text-sm text-ink/60">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
