
import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Users,
  Home,
  Calendar,
  Receipt,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Bar, Line, Pie } from 'recharts';
import { BarChart, LineChart, PieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

/**
 * Dashboard Overview component for admin panel
 */
const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [timeframe, setTimeframe] = useState("month");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const dashboardStats = await adminService.getDashboardStats(timeframe);
        setStats(dashboardStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [timeframe]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statsCards = [
    { title: "Usuários", value: stats?.totalUsers || 0, icon: Users, color: "bg-blue-100 text-blue-800" },
    { title: "Espaços", value: stats?.totalSpaces || 0, icon: Home, color: "bg-green-100 text-green-800" },
    { title: "Reservas", value: stats?.totalReservations || 0, icon: Calendar, color: "bg-purple-100 text-purple-800" },
    { title: "Pagamentos", value: stats?.totalPayments || 0, icon: Receipt, color: "bg-amber-100 text-amber-800" },
    { title: "Receita Total", value: `R$ ${(stats?.totalRevenue || 0).toLocaleString('pt-BR')}`, icon: TrendingUp, color: "bg-emerald-100 text-emerald-800" },
    { title: "Taxa de Conclusão", value: `${stats?.completionRate || 0}%`, icon: CheckCircle, color: "bg-sky-100 text-sky-800" },
  ];

  const monthlyRevenueData = stats?.monthlyStats || [];
  const completionRate = stats?.completionRate || 0;

  const pieChartData = [
    { name: "Concluídas", value: completionRate, fill: "#4ade80" },
    { name: "Não concluídas", value: 100 - completionRate, fill: "#f87171" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
        <Tabs defaultValue="month" value={timeframe} onValueChange={setTimeframe} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mês</TabsTrigger>
            <TabsTrigger value="year">Ano</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`${card.color} p-2 rounded-full`}>
                  <IconComponent className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {timeframe === "week" ? "Últimos 7 dias" : timeframe === "month" ? "Último mês" : "Último ano"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Reservas e Receita Mensal</CardTitle>
            <CardDescription>
              Análise de reservas e receita nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyRevenueData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="reservations" name="Reservas" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" name="Receita (R$)" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Taxa de Conclusão de Reservas</CardTitle>
            <CardDescription>
              Percentual de reservas concluídas com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tendência de Crescimento</CardTitle>
          <CardDescription>
            Análise do crescimento da plataforma nos últimos meses
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyRevenueData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" name="Novos Usuários" fill="#3b82f6" />
              <Bar dataKey="spaces" name="Novos Espaços" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
