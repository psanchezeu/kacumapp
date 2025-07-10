import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-auto">
              {/* Logo para fondo oscuro (header transparente) */}
              <img 
                src="/logos/logo-light.svg" 
                alt="Kacum Logo" 
                className={`h-full w-auto transition-opacity duration-300 ${isScrolled ? 'opacity-0 h-0 w-0' : 'opacity-100'}`}
              />
              
              {/* Logo para fondo claro (header con scroll) */}
              <img 
                src="/logos/logo-dark.svg" 
                alt="Kacum Logo" 
                className={`h-full w-auto transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 h-0 w-0'}`}
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {['Inicio', 'Servicios', 'Proceso', 'Contacto'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`font-medium transition-colors hover:text-blue-500 ${
                  isScrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {item}
              </button>
            ))}
            
            <a
              href="https://demos.kacum.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600' 
                  : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Acceso Demos</span>
            </a>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white rounded-lg shadow-lg mt-2 py-4">
            {['Inicio', 'Servicios', 'Proceso', 'Contacto'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                {item}
              </button>
            ))}
            <a
              href="https://demos.kacum.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 w-full px-4 py-2 text-blue-600 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogIn className="w-4 h-4" />
              <span>Acceso Demos</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;