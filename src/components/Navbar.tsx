
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-display font-bold text-primary">Kumbila</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary transition-colors">Início</Link>
          <Link to="/espacos" className="text-gray-700 hover:text-primary transition-colors">Espaços</Link>
          <Link to="/sobre" className="text-gray-700 hover:text-primary transition-colors">Sobre</Link>
          <Link to="/contato" className="text-gray-700 hover:text-primary transition-colors">Contato</Link>
          <Link to="/login" className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors">
            <User size={20} />
            <span>Entrar</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t mt-4 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/espacos" 
              className="text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Espaços
            </Link>
            <Link 
              to="/sobre" 
              className="text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Sobre
            </Link>
            <Link 
              to="/contato" 
              className="text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Contato
            </Link>
            <Link 
              to="/login" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              <User size={20} />
              <span>Entrar</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
