
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OwnerSpaceCard from "./OwnerSpaceCard";
import { Home } from "lucide-react";

export default function OwnerSpacesSection({
  loading, spaces, setActiveTab
}: { loading: boolean, spaces: any[], setActiveTab?: (tab: string) => void }) {
  if (loading) {
    return (
      <Card className="p-12">
        <div className="flex justify-center">
          <p className="text-gray-500">Carregando espaços...</p>
        </div>
      </Card>
    );
  }
  if (!spaces.length) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <Home size={48} className="mx-auto text-gray-300" />
          <h3 className="text-lg font-medium">Você ainda não tem nenhum espaço cadastrado</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Adicione seu primeiro espaço para começar a receber reservas
            e gerenciar seu negócio através do painel.
          </p>
          <Button className="gap-1 mt-2">
            Adicionar Meu Primeiro Espaço
          </Button>
        </div>
      </Card>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {spaces.map(space => (
        <OwnerSpaceCard key={space.id} space={space} />
      ))}
    </div>
  );
}
