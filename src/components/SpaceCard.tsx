
import { Link } from 'react-router-dom';
import { MapPin, Users, Star } from 'lucide-react';

interface SpaceCardProps {
  id: string;
  name: string;
  imageUrl: string;
  location: string;
  price: number;
  capacity: number;
  rating: number;
  type: string;
}

const SpaceCard = ({ id, name, imageUrl, location, price, capacity, rating, type }: SpaceCardProps) => {
  return (
    <Link to={`/espaco/${id}`} className="space-card block">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-3 left-3 bg-white/90 text-primary px-2 py-1 rounded text-sm font-medium">
          {type}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
          <div className="flex items-center text-yellow-500">
            <Star size={16} className="fill-current" />
            <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{location}</span>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <Users size={14} className="mr-1" />
          <span>Até {capacity} pessoas</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-gray-900">{price.toLocaleString('pt-AO')} Kz</span>
            <span className="text-gray-500 text-sm ml-1">/ dia</span>
          </div>
          <span className="text-primary hover:underline text-sm font-medium">Ver detalhes</span>
        </div>
      </div>
    </Link>
  );
};

export default SpaceCard;
