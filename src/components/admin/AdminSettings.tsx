
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Download, FileText, FileCog } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { toast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const [exportType, setExportType] = useState<'users' | 'spaces' | 'reservations' | 'payments'>('users');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = await adminService.exportData(exportType);
      
      // Convert to CSV
      const headers = Object.keys(data[0]);
      const csvData = [
        headers.join(','),
        ...data.map(item => 
          headers.map(header => 
            JSON.stringify(item[header] || '')
          ).join(',')
        )
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `kumbila_${exportType}_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Exportação concluída",
        description: `Os dados de ${exportType} foram exportados com sucesso.`,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Configurações</h1>
          <p className="text-muted-foreground mt-1">Gerenciar configurações do painel administrativo</p>
        </div>
      </div>

      <Tabs defaultValue="export" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="export">Exportar Dados</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>
        
        <TabsContent value="export" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Exportar Dados</CardTitle>
              <CardDescription>
                Exporte dados da plataforma em formato CSV para análise ou backup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <Label htmlFor="export-type">Tipo de Dados</Label>
                <select
                  id="export-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={exportType}
                  onChange={(e) => setExportType(e.target.value as any)}
                >
                  <option value="users">Usuários</option>
                  <option value="spaces">Espaços</option>
                  <option value="reservations">Reservas</option>
                  <option value="payments">Pagamentos</option>
                </select>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      A exportação incluirá todos os registros do tipo selecionado. 
                      Esta ação será registrada nos logs de auditoria.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleExportData}
                disabled={isExporting}
                className="w-full md:w-auto"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> 
                    Exportar {exportType === 'users' ? 'Usuários' : 
                               exportType === 'spaces' ? 'Espaços' : 
                               exportType === 'reservations' ? 'Reservas' : 'Pagamentos'}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>
                Gere relatórios detalhados das operações da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <FileText className="h-6 w-6 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium leading-none">Relatório Mensal de Operações</p>
                    <p className="text-sm text-muted-foreground">
                      Resumo mensal de todas as atividades da plataforma
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> PDF
                </Button>
              </div>
              
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <FileCog className="h-6 w-6 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium leading-none">Relatório Financeiro</p>
                    <p className="text-sm text-muted-foreground">
                      Detalhes de faturamento e pagamentos
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Configure as opções gerais de funcionamento do painel administrativo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-notifications">Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas sobre ações importantes na plataforma
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-approve">Aprovação Automática de Espaços</Label>
                  <p className="text-sm text-muted-foreground">
                    Aprovar automaticamente novos espaços cadastrados
                  </p>
                </div>
                <Switch id="auto-approve" />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="session-timeout">Tempo Limite de Sessão (minutos)</Label>
                <Input id="session-timeout" type="number" defaultValue={60} />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="items-per-page">Itens por Página nas Tabelas</Label>
                <Input id="items-per-page" type="number" defaultValue={10} />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
