
import React, { useState } from 'react';
import { Search, Filter, Star, Users, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const ServicesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500000]);
  
  // Mock services data
  const servicesData = [
    {
      id: '1',
      name: 'Buffet Santos',
      category: 'Buffet',
      image: '/placeholder.svg',
      description: 'Serviço completo de buffet para eventos com diversos menus personalizáveis e equipe especializada.',
      price: 85000,
      priceUnit: 'por 100 pessoas',
      rating: 4.8,
      location: 'Luanda Sul, Angola',
      reviews: 12
    },
    {
      id: '2',
      name: 'Decorações Estrela',
      category: 'Decoração',
      image: '/placeholder.svg',
      description: 'Serviço premium de decoração para casamentos, aniversários e eventos corporativos.',
      price: 65000,
      priceUnit: 'evento básico',
      rating: 4.5,
      location: 'Miramar, Luanda',
      reviews: 24
    },
    {
      id: '3',
      name: 'DJ Miguel',
      category: 'Entretenimento',
      image: '/placeholder.svg',
      description: 'DJ profissional com equipamento completo de som e iluminação para qualquer tipo de evento.',
      price: 45000,
      priceUnit: 'por 5 horas',
      rating: 4.9,
      location: 'Talatona, Luanda',
      reviews: 36
    },
    {
      id: '4',
      name: 'Fotografia Prime',
      category: 'Fotografia',
      image: '/placeholder.svg',
      description: 'Fotógrafos profissionais para capturar os melhores momentos do seu evento.',
      price: 55000,
      priceUnit: 'sessão completa',
      rating: 4.7,
      location: 'Centro, Luanda',
      reviews: 19
    },
    {
      id: '5',
      name: 'Bolos Celebração',
      category: 'Bolos e Doces',
      image: '/placeholder.svg',
      description: 'Bolos personalizados e mesa de doces completa para festas e celebrações.',
      price: 30000,
      priceUnit: 'bolo para 50 pessoas',
      rating: 4.6,
      location: 'Benfica, Luanda',
      reviews: 42
    },
    {
      id: '6',
      name: 'Transporte VIP',
      category: 'Transporte',
      image: '/placeholder.svg',
      description: 'Serviço de transporte para convidados com vans e carros executivos.',
      price: 75000,
      priceUnit: 'por 10 horas',
      rating: 4.3,
      location: 'Luanda',
      reviews: 8
    }
  ];
  
  // Service categories
  const categories = [
    'Buffet',
    'Decoração',
    'Entretenimento',
    'Fotografia',
    'Bolos e Doces',
    'Transporte',
    'Segurança',
    'Mobiliário'
  ];
  
  // Toggle category filter
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Apply filters to services
  const filteredServices = servicesData.filter(service => {
    // Filter by search query
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(service.category);
    
    // Filter by price range
    const matchesPrice = service.price >= priceRange[0] && service.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <>
      <Navbar />
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Serviços para Eventos</h1>
            <p className="text-xl opacity-90 mb-8">
              Encontre os melhores serviços para tornar seu evento único e memorável
            </p>
            
            <div className="relative bg-white rounded-full shadow-lg p-2 mt-8 flex">
              <input
                type="text"
                placeholder="Pesquisar serviços..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 pl-4 pr-10 py-2 rounded-full border-0 focus:ring-0 focus:outline-none text-gray-800"
              />
              <button className="bg-primary hover:bg-primary-dark text-white rounded-full p-3 flex items-center justify-center">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile filter toggle */}
          <div className="md:hidden mb-4">
            <button
              className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 py-3 rounded-lg transition-colors"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={18} />
              <span>Filtrar serviços</span>
              {filterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
          
          {/* Sidebar Filters */}
          <div className={`md:w-1/4 ${filterOpen ? 'block' : 'hidden md:block'}`}>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Filtros</h2>
                
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Categorias</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="rounded text-primary focus:ring-primary mr-2"
                        />
                        <label htmlFor={`category-${category}`}>{category}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Faixa de Preço (Kz)</h3>
                  <div className="flex space-x-4 items-center mb-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      placeholder="Mínimo"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      placeholder="Máximo"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                </div>
                
                {/* Rating */}
                <div>
                  <h3 className="font-medium mb-3">Avaliação Mínima</h3>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <Star
                        key={rating}
                        size={20}
                        className="cursor-pointer text-gray-300 hover:text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                
                {/* Reset button */}
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 500000]);
                    setSearchQuery('');
                  }}
                  className="mt-6 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  Limpar Filtros
                </button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Serviços Disponíveis</h2>
              <p className="text-gray-500">{filteredServices.length} encontrados</p>
            </div>
            
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredServices.map(service => (
                  <Card key={service.id} className="overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-48 object-cover" 
                    />
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {service.category}
                        </span>
                        <div className="flex items-center">
                          <Star size={16} className="text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 font-medium">{service.rating}</span>
                          <span className="text-gray-500 text-sm ml-1">({service.reviews})</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                      
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <MapPin size={16} className="mr-1" />
                        <span>{service.location}</span>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xl font-semibold">
                            {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(service.price)}
                          </p>
                          <p className="text-gray-500 text-sm">{service.priceUnit}</p>
                        </div>
                        <a 
                          href={`/servico/${service.id}`}
                          className="btn-outline text-sm py-2"
                        >
                          Ver Detalhes
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Search className="mx-auto text-gray-300 mb-3" size={48} />
                <h3 className="text-xl font-medium mb-2">Nenhum serviço encontrado</h3>
                <p className="text-gray-500">Tente ajustar seus filtros ou termos de pesquisa</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ofereça seus Serviços na Kumbila</h2>
            <p className="text-gray-600 mb-8">
              É um profissional de eventos ou empresa de serviços? Cadastre-se e alcance milhares de clientes em busca de serviços de qualidade para seus eventos.
            </p>
            <a 
              href="/servicos/cadastrar" 
              className="btn-primary inline-flex"
            >
              Cadastrar meus Serviços
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ServicesPage;
