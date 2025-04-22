import React, { useState, useEffect } from 'react';
import { adminService, AdminPayment } from '@/services/adminService';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  MoreVertical, 
  Eye, 
  RotateCw, 
  Filter,
  Calendar,
  CreditCard,
  BanknoteIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock
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
import { Badge } from '@/components/ui/badge';

const PaymentsManagement = () => {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);
  const [showReleaseDialog, setShowReleaseDialog] = useState<boolean>(false);
  const [showResolveDialog, setShowResolveDialog] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const [filters, setFilters] = useState<{
    status: string;
    method: string;
    startDate: string | null;
    endDate: string | null;
  }>({
    status: '',
    method: '',
    startDate: null,
    endDate: null
  });
  
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  });

  const paymentsPerPage = 10;

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const { payments, total } = await adminService.getPayments(filters, currentPage, paymentsPerPage);
      setPayments(payments);
      setTotalPayments(total);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
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
      status: '',
      method: '',
      startDate: null,
      endDate: null
    });
    setDateRange({
      from: undefined,
      to: undefined
    });
    setCurrentPage(1);
  };

  const handleReleasePayment = async () => {
    if (selectedPayment) {
      try {
        await adminService.forceReleasePayment(selectedPayment.id);
        setShowReleaseDialog(false);
        fetchPayments();
      } catch (error) {
        console.error('Error releasing payment:', error);
      }
    }
  };

  const handleResolvePayment = async () => {
    if (selectedPayment) {
      try {
        await adminService.markPaymentAsResolved(selectedPayment.id);
        setShowResolveDialog(false);
        fetchPayments();
      } catch (error) {
        console.error('Error resolving payment:', error);
      }
    }
  };

  const openReleaseDialog = (payment: AdminPayment) => {
    setSelectedPayment(payment);
    setShowReleaseDialog(true);
  };

  const openResolveDialog = (payment: AdminPayment) => {
    setSelectedPayment(payment);
    setShowResolveDialog(true);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'pago':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Pago
          </Badge>
        );
      case 'liberado':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <BanknoteIcon className="h-3 w-3 mr-1" />
            Liberado
          </Badge>
        );
      case 'erro':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Erro
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  const renderMethodBadge = (method: string) => {
    switch (method) {
      case 'cartao':
        return (
          <Badge variant="outline">
            <CreditCard className="h-3 w-3 mr-1" />
            Cartão
          </Badge>
        );
      case 'pix':
        return (
          <Badge variant="outline">
            PIX
          </Badge>
        );
      case 'boleto':
        return (
          <Badge variant="outline">
            Boleto
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {method || 'Não informado'}
          </Badge>
        );
    }
  };

  const handleDateRangeSelect = (range: DateRange) => {
    setDateRange(range);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestão de Pagamentos</h1>
          <p className="text-muted-foreground mt-1">Gerencie e monitore pagamentos na plataforma</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select 
            value={filters.status} 
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="liberado">Liberado</SelectItem>
              <SelectItem value="erro">Erro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-gray-500" />
          <Select 
            value={filters.method} 
            onValueChange={(value) => handleFilterChange('method', value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="cartao">Cartão</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="boleto">Boleto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-[240px] justify-start text-left font-normal ${
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
                  <span>Selecionar período</span>
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
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center ml-auto gap-2">
          <Button variant="outline" onClick={resetFilters}>
            Limpar filtros
          </Button>
          <Button variant="default" onClick={fetchPayments}>
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
                  <TableHead>Usuário</TableHead>
                  <TableHead>Espaço</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Data Pagamento</TableHead>
                  <TableHead>Data Liberação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.reservation.user.full_name}</TableCell>
                      <TableCell>{payment.reservation.space.name}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(payment.amount)}
                      </TableCell>
                      <TableCell>{renderMethodBadge(payment.method)}</TableCell>
                      <TableCell>
                        {payment.paid_at 
                          ? format(new Date(payment.paid_at), 'dd/MM/yyyy HH:mm') 
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {payment.released_at 
                          ? format(new Date(payment.released_at), 'dd/MM/yyyy HH:mm') 
                          : '-'}
                      </TableCell>
                      <TableCell>{renderStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => window.open(`/reserva/${payment.reservation_id}`, '_blank')}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver reserva
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {payment.status === 'pago' && !payment.released_at && (
                              <DropdownMenuItem onClick={() => openReleaseDialog(payment)}>
                                <BanknoteIcon className="mr-2 h-4 w-4 text-green-600" />
                                Forçar liberação
                              </DropdownMenuItem>
                            )}
                            {payment.status === 'erro' && (
                              <DropdownMenuItem onClick={() => openResolveDialog(payment)}>
                                <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                                Resolver erro
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Nenhum pagamento encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Mostrando {payments.length} de {totalPayments} pagamentos
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
                disabled={payments.length < paymentsPerPage}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Release Payment Dialog */}
      <AlertDialog open={showReleaseDialog} onOpenChange={setShowReleaseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Forçar liberação de pagamento</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá liberar o pagamento para o proprietário do espaço, mesmo que o fluxo normal
              não tenha sido concluído. Use esta opção apenas em casos excepcionais quando houver
              confirmação de que o serviço foi entregue.
              <br /><br />
              Valor: {selectedPayment && new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(selectedPayment.amount)}
              <br />
              Usuário: {selectedPayment?.reservation.user.full_name}
              <br />
              Espaço: {selectedPayment?.reservation.space.name}
              <br /><br />
              Esta ação será registrada nos logs de auditoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReleasePayment}
              className="bg-green-600 hover:bg-green-700"
            >
              Liberar Pagamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resolve Payment Dialog */}
      <AlertDialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resolver erro de pagamento</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá marcar este pagamento como resolvido e alterará seu status para "pago".
              Use esta opção quando um erro técnico tiver sido corrigido manualmente.
              <br /><br />
              Valor: {selectedPayment && new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(selectedPayment.amount)}
              <br />
              Usuário: {selectedPayment?.reservation.user.full_name}
              <br />
              Espaço: {selectedPayment?.reservation.space.name}
              <br /><br />
              Esta ação será registrada nos logs de auditoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResolvePayment}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Resolver Erro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PaymentsManagement;
