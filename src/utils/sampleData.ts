
// Dados fictícios para a aplicação

export const spaces = [
  {
    id: "space-1",
    name: "Salão Diamante",
    description: "Espaço elegante para eventos corporativos e sociais. Ambiente climatizado com capacidade para até 200 pessoas, palco, sistema de som integrado e iluminação ajustável. Amplo estacionamento e segurança privada inclusos.",
    location: "Talatona, Luanda",
    type: "Salão de festas",
    capacity: 200,
    price: 350000,
    rating: 4.8,
    amenities: ["Ar condicionado", "Sistema de som", "Palco", "Iluminação", "Estacionamento", "Segurança"],
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1798&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=1770&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1712&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1740&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602101400963-c1e8592a4bd3?q=80&w=1887&auto=format&fit=crop"
    ],
    extras: [
      { name: "Mesas (10 lugares)", price: 2500 },
      { name: "Cadeiras", price: 300 },
      { name: "Serviço de buffet", price: 15000 },
      { name: "DJ", price: 35000 },
      { name: "Fotógrafo", price: 25000 }
    ],
    bookedDates: []
  },
  {
    id: "space-2",
    name: "Jardim Tropical",
    description: "Espaço ao ar livre com paisagismo exuberante, perfeito para casamentos e festas. Conta com tenda para 150 pessoas, cozinha de apoio e gerador. Ambiente natural com vista para o mar.",
    location: "Ilha de Luanda",
    type: "Espaço ao ar livre",
    capacity: 150,
    price: 280000,
    rating: 4.6,
    amenities: ["Área verde", "Cozinha", "Gerador", "Vista para o mar", "Banheiros"],
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1740&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1798&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1712&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=1770&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602101400963-c1e8592a4bd3?q=80&w=1887&auto=format&fit=crop"
    ],
    extras: [
      { name: "Tenda (10m x 10m)", price: 45000 },
      { name: "Mesas (8 lugares)", price: 2000 },
      { name: "Cadeiras decoradas", price: 500 },
      { name: "Decoração floral", price: 30000 },
      { name: "Barman", price: 20000 }
    ],
    bookedDates: []
  },
  {
    id: "space-3",
    name: "Centro de Conferências Kilamba",
    description: "Centro de conferências moderno com auditório principal e salas de apoio. Equipado com tecnologia audiovisual de última geração, tradução simultânea e internet de alta velocidade. Ideal para conferências e eventos corporativos.",
    location: "Kilamba, Luanda",
    type: "Sala de conferência",
    capacity: 300,
    price: 420000,
    rating: 4.9,
    amenities: ["Wi-Fi", "Projetores", "Microfones", "Tradução simultânea", "Catering", "Recepcionistas"],
    images: [
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1712&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1798&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=1770&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1740&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602101400963-c1e8592a4bd3?q=80&w=1887&auto=format&fit=crop"
    ],
    extras: [
      { name: "Equipamento de tradução", price: 30000 },
      { name: "Gravação do evento", price: 25000 },
      { name: "Coffee break", price: 5000 },
      { name: "Técnico audiovisual", price: 15000 },
      { name: "Recepcionistas", price: 10000 }
    ],
    bookedDates: []
  },
  {
    id: "space-4",
    name: "Terraço Panorâmico",
    description: "Espaço exclusivo no topo de um edifício com vista panorâmica para a cidade e o oceano. Ideal para coquetéis, lançamentos de produtos e eventos sociais sofisticados. Inclui bar, lounge e iluminação ambiente.",
    location: "Marginal, Luanda",
    type: "Terraço",
    capacity: 100,
    price: 300000,
    rating: 4.7,
    amenities: ["Vista panorâmica", "Bar", "Lounge", "Iluminação ambiente", "Som ambiente"],
    images: [
      "https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=1770&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1798&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1712&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1740&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602101400963-c1e8592a4bd3?q=80&w=1887&auto=format&fit=crop"
    ],
    extras: [
      { name: "Bartender", price: 25000 },
      { name: "Canapés (por pessoa)", price: 5000 },
      { name: "DJ", price: 35000 },
      { name: "Decoração temática", price: 40000 },
      { name: "Segurança", price: 20000 }
    ],
    bookedDates: []
  },
  {
    id: "space-5",
    name: "Espaço Cultural Muxima",
    description: "Ambiente rústico e charmoso com influências da cultura angolana. Espaço versátil para exposições, eventos culturais e comemorações. Possui palco para apresentações, área de exposição e cozinha industrial.",
    location: "Benfica, Luanda",
    type: "Espaço cultural",
    capacity: 180,
    price: 250000,
    rating: 4.5,
    amenities: ["Palco", "Área de exposição", "Cozinha industrial", "Estacionamento", "Segurança"],
    images: [
      "https://images.unsplash.com/photo-1602101400963-c1e8592a4bd3?q=80&w=1887&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1798&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=1770&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1712&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1740&auto=format&fit=crop"
    ],
    extras: [
      { name: "Apresentação cultural", price: 30000 },
      { name: "Mesas (8 lugares)", price: 2000 },
      { name: "Cadeiras", price: 300 },
      { name: "Buffet tradicional angolano", price: 12000 },
      { name: "Estrutura para exposição", price: 15000 }
    ],
    bookedDates: []
  },
  {
    id: "space-6",
    name: "Salão Executivo Plaza",
    description: "Ambiente sofisticado em hotel cinco estrelas com vista para a baía de Luanda. Ideal para eventos corporativos, reuniões executivas e jantares de negócios. Serviço impecável e equipamentos de última geração.",
    location: "Baixa de Luanda",
    type: "Hotel",
    capacity: 80,
    price: 380000,
    rating: 4.9,
    amenities: ["Wi-Fi de alta velocidade", "Equipamentos AV", "Serviço de hotel", "Catering gourmet", "Valet"],
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1798&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=1770&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1712&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1740&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602101400963-c1e8592a4bd3?q=80&w=1887&auto=format&fit=crop"
    ],
    extras: [
      { name: "Pacote de conferência (equipamentos + suporte)", price: 50000 },
      { name: "Coffee break premium", price: 8000 },
      { name: "Almoço executivo (por pessoa)", price: 15000 },
      { name: "Hospedagem para palestrantes", price: 45000 },
      { name: "Decoração empresarial", price: 25000 }
    ],
    bookedDates: []
  }
];

// Função para encontrar um espaço pelo ID
export const getSpaceById = (id: string) => {
  return spaces.find(space => space.id === id);
};

// Função para filtrar espaços
export const filterSpaces = (filters: {
  types?: string[],
  price?: [number, number],
  capacity?: number,
  location?: string
}) => {
  return spaces.filter(space => {
    // Filtrar por tipo
    if (filters.types && filters.types.length > 0 && !filters.types.includes(space.type)) {
      return false;
    }
    
    // Filtrar por preço
    if (filters.price && (space.price < filters.price[0] || space.price > filters.price[1])) {
      return false;
    }
    
    // Filtrar por capacidade
    if (filters.capacity && space.capacity < filters.capacity) {
      return false;
    }
    
    // Filtrar por localização
    if (filters.location && !space.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    return true;
  });
};
