import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-6 space-y-4 sm:space-y-0">
              <a href="#inicio" className="flex items-center space-x-3">
                <img 
                  src="/logos/logo-light.svg" 
                  alt="Kacum Logo" 
                  className="h-10 w-auto"
                />
              </a>
              <span className="text-2xl font-bold text-white">Kacum</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md text-sm sm:text-base">
              Transformamos ideas en aplicaciones inteligentes que revolucionan negocios. 
              Especialistas en IA, CRM, SaaS y automatización empresarial.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="mailto:contacto@kacum.ai" 
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 text-sm sm:text-base"
                aria-label="Enviar correo electrónico"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>contacto@kacum.ai</span>
              </a>
              <a 
                href="tel:+34900123456" 
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 text-sm sm:text-base"
                aria-label="Llamar por teléfono"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>+34 900 123 456</span>
              </a>
              <div className="text-gray-400 flex items-start space-x-2 text-sm sm:text-base w-full sm:w-auto">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                <span>Madrid, España</span>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-0">
            <h3 className="text-lg font-semibold mb-4 text-white">Servicios</h3>
            <ul className="space-y-2.5 text-gray-400">
              {['CRM Inteligente', 'SaaS Personalizado', 'Chatbots IA', 'Automatización', 'Analytics IA'].map((service) => (
                <li key={service}>
                  <a 
                    href="#servicios" 
                    className="hover:text-white transition-colors text-sm sm:text-base block py-1"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 sm:mt-0">
            <h3 className="text-lg font-semibold mb-4 text-white">Empresa</h3>
            <ul className="space-y-2.5 text-gray-400">
              {[
                { text: 'Inicio', href: '#inicio' },
                { text: 'Servicios', href: '#servicios' },
                { text: 'Proceso', href: '#proceso' },
                { text: 'Contacto', href: '#contacto' }
              ].map((item) => (
                <li key={item.text}>
                  <a 
                    href={item.href} 
                    className="hover:text-white transition-colors text-sm sm:text-base block py-1"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left mb-4 sm:mb-0">
            {new Date().getFullYear()} Kacum. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a 
              href="#" 
              className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                // Aquí iría la lógica para mostrar la política de privacidad
                alert('Política de Privacidad');
              }}
            >
              Política de Privacidad
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                // Aquí iría la lógica para mostrar los términos de servicio
                alert('Términos de Servicio');
              }}
            >
              Términos de Servicio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;