
import React, { useState, useEffect } from 'react';
import { adminService, AuditLog } from '@/services/adminService';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  RotateCw, 
  Filter,
  Calendar,
  User,
  Shield,
  FileText,
  Eye
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalLogs, setTotalLogs] = useState<number>(0);
  const [filters, setFilters] = useState<{
    action: string;
    entityType: string;
    adminId: string;
    startDate: string | null;
    endDate: string | null;
  }>({
    action: '',
    entityType: '',
    adminId: '',
    startDate: null,
    endDate: null
  });
  
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });
  
  const logsPerPage = 15;

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { logs, total } = await adminService.getAuditLogs(filters, currentPage, logsPerPage);
      setLogs(logs);
      setTotalLogs(total);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, filters]);

  useEffect(() => {
    if (dateRange.from) {
      const filters: any = {};
      
      if (dateRange.from) {
        filters.startDate = format(dateRange.from, 'yyyy-MM-dd');
      }
      
      if (dateRange.to) {
        filters.endDate = format(dateRange.to, 'yyyy-MM-dd');
      }
      
      setFilters(prev => ({
        ...prev,
        ...filters
      }));
    }
  }, [dateRange]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      action: '',
      entityType: '',
      adminId: '',
      startDate: null,
      endDate: null
    });
    setDateRange({
      from: undefined,
      to: undefined
    });
    setCurrentPage(1);
  };

  const openDetailsDialog = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetailsDialog(true);
  };

  const renderEntityTypeBadge = (entityType: string) => {
    switch (entityType) {
      case 'user':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <User className="h-3 w-3 mr-1" />
            Usuário
          </Badge>
        );
      case 'space':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Home
          </Badge>
        );
      case 'reservation':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Calendar
          </Badge>
        );
      case 'payment':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pagamento
          </Badge>
        );
      case 'review':
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
            Avaliação
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {entityType}
          </Badge>
        );
    }
  };

  const renderActionBadge = (action: string) => {
    if (action.includes('delete')) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Exclusão
        </Badge>
      );
    } else if (action.includes('update')) {
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
          Atualização
        </Badge>
      );
    } else if (action.includes('create')) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Criação
        </Badge>
      );
    } else if (action.includes('export')) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Exportação
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          {action}
        </Badge>
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Logs e Auditoria</h1>
          <p className="text-muted-foreground mt-1">Registro de todas as ações administrativas realizadas na plataforma</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-gray-500" />
          <Select 
            value={filters.entityType} 
            onValueChange={(value) => handleFilterChange('entityType', value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tipo de entidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="user">Usuário</SelectItem>
              <SelectItem value="space">Espaço</SelectItem>
              <SelectItem value="reservation">Reserva</SelectItem>
              <SelectItem value="payment">Pagamento</SelectItem>
              <SelectItem value="review">Avaliação</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Tipo de ação..."
            value={filters.action}
            onChange={(e) => handleFilterChange('action', e.target.value)}
            className="w-[160px]"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="ID do admin..."
            value={filters.adminId}
            onChange={(e) => handleFilterChange('adminId', e.target.value)}
            className="w-[160px]"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-[200px] justify-start text-left font-normal ${
                  dateRange.from ? "" : "text-muted-foreground"
                }`}
              >
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={setDateRange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center ml-auto gap-2">
          <Button variant="outline" onClick={resetFilters}>
            Limpar filtros
          </Button>
          <Button variant="default" onClick={fetchLogs}>
            <RotateCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Administrador</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Ver</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell className="font-medium">{log.admin_name}</TableCell>
                      <TableCell>{renderActionBadge(log.action)}</TableCell>
                      <TableCell>{renderEntityTypeBadge(log.entity_type)}</TableCell>
                      <TableCell>
                        <div className="font-mono text-xs truncate max-w-[120px]">{log.entity_id}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openDetailsDialog(log)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver detalhes</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Nenhum log de auditoria encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Mostrando {logs.length} de {totalLogs} logs
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={logs.length < logsPerPage}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Log Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Log</DialogTitle>
            <DialogDescription>
              Informações completas sobre a ação registrada
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Administrador:</div>
              <div className="col-span-3">{selectedLog?.admin_name}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">ID do Admin:</div>
              <div className="col-span-3 font-mono text-xs">{selectedLog?.admin_id}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Data/Hora:</div>
              <div className="col-span-3">
                {selectedLog && format(new Date(selectedLog.created_at), 'dd/MM/yyyy HH:mm:ss')}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Ação:</div>
              <div className="col-span-3">{selectedLog?.action}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Tipo de Entidade:</div>
              <div className="col-span-3">{selectedLog?.entity_type}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">ID da Entidade:</div>
              <div className="col-span-3 font-mono text-xs break-all">{selectedLog?.entity_id}</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium">Detalhes:</div>
              <pre className="col-span-3 p-3 bg-gray-50 rounded border text-xs overflow-auto max-h-40">
                {JSON.stringify(selectedLog?.details || {}, null, 2)}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogs;
