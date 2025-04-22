
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import SpacesList from "./pages/SpacesList";
import SpaceDetail from "./pages/SpaceDetail";
import SpaceOwner from "./pages/SpaceOwner";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import UserProfile from "./pages/UserProfile";
import BookingPage from "./pages/BookingPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceRegister from "./pages/ServiceRegister";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AdminProvider>
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/" element={<Index />} />
                  <Route path="/espacos" element={<SpacesList />} />
                  <Route path="/espaco/:id" element={<SpaceDetail />} />
                  <Route path="/proprietario/:id" element={<SpaceOwner />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/auth/reset-password" element={<ResetPassword />} />
                  
                  {/* Rotas protegidas */}
                  <Route 
                    path="/dashboard/usuario" 
                    element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/proprietario" 
                    element={
                      <ProtectedRoute>
                        <OwnerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/perfil/:id" 
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/reserva/:id" 
                    element={
                      <ProtectedRoute>
                        <BookingPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/servicos" 
                    element={
                      <ProtectedRoute>
                        <ServicesPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/servicos/cadastrar" 
                    element={
                      <ProtectedRoute>
                        <ServiceRegister />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Rotas de administração */}
                  <Route path="/admin/*" element={<AdminDashboard />} />
                  
                  {/* Rota de fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AdminProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
