
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Star } from 'lucide-react';

interface SpaceDetailHeaderProps {
  name: string;
  location: string;
  capacity: number;
  rating: number;
  type: string;
}

const SpaceDetailHeader = ({ name, location, capacity, rating, type }: SpaceDetailHeaderProps) => {
  return (
    <div>
      <div className="mb-4 text-sm">
        <Link to="/" className="text-gray-500 hover:text-primary">Início</Link>
        <span className="mx-2 text-gray-500">/</span>
        <Link to="/espacos" className="text-gray-500 hover:text-primary">Espaços</Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-900">{name}</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center">
          <MapPin size={16} className="text-gray-500 mr-1" />
          <span className="text-gray-700">{location}</span>
        </div>
        <div className="flex items-center">
          <Users size={16} className="text-gray-500 mr-1" />
          <span className="text-gray-700">Até {capacity} pessoas</span>
        </div>
        <div className="flex items-center">
          <Star size={16} className="text-yellow-500 fill-current mr-1" />
          <span className="text-gray-700">{rating.toFixed(1)} (42 avaliações)</span>
        </div>
        <Badge variant="secondary">{type}</Badge>
      </div>
    </div>
  );
};

export default SpaceDetailHeader;
