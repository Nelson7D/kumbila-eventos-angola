
import React, { useEffect, useState } from 'react';
import { adminService, AdminDashboardStats } from '@/services/adminService';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Users, 
  Home, 
  CalendarDays, 
  BadgeCheck, 
  DollarSign, 
  Clock 
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  colorClass = "text-blue-600" 
}: { 
  title: string; 
  value: string | number; 
  description?: string;
  icon: React.ReactNode;
  colorClass?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className={`${colorClass} p-2 rounded-full bg-opacity-10`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground pt-1">
          {description}
        </p>
      )}
    </CardContent>
  </Card>
);

const DashboardOverview = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Não foi possível carregar as estatísticas do dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Visão Geral</h1>
        <p className="text-muted-foreground mt-1">{formattedDate}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard 
          title="Total de Usuários" 
          value={stats.totalUsers}
          icon={<Users size={20} />}
        />
        <StatsCard 
          title="Total de Espaços" 
          value={stats.totalSpaces}
          description={stats.pendingSpaces > 0 ? `${stats.pendingSpaces} aguardando aprovação` : undefined}
          icon={<Home size={20} />}
          colorClass="text-green-600"
        />
        <StatsCard 
          title="Reservas Realizadas" 
          value={stats.totalReservations}
          description={`${stats.activeReservations} reservas ativas`}
          icon={<CalendarDays size={20} />}
          colorClass="text-purple-600"
        />
        <StatsCard 
          title="Receita Total" 
          value={formatCurrency(stats.totalRevenue)}
          description={`De ${stats.totalPayments} pagamentos`}
          icon={<DollarSign size={20} />}
          colorClass="text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Reservas por Mês</CardTitle>
            <CardDescription>Total de reservas nos últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} reservas`, 'Reservas']} />
                <Legend />
                <Bar dataKey="reservations" name="Reservas" fill="#4169E1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
            <CardDescription>Receita gerada nos últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$${value}`} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), 'Receita']} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Receita"
                  stroke="#4169E1"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Reservas Ativas</CardTitle>
            <CardDescription>Reservas confirmadas ou em andamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center">
                <Clock size={48} className="text-blue-600 mr-4" />
                <div>
                  <p className="text-4xl font-bold">{stats.activeReservations}</p>
                  <p className="text-sm text-muted-foreground">Reservas ativas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Finalização</CardTitle>
            <CardDescription>Porcentagem de reservas concluídas com sucesso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center">
                <BadgeCheck size={48} className="text-green-600 mr-4" />
                <div>
                  <p className="text-4xl font-bold">{stats.completionRate.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Taxa de finalização de reservas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
