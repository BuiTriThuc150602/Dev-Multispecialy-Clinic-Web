import { useAuthContext } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { accessToken } = useAuthContext();

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
