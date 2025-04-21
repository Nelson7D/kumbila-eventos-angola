
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, Download, PieChart, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/ownerDashboardUtils";

type Props = {
  stats: any;
  loading: boolean;
  timeframe: string;
  setTimeframe: (v: string) => void;
};

export default function OwnerReportsSection({ stats, loading, timeframe, setTimeframe }: Props) {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Relatórios</h2>
        <div className="flex gap-2">
          <select 
            className="text-sm border rounded-md p-1 bg-white shadow z-10"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="year">Últimos 12 meses</option>
            <option value="month">Este Mês</option>
            <option value="week">Esta Semana</option>
          </select>
          <Button variant="outline" size="sm" className="gap-1">
            <Download size={16} />
            Exportar
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Total de Reservas</p>
              <h3 className="text-2xl font-bold mt-1">{stats?.totalReservations || 0}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.confirmedReservations || 0} confirmadas • {stats?.cancelledReservations || 0} canceladas
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Faturamento Total</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats?.revenue || 0)}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Taxa de conclusão: {stats?.completionRate?.toFixed(0) || 0}%
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Avaliação Média</p>
              <div className="flex items-center mt-1">
                <h3 className="text-2xl font-bold">{stats?.averageRating?.toFixed(1) || "0.0"}</h3>
                <span className="text-xs text-gray-500 ml-1">/5</span>
              </div>
              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={
                    star <= Math.round(stats?.averageRating || 0) 
                      ? "text-yellow-500" 
                      : "text-gray-300"
                  }>★</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reservas por Mês</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <p className="text-center py-12 text-gray-500">Carregando...</p>
            ) : (
              <div className="flex items-end justify-between h-full gap-1 pt-10 pb-4 border-b">
                {stats?.monthlyData.map((data: any, i: number) => (
                  <div key={i} className="flex flex-col items-center">
                    <div 
                      className="bg-blue-500 w-10 rounded-t" 
                      style={{height: `${data.bookings * 30}px`}}
                    ></div>
                    <span className="text-xs mt-1 text-gray-600">{data.month}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Receita por Mês</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <p className="text-center py-12 text-gray-500">Carregando...</p>
            ) : (
              <div className="flex items-end justify-between h-full gap-1 pt-10 pb-4 border-b">
                {stats?.monthlyData.map((data: any, i: number) => (
                  <div key={i} className="flex flex-col items-center">
                    <div 
                      className="bg-green-500 w-10 rounded-t" 
                      style={{height: `${data.revenue > 0 ? Math.max((data.revenue / 5000), 5) : 0}px`}}
                    ></div>
                    <span className="text-xs mt-1 text-gray-600">{data.month}</span>
                    <span className="text-xs text-gray-500">{formatCurrency(data.revenue).replace('AOA', '').trim()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Extras premium podem ser incluídos aqui */}
    </div>
  );
}
