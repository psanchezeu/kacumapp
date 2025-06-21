import React from 'react';
import { Bot, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Kacum</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Transformamos ideas en aplicaciones inteligentes que revolucionan negocios. 
              Especialistas en IA, CRM, SaaS y automatización empresarial.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:contacto@kacum.ai" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="tel:+34900123456" className="text-gray-400 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
              </a>
              <div className="text-gray-400">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#servicios" className="hover:text-white transition-colors">CRM Inteligente</a></li>
              <li><a href="#servicios" className="hover:text-white transition-colors">SaaS Personalizado</a></li>
              <li><a href="#servicios" className="hover:text-white transition-colors">Chatbots IA</a></li>
              <li><a href="#servicios" className="hover:text-white transition-colors">Automatización</a></li>
              <li><a href="#servicios" className="hover:text-white transition-colors">Analytics IA</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#inicio" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#servicios" className="hover:text-white transition-colors">Servicios</a></li>
              <li><a href="#proceso" className="hover:text-white transition-colors">Proceso</a></li>
              <li><a href="#contacto" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Kacum. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Términos de Servicio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;