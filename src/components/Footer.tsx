
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div>
            <Link to="/" className="text-2xl font-display font-bold text-primary mb-4 inline-block">
              Kumbila
            </Link>
            <p className="text-sm mt-2">
              A plataforma líder para reserva de espaços para eventos e aquisição de serviços em Angola.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary transition-colors">Início</Link></li>
              <li><Link to="/espacos" className="hover:text-primary transition-colors">Espaços</Link></li>
              <li><Link to="/sobre" className="hover:text-primary transition-colors">Sobre nós</Link></li>
              <li><Link to="/contato" className="hover:text-primary transition-colors">Contato</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Área do cliente</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone size={18} className="mr-2" />
                <span>+244 923 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2" />
                <span>info@kumbila.ao</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1" />
                <span>Rua Comandante Gika, Edifício Garden Towers, Torre B, 7º andar, Luanda</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Redes Sociais</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Kumbila. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
