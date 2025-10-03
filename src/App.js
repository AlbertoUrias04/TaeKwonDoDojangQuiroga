import { Route, Routes } from "react-router-dom";
import Layout from "./Components/layout/Layout";
import Login from "./pages/Login/Login";
import Sucursales from "./pages/Sucursales/Sucursales";
import Usuarios from "./pages/Usuarios/Usuarios";
import Socios from "./pages/Socios/Socios";
import Membresias from "./pages/Membresias/Membresias";
import RutaPrivada from "./Components/RutaPrivada";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <RutaPrivada>
            <Layout />
          </RutaPrivada>
        }
      >
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="sucursales" element={<Sucursales />} />
        <Route path="socios" element={<Socios />} />
        <Route path="membresias" element={<Membresias />} />
      </Route>
    </Routes>
  );
}