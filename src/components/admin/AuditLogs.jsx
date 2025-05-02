
import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
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
  Eye, 
  RotateCw, 
  Filter,
  Calendar,
  Search,
  User
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Audit Logs component for admin panel
 */
const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [filters, setFilters] = useState({
    action: '',
    adminId: '',
    entityType: '',
    startDate: null,
    endDate: null
  });
  
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined
  });
  
  const [searchInput, setSearchInput] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleDateRangeSelect = (range) => {
    setDateRange(range);
  };

  const logsPerPage = 15;

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { logs, total } = await adminService.getAuditLogs(filters, searchInput, currentPage, logsPerPage);
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
      const filters = {};
      
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

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    const timeout = setTimeout(() => {
      fetchLogs();
    }, 500);
    
    setDebounceTimeout(timeout);
    
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [searchInput]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      action: '',
      adminId: '',
      entityType: '',
      startDate: null,
      endDate: null
    });
    setDateRange({
      from: undefined,
      to: undefined
    });
    setSearchInput('');
    setCurrentPage(1);
  };

  const openDetailsDialog = (log) => {
    setSelectedLog(log);
    setShowDetailsDialog(true);
  };

  const renderActionBadge = (action) => {
    switch (action) {
      case 'create':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Criar
          </Badge>
        );
      case 'update':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Atualizar
          </Badge>
        );
      case 'delete':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Excluir
          </Badge>
        );
      case 'approve':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Aprovar
          </Badge>
        );
      case 'block':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Bloquear
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {action}
          </Badge>
        );
    }
  };

  const renderEntityTypeBadge = (entityType) => {
    switch (entityType) {
      case 'user':
        return (
          <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
            Usuário
          </Badge>
        );
      case 'space':
        return (
          <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
            Espaço
          </Badge>
        );
      case 'reservation':
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            Reserva
          </Badge>
        );
      case 'payment':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Pagamento
          </Badge>
        );
      case 'review':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Logs de Auditoria</h1>
          <p className="text-muted-foreground mt-1">Monitore todas as ações administrativas na plataforma</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select 
            value={filters.action} 
            onValueChange={(value) => handleFilterChange('action', value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Ação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              <SelectItem value="create">Criação</SelectItem>
              <SelectItem value="update">Atualização</SelectItem>
              <SelectItem value="delete">Exclusão</SelectItem>
              <SelectItem value="approve">Aprovação</SelectItem>
              <SelectItem value="block">Bloqueio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select 
            value={filters.entityType} 
            onValueChange={(value) => handleFilterChange('entityType', value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Entidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              <SelectItem value="user">Usuário</SelectItem>
              <SelectItem value="space">Espaço</SelectItem>
              <SelectItem value="reservation">Reserva</SelectItem>
              <SelectItem value="payment">Pagamento</SelectItem>
              <SelectItem value="review">Avaliação</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Admin ID..."
            value={filters.adminId}
            onChange={(e) => handleFilterChange('adminId', e.target.value)}
            className="w-[180px]"
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
                onSelect={handleDateRangeSelect}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex-1 flex items-center">
          <div className="relative w-full max-w-md ml-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar nos logs..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
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
                  <TableHead>Admin</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>ID da Entidade</TableHead>
                  <TableHead className="text-right">Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell>{log.admin_name}</TableCell>
                      <TableCell>
                        {renderActionBadge(log.action)}
                      </TableCell>
                      <TableCell>
                        {renderEntityTypeBadge(log.entity_type)}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 p-1 rounded">
                          {log.entity_id}
                        </code>
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
                      Nenhum log encontrado
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Log</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre a ação administrativa
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ID do Log</h4>
                  <p className="mt-1">{selectedLog.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Data/Hora</h4>
                  <p className="mt-1">
                    {format(new Date(selectedLog.created_at), 'dd/MM/yyyy HH:mm:ss')}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Administrador</h4>
                  <p className="mt-1">{selectedLog.admin_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ID do Administrador</h4>
                  <p className="mt-1">{selectedLog.admin_id || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Ação</h4>
                  <p className="mt-1">{renderActionBadge(selectedLog.action)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tipo de Entidade</h4>
                  <p className="mt-1">{renderEntityTypeBadge(selectedLog.entity_type)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ID da Entidade</h4>
                  <p className="mt-1">
                    <code className="text-xs bg-gray-100 p-1 rounded">
                      {selectedLog.entity_id}
                    </code>
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Detalhes</h4>
                <div className="mt-1 bg-gray-50 p-4 rounded-md overflow-auto max-h-60">
                  <pre className="text-sm">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogs;
