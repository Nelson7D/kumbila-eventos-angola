import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { AdminSpace, FilterOptions } from '@/types/admin';
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
  Check, 
  X, 
  RotateCw, 
  Search,
  Filter,
  MapPin,
  Tag,
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
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const SpacesManagement = () => {
  const [spaces, setSpaces] = useState<AdminSpace[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSpace, setSelectedSpace] = useState<AdminSpace | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<'active' | 'pending' | 'blocked'>('active');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalSpaces, setTotalSpaces] = useState<number>(0);
  const [filters, setFilters] = useState<FilterOptions>({
    type: '',
    location: '',
    owner: '',
    status: ''
  });
  
  const spacesPerPage = 10;

  const fetchSpaces = async () => {
    setIsLoading(true);
    try {
      const result = await adminService.getSpaces(filters, currentPage, spacesPerPage);
      setSpaces(result.data);
      setTotalSpaces(result.total);
    } catch (error) {
      console.error('Error loading spaces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, [currentPage, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      location: '',
      owner: '',
      status: ''
    });
    setCurrentPage(1);
  };

  const handleStatusChange = async () => {
    if (selectedSpace) {
      try {
        await adminService.updateSpaceStatus(selectedSpace.id, newStatus);
        setShowStatusDialog(false);
        fetchSpaces();
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  const openStatusDialog = (space: AdminSpace, status: 'active' | 'pending' | 'blocked') => {
    setSelectedSpace(space);
    setNewStatus(status);
    setShowStatusDialog(true);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="h-3 w-3 mr-1" /> Ativo
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <RotateCw className="h-3 w-3 mr-1" /> Pendente
          </Badge>
        );
      case 'blocked':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <X className="h-3 w-3 mr-1" /> Bloqueado
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

  const spaceTypes = [
    { value: 'sala_reuniao', label: 'Sala de Reunião' },
    { value: 'espaco_evento', label: 'Espaço para Eventos' },
    { value: 'escritorio', label: 'Escritório' },
    { value: 'studio', label: 'Estúdio' },
    { value: 'coworking', label: 'Coworking' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestão de Espaços</h1>
          <p className="text-muted-foreground mt-1">Gerencie todos os espaços da plataforma</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-gray-500" />
          <Select 
            value={filters.type} 
            onValueChange={(value) => handleFilterChange('type', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de espaço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {spaceTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Localização..."
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-[180px]"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Proprietário..."
            value={filters.owner}
            onChange={(e) => handleFilterChange('owner', e.target.value)}
            className="w-[180px]"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select 
            value={filters.status} 
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="blocked">Bloqueado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center ml-auto gap-2">
          <Button variant="outline" onClick={resetFilters}>
            Limpar filtros
          </Button>
          <Button variant="default" onClick={fetchSpaces}>
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Proprietário</TableHead>
                  <TableHead>Preço/dia</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {spaces.length > 0 ? (
                  spaces.map((space) => (
                    <TableRow key={space.id}>
                      <TableCell className="font-medium">{space.name}</TableCell>
                      <TableCell>
                        {spaceTypes.find(t => t.value === space.type)?.label || space.type}
                      </TableCell>
                      <TableCell>{space.location}</TableCell>
                      <TableCell>{space.owner.full_name}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(space.price_per_day)}
                      </TableCell>
                      <TableCell>{renderStatusBadge(space.status)}</TableCell>
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
                            <DropdownMenuItem onClick={() => window.open(`/espaco/${space.id}`, '_blank')}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(`/proprietario/${space.owner.id}`, '_blank')}>
                              <User className="mr-2 h-4 w-4" />
                              Ver proprietário
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Alterar status</DropdownMenuLabel>
                            {space.status !== 'active' && (
                              <DropdownMenuItem onClick={() => openStatusDialog(space, 'active')}>
                                <Check className="mr-2 h-4 w-4 text-green-600" />
                                Aprovar/Ativar
                              </DropdownMenuItem>
                            )}
                            {space.status !== 'blocked' && (
                              <DropdownMenuItem onClick={() => openStatusDialog(space, 'blocked')}>
                                <X className="mr-2 h-4 w-4 text-red-600" />
                                Bloquear
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Nenhum espaço encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Mostrando {spaces.length} de {totalSpaces} espaços
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
                disabled={spaces.length < spacesPerPage}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Change Status Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {newStatus === 'active' && 'Aprovar/Ativar espaço'}
              {newStatus === 'pending' && 'Marcar espaço como pendente'}
              {newStatus === 'blocked' && 'Bloquear espaço'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {newStatus === 'active' && 'Esta ação aprovará o espaço e o tornará visível na plataforma.'}
              {newStatus === 'pending' && 'Esta ação marcará o espaço como pendente de aprovação.'}
              {newStatus === 'blocked' && 'Esta ação bloqueará o espaço, impedindo novas reservas.'}
              <br /><br />
              Espaço: {selectedSpace?.name}
              <br />
              Proprietário: {selectedSpace?.owner.full_name}
              <br />
              Status atual: {selectedSpace?.status}
              <br /><br />
              Tem certeza que deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SpacesManagement;
