
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Home, MapPin, Users, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/ownerDashboardUtils";

export default function OwnerSpaceCard({ space }: { space: any }) {
  const calculateAverageRating = (space: any) => {
    if (!space.reviews || space.reviews.length === 0) return 0;
    return space.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / space.reviews.length;
  };
  return (
    <Card className="overflow-hidden">
      <div className="h-32 bg-gray-100 flex items-center justify-center">
        <Home size={48} className="text-gray-400" />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">{space.name}</h3>
          <div className="flex items-center">
            <Star className="text-yellow-500 h-4 w-4 mr-1" />
            <span className="text-sm">{calculateAverageRating(space).toFixed(1)}</span>
          </div>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{space.location || "Sem localização"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>Capacidade: {space.capacity || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={14} />
            <span>{formatCurrency(space.price_per_day || 0)}/dia</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-xs text-gray-500">Reservas:</span>
            <span className="ml-1 font-medium">{space.reservations?.length || 0}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Editar</Button>
            <Button variant="default" size="sm">Ver Reservas</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
