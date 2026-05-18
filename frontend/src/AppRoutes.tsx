import { Navigate, Route, Routes } from "react-router";
import Layouts from "./layouts/Layouts";
import Dashboard from "./pages/Dashboard";
import Equipos from "./pages/Equipos";
import Jugadores from "./pages/Jugadores";
import Arbitros from "./pages/Arbitros";
import Torneos from "./pages/Torneos";
import Posiciones from "./pages/Posiciones";
import Anotaciones from './pages/Anotaciones';
import Configuracion from './pages/Configuraciones';
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthCallBackPage from "./pages/AuthCallBackPage";

import UserProfilePage from "./pages/UserProfilePage";

const AppRoutes = () => {
  return (
    
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
      <Route path="/perfil" element={
        <ProtectedRoute>
          <Layouts><UserProfilePage /></Layouts>
     </ProtectedRoute>
      } />
      <Route path="/anotaciones" element={
        <ProtectedRoute>
          <Layouts><Anotaciones /></Layouts>
        </ProtectedRoute>
      } />
      <Route path="/configuracion" element={
        <ProtectedRoute>
          <Layouts><Configuracion /></Layouts>
        </ProtectedRoute>
      } />

      {/* Ruta no encontrada */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
   
  );
};

export default AppRoutes;