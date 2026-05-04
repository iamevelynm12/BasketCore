import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-950">
        <p className="text-white text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center gap-6">
        
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-7xl">🏀</span>
          <h1 className="text-3xl font-bold text-blue-950">BasketCore</h1>
          <p className="text-gray-500 text-sm">Sistema de Gestión de Torneos</p>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-200" />

        {/* Info */}
        <div className="text-center space-y-1">
          <p className="text-gray-600 text-sm">Inicia sesión para acceder al sistema</p>
          <p className="text-gray-400 text-xs">Instituto Tecnológico de Zacatecas</p>
        </div>

        {/* Boton Login */}
        <button
          onClick={() => loginWithRedirect()}
          className="w-full bg-blue-950 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
          Iniciar Sesión
        </button> 

        {/* Footer */}
        <p className="text-xs text-gray-400">
          © 2026 BasketCore — Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}