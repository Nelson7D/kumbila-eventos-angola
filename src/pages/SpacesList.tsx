
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpaceCard from '@/components/SpaceCard';
import SpaceFilter from '@/components/SpaceFilter';
import { filterSpaces } from '@/utils/sampleData';

const SpacesList = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const locationParam = params.get('location') || '';
  
  const [filters, setFilters] = useState({
    types: [] as string[],
    price: [0, 1000000] as [number, number],
    capacity: 0,
    location: locationParam
  });
  
  const [searchLocation, setSearchLocation] = useState(locationParam);
  
  const spaces = filterSpaces(filters);
  
  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, location: searchLocation });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Espaços para Eventos</h1>
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Digite a localização (ex: Luanda, Talatona)"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button type="submit" className="btn-primary md:w-auto">
                Buscar
              </button>
            </div>
          </form>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar filters */}
            <div className="lg:col-span-1">
              <SpaceFilter onFilterChange={handleFilterChange} />
            </div>
            
            {/* Results */}
            <div className="lg:col-span-3">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">{spaces.length} espaços encontrados</p>
                </div>
              </div>
              
              {spaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spaces.map((space) => (
                    <SpaceCard 
                      key={space.id}
                      id={space.id}
                      name={space.name}
                      imageUrl={space.images[0]}
                      location={space.location}
                      price={space.price}
                      capacity={space.capacity}
                      rating={space.rating}
                      type={space.type}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-xl font-semibold mb-2">Nenhum espaço encontrado</h3>
                  <p className="text-gray-600">
                    Tente ajustar seus filtros ou buscar por outra localização.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SpacesList;
