
import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Calendar, Mail, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const SpaceOwner = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, you would fetch the owner data based on the ID
  const owner = {
    id: id || '1',
    name: 'Maria Silva',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.8,
    spaces: 3,
    location: 'Luanda, Angola',
    since: '2022',
    about: 'Olá! Sou proprietária de espaços para eventos em Luanda com mais de 5 anos de experiência. Ofereço locais exclusivos e bem equipados para festas, conferências e reuniões corporativas.',
    contact: {
      email: 'maria.silva@example.com',
      phone: '+244 923 456 789'
    }
  };

  // Sample spaces owned by this owner
  const ownerSpaces = [
    {
      id: '101',
      title: 'Salão de Festas Miramar',
      image: '/placeholder.svg',
      price: 250000,
      location: 'Miramar, Luanda',
      type: 'Salão de festas',
      capacity: 120
    },
    {
      id: '102',
      title: 'Espaço Jardim Talatona',
      image: '/placeholder.svg',
      price: 180000,
      location: 'Talatona, Luanda',
      type: 'Espaço ao ar livre',
      capacity: 80
    },
    {
      id: '103',
      title: 'Sala de Conferências Central',
      image: '/placeholder.svg',
      price: 150000,
      location: 'Centro, Luanda',
      type: 'Sala de conferência',
      capacity: 50
    }
  ];

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Owner Header */}
          <div className="bg-primary p-6 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <img 
                src={owner.avatar} 
                alt={owner.name}
                className="w-24 h-24 rounded-full border-4 border-white object-cover" 
              />
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold">{owner.name}</h1>
                <div className="flex justify-center md:justify-start items-center mt-2">
                  <Star className="fill-yellow-400 text-yellow-400 mr-1" size={18} />
                  <span className="mr-4">{owner.rating} (42 avaliações)</span>
                  <MapPin size={18} className="mr-1" />
                  <span>{owner.location}</span>
                </div>
                <div className="mt-2 flex justify-center md:justify-start items-center">
                  <Calendar size={18} className="mr-1" />
                  <span>Membro desde {owner.since}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Sobre</h2>
                <p className="text-gray-700">{owner.about}</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Espaços ({ownerSpaces.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ownerSpaces.map(space => (
                    <Card key={space.id} className="space-card overflow-hidden">
                      <img 
                        src={space.image} 
                        alt={space.title}
                        className="w-full h-40 object-cover" 
                      />
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{space.title}</h3>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm text-gray-500">{space.type}</span>
                          <span className="text-sm font-medium">{space.capacity} pessoas</span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="font-semibold">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(space.price)} <span className="text-gray-500 text-sm">/ dia</span></span>
                          <a 
                            href={`/espaco/${space.id}`}
                            className="text-primary hover:underline text-sm"
                          >
                            Ver detalhes
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Contacto</h2>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail size={18} className="text-gray-500 mr-2" />
                        <span>{owner.contact.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone size={18} className="text-gray-500 mr-2" />
                        <span>{owner.contact.phone}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <a 
                        href={`https://wa.me/${owner.contact.phone.replace(/\s+/g, '')}?text=Olá! Vi seu perfil no Kumbila e gostaria de saber mais sobre seus espaços.`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-primary w-full flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Contatar via WhatsApp
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SpaceOwner;
