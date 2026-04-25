import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-950">
        <p className="text-white text-lg">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}