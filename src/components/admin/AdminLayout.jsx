
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Home,
  FileText, 
  Calendar, 
  Receipt, 
  Star, 
  History,
  Settings, 
  ChevronRight,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Admin layout component with sidebar
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
const AdminLayout = ({ children }) => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      label: 'Visão Geral', 
      path: '/admin' 
    },
    { 
      icon: <Users size={20} />, 
      label: 'Usuários', 
      path: '/admin/users' 
    },
    { 
      icon: <Home size={20} />, 
      label: 'Espaços', 
      path: '/admin/spaces' 
    },
    { 
      icon: <Calendar size={20} />, 
      label: 'Reservas', 
      path: '/admin/reservations' 
    },
    { 
      icon: <Receipt size={20} />, 
      label: 'Pagamentos', 
      path: '/admin/payments' 
    },
    { 
      icon: <Star size={20} />, 
      label: 'Avaliações', 
      path: '/admin/reviews' 
    },
    { 
      icon: <History size={20} />,
      label: 'Logs e Auditoria', 
      path: '/admin/logs' 
    },
    { 
      icon: <Settings size={20} />, 
      label: 'Configurações', 
      path: '/admin/settings' 
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow h-full bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link to="/admin" className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Kumbila Admin</h1>
            </Link>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className={cn(
                    "mr-3",
                    isActive(item.path) ? "text-blue-600" : "text-gray-500"
                  )}>
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive(item.path) && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div>
                <img
                  className="h-8 w-8 rounded-full"
                  src={profile?.avatar_url || 'https://via.placeholder.com/40'}
                  alt="Avatar"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {profile?.full_name || 'Admin'}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut} 
                  className="flex items-center text-xs text-gray-500 hover:text-gray-700"
                >
                  <LogOut size={16} className="mr-1" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-20">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="py-6 w-72">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-blue-600">Kumbila Admin</h1>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>
            <nav className="flex flex-col space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-2 py-3 text-base font-medium rounded-md",
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className={cn(
                    "mr-3",
                    isActive(item.path) ? "text-blue-600" : "text-gray-500"
                  )}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto border-t border-gray-200 pt-4">
              <div className="flex items-center px-2">
                <img
                  className="h-8 w-8 rounded-full"
                  src={profile?.avatar_url || 'https://via.placeholder.com/40'}
                  alt="Avatar"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {profile?.full_name || 'Admin'}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignOut} 
                    className="flex items-center text-xs text-gray-500 hover:text-gray-700"
                  >
                    <LogOut size={16} className="mr-1" />
                    Sair
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
