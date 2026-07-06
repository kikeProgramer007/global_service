import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Nav / Header
    'nav.home': 'Inicio',
    'nav.about': 'Nosotros',
    'nav.services': 'Servicios',
    'nav.portfolio': 'Portafolio',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'nav.techService': 'Servicio Técnico',
    'nav.softwareDev': 'Desarrollo de Software',
    'nav.aiSolutions': 'Soluciones con IA',
    'nav.quote': 'Cotizar Ahora',
    'nav.quoteProject': 'Cotizar Proyecto',
    'nav.allServices': 'Ver Todos los Servicios',
    'nav.all': 'Todos los Servicios',
    'nav.themeLight': 'Activar modo claro',
    'nav.themeDark': 'Activar modo oscuro',
    'nav.subtitle': 'Soluciones Integrales',
    
    // Common / Buttons
    'btn.learnMore': 'Saber más',
    'btn.contactUs': 'Contáctanos',
    'btn.startQuote': 'Empezar Cotización',
    'btn.back': 'Volver',
    'btn.send': 'Enviar',
    'btn.close': 'Cerrar',
    
    // Gaby AI Chat
    'chat.gabyTitle': 'Gaby - Asistente IA',
    'chat.gabyRole': 'Consultor Tecnológico',
    'chat.gabyGreeting': '¡Hola! Soy Gaby, la Inteligencia Artificial de Global Service. ¿En qué solución técnica o ingeniería puedo ayudarte hoy?',
    'chat.placeholder': 'Haz una consulta técnica...',
    'chat.prompt.repair': '💻 Reparar Laptop',
    'chat.prompt.chatbot': '🤖 Chatbot IA',
    'chat.prompt.quote': '🚀 Cotizar Software',
    'chat.prompt.prices': '💰 Precios',
    
    // Home Page
    'home.heroBadge': 'Ingeniería, Microelectrónica e Inteligencia Artificial',
    'home.heroTitle': 'Transformamos Tecnología en Soluciones Extraordinarias',
    'home.heroSubtitle': 'Soporte de alta precisión para laptops, desarrollo de software modular robusto e integración de Agentes de Inteligencia Artificial para automatizar tu negocio.',
    'home.stats.experience': 'Años de Experiencia',
    'home.stats.projects': 'Proyectos Exitosos',
    'home.stats.rating': 'Calificación de Clientes',
    'home.stats.reparations': 'Equipos Reparados',
    'home.cta.title': '¿Tienes un reto tecnológico?',
    'home.cta.subtitle': 'Nuestros ingenieros están listos para diseñar una solución a la medida de tu presupuesto.',
    'home.testimonials': 'Lo que dicen nuestros clientes',
    
    // Services Page
    'services.badge': 'Catálogo de Soluciones',
    'services.title': 'Nuestros Servicios',
    'services.subtitle': 'Ofrecemos un portafolio completo que cubre desde microelectrónica física avanzada hasta sistemas inteligentes con IA en la nube.',
    'services.searchPlaceholder': 'Buscar servicios (ej: laptop, placas, web, IA, soporte...)',
    'services.filterAll': 'Todos los Servicios',
    'services.filterHardware': 'Hardware & Soporte',
    'services.filterSoftware': 'Software & IA',
    'services.noResults': 'No se encontraron servicios',
    'services.noResultsDesc': 'No encontramos servicios que coincidan con la búsqueda "{query}" en la categoría seleccionada. Intenta con otra palabra clave.',
    'services.resetFilters': 'Restablecer filtros',
    'services.whyChooseUs': '¿Por qué elegirnos?',
    'services.whyChooseUsDesc': 'Nuestros clientes nos eligen por la solidez de nuestros procesos técnicos y la honestidad en el trato comercial.',
    'services.readyBanner': '¿Listo para empezar tu proyecto tecnológico?',
    'services.readyBannerDesc': 'Contáctanos hoy mismo para programar una consultoría técnica gratuita y estructurar un presupuesto transparente para tus requerimientos de software, hardware o IA.',
    'services.whatsappSupport': 'Soporte por WhatsApp',
    
    // Nosotros / About View
    'about.title': 'Quiénes Somos',
    'about.subtitle': 'Innovación, precisión y compromiso tecnológico desde Santa Cruz, Bolivia.',
    'about.story': 'Nuestra Historia',
    'about.storyText': 'Global Service nació con el propósito de elevar los estándares de servicio tecnológico e ingeniería en la región. Iniciamos como un laboratorio especializado en reparación de hardware de alta complejidad y, gracias a la confianza de nuestros clientes, evolucionamos hasta convertirnos en un centro integral de desarrollo de software y soluciones basadas en Inteligencia Artificial.',
    'about.mission': 'Misión',
    'about.missionText': 'Proveer soluciones tecnológicas e ingenieriles de la más alta calidad y precisión, impulsando el crecimiento, la eficiencia y la seguridad de las empresas y profesionales que confían en nosotros.',
    'about.vision': 'Visión',
    'about.visionText': 'Ser el referente regional indiscutible en microelectrónica de laptops, desarrollo de software de misión crítica e integración de Inteligencia Artificial aplicada a negocios.',
    'about.team': 'Nuestro Equipo',
    'about.teamSubtitle': 'Ingenieros y técnicos apasionados por la excelencia en cada línea de código y cada soldadura.',
    
    // Contacto View
    'contact.title': 'Contáctanos',
    'contact.subtitle': 'Estamos listos para atenderte en nuestro laboratorio o de forma remota.',
    'contact.form.title': 'Envíanos un mensaje',
    'contact.form.name': 'Nombre Completo',
    'contact.form.email': 'Correo Electrónico',
    'contact.form.phone': 'Teléfono / WhatsApp',
    'contact.form.subject': 'Asunto',
    'contact.form.message': 'Mensaje',
    'contact.form.success': '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo a la brevedad.',
    'contact.info.title': 'Información de Contacto',
    'contact.info.address': 'Dirección',
    'contact.info.addressText': 'Barrio Equipetrol, Calle 8 Este #15, Santa Cruz de la Sierra, Bolivia',
    'contact.info.hours': 'Horario de Atención',
    'contact.info.hoursText': 'Lunes a Viernes: 08:30 - 18:30 | Sábados: 09:00 - 13:00',
    
    // Portfolio View
    'portfolio.title': 'Nuestro Portafolio',
    'portfolio.subtitle': 'Explora algunos de nuestros proyectos más destacados en desarrollo de software, aplicaciones y soluciones de Inteligencia Artificial.',
    'portfolio.client': 'Cliente',
    'portfolio.tech': 'Tecnologías',
    'portfolio.category.all': 'Todos',
    'portfolio.category.software': 'Software',
    'portfolio.category.mobile': 'Móvil',
    'portfolio.category.ia': 'IA',
    'portfolio.category.website': 'Sitio Web',
    
    // Cotizacion View
    'quote.title': 'Cotizador de Proyectos Online',
    'quote.subtitle': 'Estima el presupuesto aproximado para tu solución de software o chatbot en menos de un minuto con nuestro cotizador modular interactivo.',
    'quote.step1': 'Tipo de Solución',
    'quote.step2': 'Características & Alcance',
    'quote.step3': 'Información de Contacto',
    'quote.summary': 'Resumen de Cotización',
    'quote.approxCost': 'Costo Aproximado',
    'quote.featuresSelected': 'Características seleccionadas',
    
    // Blog View
    'blog.title': 'Blog de Tecnología',
    'blog.subtitle': 'Artículos, guías y novedades sobre microelectrónica, ciberseguridad, tendencias en desarrollo de software e Inteligencia Artificial.',
    
    // Servicio Tecnico
    'tech.title': 'Servicio Técnico de Laptops',
    'tech.subtitle': 'Especialistas en microelectrónica y reparación avanzada a nivel de placa madre en Equipetrol, Santa Cruz.',
    
    // Desarrollo Software
    'software.title': 'Desarrollo de Software a Medida',
    'software.subtitle': 'Sistemas web y móviles rápidos, escalables e intuitivos diseñados exactamente para tus flujos de trabajo.',
    
    // Soluciones IA
    'ia.title': 'Soluciones con Inteligencia Artificial',
    'ia.subtitle': 'Lleva tu negocio al siguiente nivel integrando Agentes Autónomos y Chatbots entrenados con IA de última generación.',
  },
  en: {
    // Nav / Header
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.techService': 'Technical Service',
    'nav.softwareDev': 'Software Development',
    'nav.aiSolutions': 'AI Solutions',
    'nav.quote': 'Get Quote',
    'nav.quoteProject': 'Quote Project',
    'nav.allServices': 'View All Services',
    'nav.all': 'All Services',
    'nav.themeLight': 'Enable light mode',
    'nav.themeDark': 'Enable dark mode',
    'nav.subtitle': 'Comprehensive Solutions',
    
    // Common / Buttons
    'btn.learnMore': 'Learn More',
    'btn.contactUs': 'Contact Us',
    'btn.startQuote': 'Start Quote',
    'btn.back': 'Back',
    'btn.send': 'Send',
    'btn.close': 'Close',
    
    // Gaby AI Chat
    'chat.gabyTitle': 'Gaby - AI Assistant',
    'chat.gabyRole': 'Technology Consultant',
    'chat.gabyGreeting': 'Hello! I\'m Gaby, Global Service\'s Artificial Intelligence. What technical solution or engineering project can I help you with today?',
    'chat.placeholder': 'Ask a technical question...',
    'chat.prompt.repair': '💻 Laptop Repair',
    'chat.prompt.chatbot': '🤖 AI Chatbot',
    'chat.prompt.quote': '🚀 Quote Software',
    'chat.prompt.prices': '💰 Prices',
    
    // Home Page
    'home.heroBadge': 'Engineering, Microelectronics & Artificial Intelligence',
    'home.heroTitle': 'We Transform Technology Into Extraordinary Solutions',
    'home.heroSubtitle': 'High-precision support for laptops, robust modular software development, and integration of Artificial Intelligence Agents to automate your business.',
    'home.stats.experience': 'Years of Experience',
    'home.stats.projects': 'Successful Projects',
    'home.stats.rating': 'Client Rating',
    'home.stats.reparations': 'Devices Repaired',
    'home.cta.title': 'Do you have a technological challenge?',
    'home.cta.subtitle': 'Our engineers are ready to design a solution tailored to your budget.',
    'home.testimonials': 'What our clients say',
    
    // Services Page
    'services.badge': 'Solutions Catalog',
    'services.title': 'Our Services',
    'services.subtitle': 'We offer a comprehensive portfolio covering everything from advanced physical microelectronics to intelligent cloud-based AI systems.',
    'services.searchPlaceholder': 'Search services (e.g., laptop, boards, web, AI, support...)',
    'services.filterAll': 'All Services',
    'services.filterHardware': 'Hardware & Support',
    'services.filterSoftware': 'Software & AI',
    'services.noResults': 'No services found',
    'services.noResultsDesc': 'We couldn\'t find any services matching "{query}" in the selected category. Try another keyword.',
    'services.resetFilters': 'Reset filters',
    'services.whyChooseUs': 'Why Choose Us?',
    'services.whyChooseUsDesc': 'Our clients choose us for the solidity of our technical processes and commercial honesty.',
    'services.readyBanner': 'Ready to start your technological project?',
    'services.readyBannerDesc': 'Contact us today to schedule a free technical consultation and build a transparent budget for your software, hardware, or AI requirements.',
    'services.whatsappSupport': 'WhatsApp Support',
    
    // Nosotros / About View
    'about.title': 'About Us',
    'about.subtitle': 'Innovation, precision, and technological commitment from Santa Cruz, Bolivia.',
    'about.story': 'Our Story',
    'about.storyText': 'Global Service was born with the purpose of raising technology service and engineering standards in the region. We started as a specialized laboratory for highly complex hardware repair, and thanks to our clients\' trust, we evolved into an integrated center for software development and Artificial Intelligence solutions.',
    'about.mission': 'Mission',
    'about.missionText': 'Provide engineering and technological solutions of the highest quality and precision, driving the growth, efficiency, and safety of the companies and professionals who trust us.',
    'about.vision': 'Vision',
    'about.visionText': 'To be the indisputable regional benchmark in laptop microelectronics, mission-critical software development, and applied Artificial Intelligence integration.',
    'about.team': 'Our Team',
    'about.teamSubtitle': 'Engineers and technicians passionate about excellence in every line of code and every solder joint.',
    
    // Contacto View
    'contact.title': 'Contact Us',
    'contact.subtitle': 'We are ready to assist you in our laboratory or remotely.',
    'contact.form.title': 'Send us a message',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone / WhatsApp',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.success': 'Message sent successfully! We will get in touch with you shortly.',
    'contact.info.title': 'Contact Information',
    'contact.info.address': 'Address',
    'contact.info.addressText': 'Equipetrol neighborhood, East Street 8 #15, Santa Cruz de la Sierra, Bolivia',
    'contact.info.hours': 'Business Hours',
    'contact.info.hoursText': 'Monday to Friday: 08:30 - 18:30 | Saturdays: 09:00 - 13:00',
    
    // Portfolio View
    'portfolio.title': 'Our Portfolio',
    'portfolio.subtitle': 'Explore some of our most prominent projects in software development, mobile apps, and Artificial Intelligence solutions.',
    'portfolio.client': 'Client',
    'portfolio.tech': 'Technologies',
    'portfolio.category.all': 'All',
    'portfolio.category.software': 'Software',
    'portfolio.category.mobile': 'Mobile',
    'portfolio.category.ia': 'AI',
    'portfolio.category.website': 'Website',
    
    // Cotizacion View
    'quote.title': 'Online Project Estimator',
    'quote.subtitle': 'Estimate an approximate budget for your software or chatbot solution in less than a minute with our interactive modular estimator.',
    'quote.step1': 'Solution Type',
    'quote.step2': 'Features & Scope',
    'quote.step3': 'Contact Info',
    'quote.summary': 'Quote Summary',
    'quote.approxCost': 'Approximate Cost',
    'quote.featuresSelected': 'Selected features',
    
    // Blog View
    'blog.title': 'Tech Blog',
    'blog.subtitle': 'Articles, guides, and news about microelectronics, cybersecurity, software development trends, and Artificial Intelligence.',
    
    // Servicio Tecnico
    'tech.title': 'Laptop Technical Service',
    'tech.subtitle': 'Specialists in microelectronics and advanced motherboard-level repair in Equipetrol, Santa Cruz.',
    
    // Desarrollo Software
    'software.title': 'Custom Software Development',
    'software.subtitle': 'Fast, scalable, and intuitive web and mobile systems designed exactly for your workflows.',
    
    // Soluciones IA
    'ia.title': 'Artificial Intelligence Solutions',
    'ia.subtitle': 'Take your business to the next level by integrating next-generation Autonomous Agents and trained AI Chatbots.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    // Force 'es' on mount and cleanup any previous local storage
    localStorage.setItem('language', 'es');
  }, []);

  const setLanguage = (lang: Language) => {
    // Spanish only
    setLanguageState('es');
    localStorage.setItem('language', 'es');
  };

  const t = (key: string, defaultValue?: string): string => {
    const dict = translations['es'];
    if (dict && dict[key]) {
      return dict[key];
    }
    return defaultValue !== undefined ? defaultValue : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
