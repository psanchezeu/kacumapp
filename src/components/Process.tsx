import React from 'react';
import { MessageSquare, Lightbulb, Code, Rocket } from 'lucide-react';

const Process = () => {
  const steps = [
    {
      icon: MessageSquare,
      title: 'Consulta Inicial',
      description: 'Analizamos tus necesidades y definimos el alcance del proyecto mediante una reunión personalizada.',
      details: ['Análisis de requerimientos', 'Definición de objetivos', 'Estimación de tiempos']
    },
    {
      icon: Lightbulb,
      title: 'Prototipo IA',
      description: 'Desarrollamos un prototipo funcional que demuestra las capacidades de tu futura aplicación.',
      details: ['Diseño de interfaz', 'Funcionalidades core', 'Demostración interactiva']
    },
    {
      icon: Code,
      title: 'Desarrollo',
      description: 'Una vez aprobado el presupuesto, iniciamos el desarrollo completo con metodologías ágiles.',
      details: ['Desarrollo iterativo', 'Testing continuo', 'Actualizaciones semanales']
    },
    {
      icon: Rocket,
      title: 'Lanzamiento',
      description: 'Desplegamos tu aplicación y proporcionamos soporte completo para garantizar el éxito.',
      details: ['Deployment seguro', 'Capacitación del equipo', 'Soporte 24/7']
    }
  ];

  return (
    <section id="proceso" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nuestro <span className="text-blue-600">Proceso</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un enfoque estructurado y transparente que garantiza resultados excepcionales 
            en cada proyecto de inteligencia artificial.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 relative z-10">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mb-6 mx-auto">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="text-sm font-semibold text-blue-600 mb-2">
                      Paso {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-500">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Step number */}
                <div className="hidden lg:block absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm z-20">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Listo para comenzar tu proyecto?
            </h3>
            <p className="text-gray-600 mb-6">
              Solicita una consulta gratuita y recibe un prototipo personalizado en 48 horas.
            </p>
            <button
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Solicitar Consulta Gratuita
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;