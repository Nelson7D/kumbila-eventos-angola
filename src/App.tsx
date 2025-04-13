
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/espacos" element={<SpacesList />} />
              <Route path="/espaco/:id" element={<SpaceDetail />} />
              <Route path="/proprietario/:id" element={<SpaceOwner />} />
              <Route path="/dashboard/usuario" element={<UserDashboard />} />
              <Route path="/dashboard/proprietario" element={<OwnerDashboard />} />
              <Route path="/perfil/:id" element={<UserProfile />} />
              <Route path="/reserva/:id" element={<BookingPage />} />
              <Route path="/servicos" element={<ServicesPage />} />
              <Route path="/servicos/cadastrar" element={<ServiceRegister />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
