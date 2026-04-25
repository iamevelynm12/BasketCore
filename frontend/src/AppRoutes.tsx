import { Navigate, Route, Routes } from "react-router";
import Layouts from "./layouts/Layouts";
import Dashboard from "./pages/Dashboard";
import Equipos from "./pages/Equipos";
import Jugadores from "./pages/Jugadores";
import Arbitros from "./pages/Arbitros";
import Torneos from "./pages/Torneos";
import Posiciones from "./pages/Posiciones";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layouts><Dashboard /></Layouts>} />
      <Route path="/equipos" element={<Layouts><Equipos /></Layouts>} />
      <Route path="/jugadores" element={<Layouts><Jugadores /></Layouts>} />
      <Route path="/arbitros" element={<Layouts><Arbitros /></Layouts>} />
      <Route path="/torneos" element={<Layouts><Torneos /></Layouts>} />
      <Route path="/posiciones" element={<Layouts><Posiciones /></Layouts>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;