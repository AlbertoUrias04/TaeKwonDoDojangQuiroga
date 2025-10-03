import { Navigate } from "react-router-dom";

export default function RutaPrivada({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Verificación básica del formato del token JWT
  try {
    const parts = token.split('.');

    if (parts.length !== 3) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
}
