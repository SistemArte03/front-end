import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RegistrarObra from '../pages/RegistrarObra';
import RegistrarUsuario from '../pages/RegistrarUsuario';
import AdminObras from '../pages/AdminObras';
import Login from '../pages/Login';
import Perfil from '../pages/Perfil';
import GaleriaObras from "../pages/GaleriaObras";
import AdminUsuarios from "../pages/AdminUsuarios";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ForgotPassword from "../pages/ForgotPassword";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registrar" element={<RegistrarObra />} />
        <Route path="/RegistrarUsuario" element={<RegistrarUsuario />} />
        <Route path="/admin" element={<AdminObras />} />
        <Route path="/galeria" element={<GaleriaObras />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        
      </Routes>
    </BrowserRouter>
  );
};
