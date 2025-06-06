import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, adminOnly = false }) {
  const { token, isAdmin } = useAuth();


  // return token ? children : <Navigate to="/" replace />;

    if (!token) return <Navigate to="/" replace />;
    if (adminOnly && !isAdmin) return <Navigate to="/items" replace />;

    return children;
}
