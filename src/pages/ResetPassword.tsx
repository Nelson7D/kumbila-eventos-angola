
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useFormValidation } from '@/hooks/use-form-validation';
import { toast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  
  const { values, errors, isSubmitting, handleChange, handleSubmit } = 
    useFormValidation(
      { password: '', confirm_password: '' },
      {
        password: { required: true, minLength: 6 },
        confirm_password: { required: true },
      }
    );

  const onSubmit = async (formValues: typeof values) => {
    // Verificar se as senhas coincidem
    if (formValues.password !== formValues.confirm_password) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas não são iguais. Tente novamente.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formValues.password,
      });

      if (error) throw error;

      toast({
        title: "Senha atualizada com sucesso!",
        description: "Você pode fazer login com sua nova senha.",
      });

      // Redirecionar para a página de login
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Erro ao redefinir senha",
        description: error.message || "Ocorreu um erro. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Criar nova senha</CardTitle>
            <CardDescription>Digite sua nova senha abaixo</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new_password">Nova senha</Label>
                <Input
                  id="new_password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={values.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm_new_password">Confirmar nova senha</Label>
                <Input
                  id="confirm_new_password"
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

              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Atualizando...' : 'Definir nova senha'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
