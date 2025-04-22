
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '@/services/adminService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const AdminContext = createContext(undefined);

/**
 * Provider component for admin authentication and authorization
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, session } = useAuth();
  const navigate = useNavigate();

  const checkAdminAccess = async () => {
    if (!user || !session) {
      setIsAdmin(false);
      setIsLoading(false);
      return false;
    }
    
    try {
      const hasAccess = await adminService.checkAdminAccess();
      setIsAdmin(hasAccess);
      setIsLoading(false);
      return hasAccess;
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !session) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      await checkAdminAccess();
    };
    
    checkAccess();
  }, [user, session]);

  const value = {
    isAdmin,
    isLoading,
    checkAdminAccess
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

/**
 * Hook to access admin context
 * @returns {Object} - Admin context value
 */
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

/**
 * Higher-order component to protect admin routes
 * @param {React.ComponentType} Component - Component to protect
 * @returns {React.FC} - Protected component
 */
export const withAdminProtection = (Component) => {
  const AdminProtectedComponent = (props) => {
    const { isAdmin, isLoading } = useAdmin();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          toast({
            title: "Acesso negado",
            description: "Você precisa estar logado para acessar esta página.",
            variant: "destructive",
          });
          navigate('/auth');
        } else if (!isAdmin) {
          toast({
            title: "Acesso restrito",
            description: "Você não tem permissão para acessar o painel administrativo.",
            variant: "destructive",
          });
          navigate('/dashboard/usuario');
        }
      }
    }, [isAdmin, isLoading, user, navigate]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAdmin || !user) {
      return null;
    }

    return <Component {...props} />;
  };

  return AdminProtectedComponent;
};
