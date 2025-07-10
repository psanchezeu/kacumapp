import { Database, Zap, Bot, Cog, BarChart3, Shield } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Database,
      title: 'CRM Inteligente',
      description: 'Sistemas de gestión de clientes con IA que predicen comportamientos y automatizan seguimientos.',
      features: ['Automatización de ventas', 'Análisis predictivo', 'Integración omnicanal','Aplicable a salud, eventos, talleres, educación...','Integración omnicanal']
    },
    {
      icon: Zap,
      title: 'SaaS Personalizado',
      description: 'Plataformas como servicio escalables con funcionalidades de IA adaptadas a tu industria.',
      features: ['Arquitectura escalable', 'APIs robustas', 'Dashboard intuitivo']
    },
    {
      icon: Bot,
      title: 'Chatbots IA',
      description: 'Asistentes virtuales inteligentes que mejoran la experiencia del cliente 24/7.',
      features: ['Procesamiento natural', 'Aprendizaje continuo', 'Integración multicanal']
    },
    {
      icon: Cog,
      title: 'Automatización',
      description: 'Workflows inteligentes que optimizan procesos empresariales y reducen costos operativos.',
      features: ['Procesos automáticos', 'Integración sistemas', 'Monitoreo en tiempo real']
    },
    {
      icon: BarChart3,
      title: 'Analytics IA',
      description: 'Dashboards con inteligencia artificial que transforman datos en insights accionables.',
      features: ['Visualización avanzada', 'Predicciones precisas', 'Reportes automáticos']
    },
    {
      icon: Shield,
      title: 'Seguridad IA',
      description: 'Sistemas de seguridad con machine learning para detectar y prevenir amenazas.',
      features: ['Detección anomalías', 'Protección proactiva', 'Cumplimiento normativo']
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Servicios de <span className="text-blue-600">Vanguardia</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desarrollamos soluciones de inteligencia artificial que transforman la manera 
            en que tu empresa opera y se relaciona con sus clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;