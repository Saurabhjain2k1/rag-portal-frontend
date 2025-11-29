// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/Layout/AppLayout";

import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import DocumentsPage from "./pages/DocumentsPage";
import UsersPage from "./pages/UsersPage";   // ✅ add this import
import ProfilePage from "./pages/ProfilePage";
// const UsersPage = () => <div>Users (coming soon)</div>; // or your real users page
import TenantRegisterPage from "./pages/TenantRegisterPage";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-tenant" element={<TenantRegisterPage />} />
          
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="chat" replace />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="documents" element={<DocumentsPage />} /> {/* ✅ use real page */}
            <Route path="users" element={<UsersPage />} />
            <Route
              path="/app/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
