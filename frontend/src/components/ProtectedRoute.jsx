import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase.js"; // Ensure correct import path

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && isMounted) {
        setIsAuthenticated(true);
        setPatientId(user.id); // Assuming patient ID is stored in `user.id`
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    return () => (isMounted = false); // Cleanup
  }, []);

  if (isAuthenticated === null) return <p>Loading...</p>;

  return isAuthenticated ? (
    patientId ? <Navigate to={`/dashboard/${patientId}`} replace /> : <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}
