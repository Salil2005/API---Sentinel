import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DashboardLayout from "../layouts/DashBoardLayout";
import ProtectedRoute from "./ProtectedRoutes";

function DashBoard() {
  return <h1>DashBoard</h1>;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashBoard />} />
          </Route>
        </Route>
        
        <Route path="/" element={<Navigate to="/login" repalce />} />

        <Route path="*" element={<Navigate to="/login" repalce />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
