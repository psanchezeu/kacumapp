import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center py-3 sm:py-4">
          <div className="flex items-center space-x-3">
            <a href="#inicio" className="h-10 w-auto flex items-center">
              {/* Logo para fondo oscuro (header transparente) */}
              <img 
                src="/logos/logo-light.svg" 
                alt="Kacum Logo" 
                className={`h-8 sm:h-10 w-auto transition-opacity duration-300 ${isScrolled ? 'opacity-0 h-0 w-0' : 'opacity-100'}`}
              />
              
              {/* Logo para fondo claro (header con scroll) */}
              <img 
                src="/logos/logo-dark.svg" 
                alt="Kacum Logo" 
                className={`h-8 sm:h-10 w-auto transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 h-0 w-0'}`}
              />
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {['Inicio', 'Servicios', 'Proceso', 'Contacto'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`font-medium transition-colors hover:text-blue-500 px-2 py-1 text-sm sm:text-base ${
                  isScrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {item}
              </button>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600' 
                      : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Mi Cuenta</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium rounded-lg transition-colors ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-red-600' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600' 
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white rounded-lg shadow-lg mt-2 py-2">
            {['Inicio', 'Servicios', 'Proceso', 'Contacto'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 text-base transition-colors"
              >
                {item}
              </button>
            ))}
            
            {user ? (
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 text-base transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Mi Cuenta</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 text-base transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 w-full px-4 py-3 text-blue-600 hover:bg-blue-50 text-base transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </Link>
              </div>
            )}
            
            <a
              href="https://demos.kacum.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 text-base transition-colors border-t border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogIn className="w-5 h-5" />
              <span>Acceso a Demos</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;