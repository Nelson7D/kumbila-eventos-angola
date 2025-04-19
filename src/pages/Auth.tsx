
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFormValidation } from '@/hooks/use-form-validation';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const { user, signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const [activeView, setActiveView] = useState<'login' | 'register' | 'reset'>('login');

  // Se o usuário já estiver autenticado, redirecionar para o dashboard
  if (user) {
    return <Navigate to="/dashboard/usuario" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-primary">Kumbila</h1>
          <p className="mt-2 text-gray-600">Plataforma de reserva de espaços para eventos</p>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="login" value={activeView} onValueChange={(v) => setActiveView(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Registrar</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <CardTitle className="text-2xl font-bold">Bem-vindo(a) de volta</CardTitle>
                <CardDescription>Entre com seu e-mail e senha para acessar sua conta</CardDescription>
              </TabsContent>

              <TabsContent value="register">
                <CardTitle className="text-2xl font-bold">Criar uma conta</CardTitle>
                <CardDescription>Registre-se para começar a usar a plataforma</CardDescription>
              </TabsContent>

              <TabsContent value="reset">
                <CardTitle className="text-2xl font-bold">Redefinir senha</CardTitle>
                <CardDescription>Enviaremos um e-mail com instruções para redefinir sua senha</CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent>
            {activeView === 'login' && <LoginForm onForgotPassword={() => setActiveView('reset')} />}
            {activeView === 'register' && <RegisterForm />}
            {activeView === 'reset' && <ResetPasswordForm onBack={() => setActiveView('login')} />}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou continue com</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              type="button" 
              className="w-full" 
              onClick={signInWithGoogle}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                />
              </svg>
              Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// Formulário de Login
const LoginForm = ({ onForgotPassword }: { onForgotPassword: () => void }) => {
  const { signIn } = useAuth();
  
  const { values, errors, isSubmitting, handleChange, handleSubmit } = 
    useFormValidation(
      { email: '', password: '' },
      {
        email: { required: true, email: true },
        password: { required: true },
      }
    );

  const onSubmit = async (formValues: typeof values) => {
    await signIn(formValues.email, formValues.password);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <button 
            type="button"
            onClick={onForgotPassword} 
            className="text-sm text-primary hover:underline"
          >
            Esqueceu a senha?
          </button>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={values.password}
          onChange={handleChange}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
};

// Formulário de Registro
const RegisterForm = () => {
  const { signUp } = useAuth();
  
  const { values, errors, isSubmitting, handleChange, handleSubmit } = 
    useFormValidation(
      { full_name: '', email: '', password: '', confirm_password: '' },
      {
        full_name: { required: true, minLength: 3 },
        email: { required: true, email: true },
        password: { required: true, minLength: 6 },
        confirm_password: { required: true },
      }
    );

  const onSubmit = async (formValues: typeof values) => {
    // Verificar se as senhas coincidem
    if (formValues.password !== formValues.confirm_password) {
      return;
    }
    
    await signUp(formValues.email, formValues.password, formValues.full_name);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Nome completo</Label>
        <Input
          id="full_name"
          name="full_name"
          placeholder="Seu nome completo"
          value={values.full_name}
          onChange={handleChange}
        />
        {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register_email">E-mail</Label>
        <Input
          id="register_email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register_password">Senha</Label>
        <Input
          id="register_password"
          name="password"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={values.password}
          onChange={handleChange}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirmar senha</Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          placeholder="Digite a senha novamente"
          value={values.confirm_password}
          onChange={handleChange}
        />
        {errors.confirm_password && <p className="text-sm text-destructive">{errors.confirm_password}</p>}
        {values.password && values.confirm_password && values.password !== values.confirm_password && (
          <p className="text-sm text-destructive">As senhas não coincidem</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Registrando...' : 'Criar conta'}
      </Button>
    </form>
  );
};

// Formulário de Redefinição de Senha
const ResetPasswordForm = ({ onBack }: { onBack: () => void }) => {
  const { resetPassword } = useAuth();
  
  const { values, errors, isSubmitting, handleChange, handleSubmit } = 
    useFormValidation(
      { email: '' },
      {
        email: { required: true, email: true },
      }
    );

  const onSubmit = async (formValues: typeof values) => {
    await resetPassword(formValues.email);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset_email">E-mail</Label>
        <Input
          id="reset_email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="flex flex-col space-y-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar e-mail de redefinição'}
        </Button>
        <Button type="button" variant="ghost" onClick={onBack}>
          Voltar para o login
        </Button>
      </div>
    </form>
  );
};

export default Auth;
