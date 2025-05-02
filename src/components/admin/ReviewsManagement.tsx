
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
  Home,
  User,
  Star,
  Trash2,
  StarHalf
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
// Importando o tipo DateRange
import type { DateRange } from '@/types/admin';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [deleteReason, setDeleteReason] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [filters, setFilters] = useState<{
    spaceId: string;
    userId: string;
    rating: string;
    startDate: string | null;
    endDate: string | null;
  }>({
    spaceId: '',
    userId: '',
    rating: '',
    startDate: null,
    endDate: null
  });
  
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  });

  const handleDateRangeSelect = (range: DateRange) => {
    setDateRange(range);
  };

  const reviewsPerPage = 10;

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const { reviews, total } = await adminService.getReviews(filters, currentPage, reviewsPerPage);
      setReviews(reviews);
      setTotalReviews(total);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
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
      spaceId: '',
      userId: '',
      rating: '',
      startDate: null,
      endDate: null
    });
    setDateRange({
      from: undefined,
      to: undefined
    });
    setCurrentPage(1);
  };

  const handleDeleteReview = async () => {
    if (selectedReview && deleteReason) {
      try {
        await adminService.deleteReview(selectedReview.id, deleteReason);
        setShowDeleteDialog(false);
        setDeleteReason('');
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const openDeleteDialog = (review: AdminReview) => {
    setSelectedReview(review);
    setShowDeleteDialog(true);
  };

  const renderStarRating = (rating: number) => {
    const roundedRating = Math.round(rating);
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < roundedRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} 
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestão de Avaliações</h1>
          <p className="text-muted-foreground mt-1">Moderação de reviews e comentários da plataforma</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <StarHalf className="h-4 w-4 text-gray-500" />
          <Select 
            value={filters.rating} 
            onValueChange={(value) => handleFilterChange('rating', value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Avaliação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              <SelectItem value="5">5 estrelas</SelectItem>
              <SelectItem value="4">4 estrelas</SelectItem>
              <SelectItem value="3">3 estrelas</SelectItem>
              <SelectItem value="2">2 estrelas</SelectItem>
              <SelectItem value="1">1 estrela</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="ID do espaço..."
            value={filters.spaceId}
            onChange={(e) => handleFilterChange('spaceId', e.target.value)}
            className="w-[160px]"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="ID do usuário..."
            value={filters.userId}
            onChange={(e) => handleFilterChange('userId', e.target.value)}
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
          <Button variant="default" onClick={fetchReviews}>
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
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Comentário</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.user.full_name}</TableCell>
                      <TableCell>{review.space.name}</TableCell>
                      <TableCell>{renderStarRating(review.rating)}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {review.comment || <span className="italic text-gray-400">Sem comentário</span>}
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(review.created_at), 'dd/MM/yyyy')}</TableCell>
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
                            <DropdownMenuItem onClick={() => window.open(`/espaco/${review.space.id}`, '_blank')}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver espaço
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog(review)}>
                              <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                              Excluir avaliação
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Nenhuma avaliação encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Mostrando {reviews.length} de {totalReviews} avaliações
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
                disabled={reviews.length < reviewsPerPage}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Delete Review Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir avaliação</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação excluirá permanentemente a avaliação. Use esta ação apenas para conteúdos
              que violam os termos de uso ou são inadequados para a plataforma.
              <br /><br />
              Usuário: {selectedReview?.user.full_name}
              <br />
              Espaço: {selectedReview?.space.name}
              <br />
              Avaliação: {selectedReview?.rating} estrelas
              <br />
              Comentário: {selectedReview?.comment || "Sem comentário"}
              <br /><br />
              Por favor, forneça um motivo para a exclusão:
              <Textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Motivo da exclusão..."
                className="mt-2"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteReason('')}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteReview} 
              disabled={!deleteReason}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir Avaliação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReviewsManagement;
