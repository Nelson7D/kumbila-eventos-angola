
import { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface SpaceFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}

interface FilterOptions {
  types: string[];
  price: [number, number];
  capacity: number;
}

const SpaceFilter = ({ onFilterChange }: SpaceFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    types: [],
    price: [0, 1000000],
    capacity: 0,
  });
  
  const spaceTypes = [
    "Salão de festas",
    "Sala de conferência",
    "Espaço ao ar livre",
    "Restaurante",
    "Hotel",
    "Quintal/Jardim"
  ];

  const toggleType = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    
    const updatedFilters = { ...filters, types: newTypes };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePriceChange = (value: [number, number]) => {
    const updatedFilters = { ...filters, price: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleCapacityChange = (value: number) => {
    const updatedFilters = { ...filters, capacity: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const resetFilters: FilterOptions = {
      types: [],
      price: [0, 1000000],
      capacity: 0,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="mb-6">
      {/* Mobile filter button */}
      <div className="md:hidden">
        <button
          className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 py-3 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Filter size={18} />
          <span>Filtrar espaços</span>
        </button>
      </div>

      {/* Desktop filter */}
      <div className={`bg-white rounded-lg shadow-sm border p-4 mt-4 ${isOpen ? 'block' : 'hidden md:block'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Filtros</h3>
          <button 
            onClick={clearFilters}
            className="text-primary hover:underline text-sm flex items-center"
          >
            <X size={16} className="mr-1" />
            Limpar filtros
          </button>
        </div>

        {/* Space Types */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Tipo de Espaço</h4>
          <div className="grid grid-cols-2 gap-2">
            {spaceTypes.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.types.includes(type)}
                  onChange={() => toggleType(type)}
                  className="rounded text-primary focus:ring-primary mr-2"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Faixa de Preço (Kz)</h4>
          <div className="flex space-x-4 items-center">
            <input
              type="number"
              value={filters.price[0]}
              onChange={(e) => handlePriceChange([Number(e.target.value), filters.price[1]])}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Mínimo"
            />
            <span>-</span>
            <input
              type="number"
              value={filters.price[1]}
              onChange={(e) => handlePriceChange([filters.price[0], Number(e.target.value)])}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Máximo"
            />
          </div>
        </div>

        {/* Capacity */}
        <div>
          <h4 className="font-medium mb-3">Capacidade Mínima</h4>
          <input
            type="number"
            value={filters.capacity}
            onChange={(e) => handleCapacityChange(Number(e.target.value))}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="Número de pessoas"
            min="0"
            step="10"
          />
        </div>
      </div>
    </div>
  );
};

export default SpaceFilter;
