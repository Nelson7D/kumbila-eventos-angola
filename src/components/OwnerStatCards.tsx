
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Calendar, Star, DollarSign } from "lucide-react";
import { formatCurrency } from "@/utils/ownerDashboardUtils";

export default function OwnerStatCards(props: any) {
  const { spaces, reservations, stats, loading } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Espaços Cadastrados</p>
              <h3 className="text-2xl font-bold mt-1">{spaces.length}</h3>
            </div>
            <div className="bg-primary/10 p-2 rounded-md">
              <Home className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Reservas Totais</p>
              <h3 className="text-2xl font-bold mt-1">{reservations.length}</h3>
            </div>
            <div className="bg-blue-50 p-2 rounded-md">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avaliação Média</p>
              <div className="flex items-center mt-1">
                <h3 className="text-2xl font-bold">{stats?.averageRating?.toFixed(1) || "0.0"}</h3>
                <span className="text-xs text-gray-500 ml-1">/5</span>
              </div>
            </div>
            <div className="bg-yellow-50 p-2 rounded-md">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Receita Total</p>
              <h3 className="text-xl font-bold mt-1">{formatCurrency(stats?.revenue || 0)}</h3>
            </div>
            <div className="bg-green-50 p-2 rounded-md">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
