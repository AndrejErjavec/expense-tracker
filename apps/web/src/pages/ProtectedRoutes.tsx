import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoutes() {
  const { session } = useAuth();

  return (
    session ? <Outlet /> : <Navigate to="sign-in" />
  );
}
