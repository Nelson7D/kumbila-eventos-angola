
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Auth callback page component
 */
const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Processar o callback do OAuth
    const handleOAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo(a) à Kumbila.",
        });
        
        // Redirecionar para o dashboard
        navigate('/dashboard/usuario');
      } catch (error) {
        console.error("Erro no callback de autenticação:", error);
        
        toast({
          title: "Erro na autenticação",
          description: error.message || "Não foi possível completar o login. Tente novamente.",
          variant: "destructive",
        });
        
        // Redirecionar para a página de login em caso de erro
        navigate('/auth');
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-lg">Autenticando...</p>
    </div>
  );
};

export default AuthCallback;
