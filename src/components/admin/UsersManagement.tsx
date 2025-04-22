
import React, { useState, useEffect } from 'react';
import { adminService, AdminUser } from '@/services/adminService';
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
  Pencil, 
  MoreVertical, 
  Lock, 
  Eye, 
  Award, 
  AlertCircle, 
  Check, 
  X, 
  RotateCw, 
  Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const UsersManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showResetDialog, setShowResetDialog] = useState<boolean>(false);
  const [showStatusDialog, setShowStatusDialog] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<'active' | 'inactive' | 'suspended'>('active');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const usersPerPage = 10;

  const fetchUsers = async (search: string = searchInput) => {
    setIsLoading(true);
    try {
      const { users, total } = await adminService.getUsers(search, currentPage, usersPerPage);
      setUsers(users);
      setTotalUsers(total);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);
  
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    const timeout = setTimeout(() => {
      fetchUsers();
    }, 500);
    
    setDebounceTimeout(timeout);
    
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [searchInput]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleResetPassword = async () => {
    if (selectedUser) {
      try {
        await adminService.resetUserPassword(selectedUser.id, selectedUser.email);
        setShowResetDialog(false);
      } catch (error) {
        console.error('Error resetting password:', error);
      }
    }
  };

  const handleStatusChange = async () => {
    if (selectedUser) {
      try {
        await adminService.updateUserStatus(selectedUser.id, newStatus);
        setShowStatusDialog(false);
        fetchUsers();
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  const openResetDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setShowResetDialog(true);
  };

  const openStatusDialog = (user: AdminUser, status: 'active' | 'inactive' | 'suspended') => {
    setSelectedUser(user);
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
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <X className="h-3 w-3 mr-1" /> Inativo
          </Badge>
        );
      case 'suspended':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Suspenso
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

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Award className="h-3 w-3 mr-1" /> Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            {role}
          </Badge>
        );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestão de Usuários</h1>
          <p className="text-muted-foreground mt-1">Gerencie todos os usuários da plataforma</p>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchInput}
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
        <Button 
          variant="outline" 
          className="ml-2" 
          onClick={() => fetchUsers()}
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastrado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium flex items-center">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 mr-2">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.full_name} 
                              className="h-full w-full object-cover" 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-600">
                              {user.full_name?.charAt(0) || user.email.charAt(0)}
                            </div>
                          )}
                        </div>
                        {user.full_name || 'Sem nome'}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{renderRoleBadge(user.user_role)}</TableCell>
                      <TableCell>{renderStatusBadge(user.status)}</TableCell>
                      <TableCell>{format(new Date(user.created_at), 'dd/MM/yyyy')}</TableCell>
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
                            <DropdownMenuItem onClick={() => window.open(`/perfil/${user.id}`, '_blank')}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openResetDialog(user)}>
                              <Lock className="mr-2 h-4 w-4" />
                              Redefinir senha
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Alterar status</DropdownMenuLabel>
                            {user.status !== 'active' && (
                              <DropdownMenuItem onClick={() => openStatusDialog(user, 'active')}>
                                <Check className="mr-2 h-4 w-4 text-green-600" />
                                Ativar
                              </DropdownMenuItem>
                            )}
                            {user.status !== 'inactive' && (
                              <DropdownMenuItem onClick={() => openStatusDialog(user, 'inactive')}>
                                <X className="mr-2 h-4 w-4 text-gray-600" />
                                Desativar
                              </DropdownMenuItem>
                            )}
                            {user.status !== 'suspended' && (
                              <DropdownMenuItem onClick={() => openStatusDialog(user, 'suspended')}>
                                <AlertCircle className="mr-2 h-4 w-4 text-red-600" />
                                Suspender
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Mostrando {users.length} de {totalUsers} usuários
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
                disabled={users.length < usersPerPage}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Reset Password Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redefinir senha do usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação enviará um e-mail de redefinição de senha para {selectedUser?.email}.
              Tem certeza que deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword}>
              Enviar e-mail de redefinição
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Status Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {newStatus === 'active' && 'Ativar usuário'}
              {newStatus === 'inactive' && 'Desativar usuário'}
              {newStatus === 'suspended' && 'Suspender usuário'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {newStatus === 'active' && 'Esta ação permitirá que o usuário acesse a plataforma novamente.'}
              {newStatus === 'inactive' && 'Esta ação impedirá que o usuário faça login na plataforma.'}
              {newStatus === 'suspended' && 'Esta ação suspenderá o usuário por violação de termos.'}
              <br /><br />
              Usuário: {selectedUser?.full_name} ({selectedUser?.email})
              <br />
              Status atual: {selectedUser?.status}
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

export default UsersManagement;
