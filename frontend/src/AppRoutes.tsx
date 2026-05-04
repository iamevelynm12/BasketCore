import { Navigate, Route, Routes } from "react-router";
import Layouts from "./layouts/Layouts";
import Dashboard from "./pages/Dashboard";
import Equipos from "./pages/Equipos";
import Jugadores from "./pages/Jugadores";
import Arbitros from "./pages/Arbitros";
import Torneos from "./pages/Torneos";
import Posiciones from "./pages/Posiciones";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthCallBackPage from "./pages/AuthCallBackPage";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient";

const AppRoutes = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <Routes>
      {/* Ruta pública - Login */}
      <Route path="/" element={<Login />} />

      {/* AuthCallBack*/}

      <Route path="/auth-callback" element={<AuthCallBackPage />} />

      {/* Rutas protegidas */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layouts><Dashboard /></Layouts>
        </ProtectedRoute>
      } />
      <Route path="/equipos" element={
        <ProtectedRoute>
          <Layouts><Equipos /></Layouts>
        </ProtectedRoute>
      } />
      <Route path="/jugadores" element={
        <ProtectedRoute>
          <Layouts><Jugadores /></Layouts>
        </ProtectedRoute>
      } />
      <Route path="/arbitros" element={
        <ProtectedRoute>
          <Layouts><Arbitros /></Layouts>
        </ProtectedRoute>
      } />
      <Route path="/torneos" element={
        <ProtectedRoute>
          <Layouts><Torneos /></Layouts>
        </ProtectedRoute>
      } />
      <Route path="/posiciones" element={
        <ProtectedRoute>
          <Layouts><Posiciones /></Layouts>
        </ProtectedRoute>
      } />

      {/* Ruta no encontrada */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </QueryClientProvider>
  );
};

export default AppRoutes;