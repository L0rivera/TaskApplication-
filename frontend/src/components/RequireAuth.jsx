import { Navigate } from "react-router-dom";
import useAuth from "../store/useAuth";

export default function RequireAuth({ children }) {
  const user = useAuth((s) => s.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
