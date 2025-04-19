
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, full_name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
  });

  useEffect(() => {
    // Função para buscar o perfil do usuário
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Erro ao buscar perfil:', error);
          return null;
        }

        return data as UserProfile;
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }
    };

    // Configurar o listener de mudança de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prevState => ({ ...prevState, session, user: session?.user || null }));
        
        // Se há um usuário logado, buscar seu perfil
        if (session?.user) {
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user.id);
            setState(prevState => ({ ...prevState, profile, isLoading: false }));
          }, 0);
        } else {
          setState(prevState => ({ ...prevState, profile: null, isLoading: false }));
        }
      }
    );

    // Verificar se já existe uma sessão ativa
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setState(prevState => ({ ...prevState, session, user: session?.user || null }));

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setState(prevState => ({ ...prevState, profile, isLoading: false }));
      } else {
        setState(prevState => ({ ...prevState, isLoading: false }));
      }
    });

    // Limpar subscription ao desmontar o componente
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo(a) de volta à Kumbila.",
      });

      navigate('/dashboard/usuario');
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função de registro
  const signUp = async (email: string, password: string, full_name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Registro realizado com sucesso!",
        description: "Verifique seu e-mail para confirmar seu cadastro.",
      });

      // Se a confirmação por email estiver desabilitada, redirecionar direto
      if (data.session) {
        navigate('/dashboard/usuario');
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Tente novamente com outras credenciais.",
        variant: "destructive",
      });
    }
  };

  // Função de logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setState(prevState => ({
        ...prevState,
        session: null,
        user: null,
        profile: null,
      }));

      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta.",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message || "Não foi possível fazer logout.",
        variant: "destructive",
      });
    }
  };

  // Login com Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro ao entrar com Google",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  // Redefinição de senha
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "E-mail enviado com sucesso",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao solicitar redefinição",
        description: error.message || "Verifique se o e-mail está correto e tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Atualização de perfil
  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      if (!state.user?.id) throw new Error("Usuário não está logado");

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', state.user.id);

      if (error) throw error;

      // Atualizar o estado local com os novos dados
      setState(prevState => ({
        ...prevState,
        profile: prevState.profile ? { ...prevState.profile, ...data } : null,
      }));

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Não foi possível atualizar suas informações.",
        variant: "destructive",
      });
    }
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
