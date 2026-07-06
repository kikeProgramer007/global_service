/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Laptop, 
  Code, 
  Brain, 
  ShieldCheck, 
  Briefcase, 
  ShoppingCart,
  Wrench,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Search,
  X
} from 'lucide-react';
import { ActivePage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ServiciosViewProps {
  onPageChange: (page: ActivePage) => void;
}

export default function ServiciosView({ onPageChange }: ServiciosViewProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<'all' | 'hardware' | 'software'>('all');
  const { t, language } = useLanguage();

  const serviceCategories = [
    {
      title: language === 'es' ? 'Servicio Técnico Especializado' : 'Specialized Technical Service',
      description: language === 'es'
        ? 'Ofrecemos diagnósticos exactos y reparaciones microelectrónicas complejas para notebooks, computadoras y periféricos.'
        : 'We offer accurate diagnostics and complex microelectronic repairs for notebooks, computers, and peripherals.',
      icon: Wrench,
      page: ActivePage.ServicioTecnico,
      details: language === 'es'
        ? [
            'Reparación de placas madre de laptops',
            'Mantenimiento físico preventivo y térmico',
            'Recuperación de datos de discos dañados',
            'Instalación de redes corporativas estructuradas'
          ]
        : [
            'Laptop motherboard repairs',
            'Preventive physical & thermal maintenance',
            'Data recovery from damaged drives',
            'Structured corporate networks installation'
          ],
      buttonText: language === 'es' ? 'Explorar Servicio Técnico' : 'Explore Technical Service',
      type: 'hardware'
    },
    {
      title: language === 'es' ? 'Desarrollo de Software a Medida' : 'Custom Software Development',
      description: language === 'es'
        ? 'Creamos soluciones de software web, móviles y empresariales adaptadas exactamente a los flujos lógicos de tu negocio.'
        : 'We create web, mobile, and enterprise software solutions tailored exactly to your business logical workflows.',
      icon: Code,
      page: ActivePage.DesarrolloSoftware,
      details: language === 'es'
        ? [
            'Sistemas CRM para gestión de ventas',
            'Sistemas ERP para planificación integral',
            'Aplicaciones móviles Android e iOS',
            'Automatización de flujos y pasarelas de pago'
          ]
        : [
            'CRM systems for sales management',
            'ERP systems for comprehensive planning',
            'Android and iOS mobile apps',
            'Workflow automation & payment gateways'
          ],
      buttonText: language === 'es' ? 'Explorar Software' : 'Explore Software',
      type: 'software'
    },
    {
      title: language === 'es' ? 'Soluciones con Inteligencia Artificial' : 'Artificial Intelligence Solutions',
      description: language === 'es'
        ? 'Integramos modelos avanzados de procesamiento de lenguaje para automatizar la atención y agilizar operaciones complejas.'
        : 'We integrate advanced language processing models to automate support and streamline complex operations.',
      icon: Brain,
      page: ActivePage.SolucionesIA,
      details: language === 'es'
        ? [
            'Chatbots de WhatsApp inteligentes y 24/7',
            'Agentes virtuales autónomos para atención',
            'Bases de conocimiento dinámicas corporativas',
            'Sistemas de análisis predictivo de datos'
          ]
        : [
            'Intelligent & 24/7 WhatsApp Chatbots',
            'Autonomous virtual agents for support',
            'Dynamic corporate knowledge bases',
            'Predictive data analysis systems'
          ],
      buttonText: language === 'es' ? 'Explorar Soluciones IA' : 'Explore AI Solutions',
      type: 'software'
    },
    {
      title: language === 'es' ? 'Seguridad Informática y Auditoría' : 'Cybersecurity and Auditing',
      description: language === 'es'
        ? 'Protegemos tu activo más valioso: la información. Implementamos firewalls, cifrado y políticas sólidas de seguridad.'
        : 'We protect your most valuable asset: information. We implement firewalls, encryption, and solid security policies.',
      icon: ShieldCheck,
      page: ActivePage.Contacto,
      details: language === 'es'
        ? [
            'Auditorías de ciberseguridad interna',
            'Eliminación avanzada de virus y malware',
            'Sistemas automáticos de backup en la nube',
            'Monitoreo preventivo ante ataques externos'
          ]
        : [
            'Internal cybersecurity audits',
            'Advanced virus and malware removal',
            'Automated cloud backup systems',
            'Preventive monitoring against external attacks'
          ],
      buttonText: language === 'es' ? 'Solicitar Auditoría' : 'Request Audit',
      type: 'software'
    },
    {
      title: language === 'es' ? 'Soporte y Outsourcing IT' : 'IT Support & Outsourcing',
      description: language === 'es'
        ? 'Olvídate de los problemas técnicos con nuestro plan mensual de soporte informático outsourcing diseñado para empresas.'
        : 'Forget about technical issues with our monthly outsourcing IT support plan designed for businesses.',
      icon: Briefcase,
      page: ActivePage.Contacto,
      details: language === 'es'
        ? [
            'Soporte técnico presencial e inmediato',
            'Soporte remoto para resolución express',
            'Administración de servidores Windows/Linux',
            'Mantenimiento mensual programado de flota'
          ]
        : [
            'On-site and immediate technical support',
            'Remote support for express troubleshooting',
            'Windows/Linux server administration',
            'Scheduled monthly fleet maintenance'
          ],
      buttonText: language === 'es' ? 'Ver Planes Corporativos' : 'View Corporate Plans',
      type: 'hardware'
    },
    {
      title: language === 'es' ? 'Venta de Hardware y Equipamiento' : 'Hardware & Equipment Sales',
      description: language === 'es'
        ? 'Provisión de laptops corporativas, servidores, racks de comunicación y periféricos de las mejores marcas del mercado.'
        : 'Provision of corporate laptops, servers, communication racks, and peripherals from the best brands on the market.',
      icon: ShoppingCart,
      page: ActivePage.Contacto,
      details: language === 'es'
        ? [
            'Laptops y computadoras corporativas',
            'Servidores físicos y NAS de alto rendimiento',
            'Componentes electrónicos originales',
            'Racks, switches y antenas de largo alcance'
          ]
        : [
            'Corporate laptops and computers',
            'Physical servers & high-performance NAS',
            'Original electronic components',
            'Racks, switches, and long-range antennas'
          ],
      buttonText: language === 'es' ? 'Solicitar Catálogo' : 'Request Catalog',
      type: 'hardware'
    }
  ];

  const valueProps = [
    { 
      title: language === 'es' ? 'Experiencia Comprobada' : 'Proven Experience', 
      text: language === 'es' 
        ? 'Contamos con más de 6 años resolviendo problemas lógicos y microelectrónicos de alta complejidad.' 
        : 'We have over 6 years of experience solving highly complex logical and microelectronic issues.'
    },
    { 
      title: language === 'es' ? 'Soluciones Integrales' : 'Comprehensive Solutions', 
      text: language === 'es' 
        ? 'Atendemos tanto el hardware físico (placas, chips) como el software digital (sistemas, IA, nube).' 
        : 'We address both physical hardware (boards, chips) and digital software (systems, AI, cloud).'
    },
    { 
      title: language === 'es' ? 'Soporte 24/7' : '24/7 Support', 
      text: language === 'es' 
        ? 'Nuestros contratos empresariales y agentes de IA te brindan cobertura ininterrumpida ante cualquier evento.' 
        : 'Our enterprise contracts and AI agents provide continuous coverage for any event.'
    },
    { 
      title: language === 'es' ? 'Garantía de Calidad' : 'Quality Guarantee', 
      text: language === 'es' 
        ? 'Todos nuestros trabajos en laboratorio físico o de código de software cuentan con garantía real y soporte continuo.' 
        : 'All of our physical laboratory and software code works come with a real warranty and continuous support.'
    }
  ];

  const filteredServices = serviceCategories.filter(serv => {
    // Filter by type
    const matchesType = selectedType === 'all' || serv.type === selectedType;
    
    // Filter by search query
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      serv.title.toLowerCase().includes(query) || 
      serv.description.toLowerCase().includes(query) ||
      serv.details.some(detail => detail.toLowerCase().includes(query));
      
    return matchesType && matchesSearch;
  });

  return (
    <div id="servicios-view" className="bg-dark-deep pb-16 text-white relative overflow-hidden">
      <div className="absolute top-1/4 -left-1/4 h-[400px] w-[400px] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none"></div>

      {/* Header section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <div className="inline-flex max-w-max items-center space-x-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-brand-cyan uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('services.badge', 'Catálogo de Soluciones')}</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {language === 'es' ? 'Nuestros ' : 'Our '}<span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent text-glow-cyan">{t('nav.services', 'Servicios')}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
            {t('services.subtitle', 'Ofrecemos un portafolio completo que cubre desde microelectrónica física avanzada hasta sistemas inteligentes con IA en la nube.')}
          </p>
        </div>
      </section>

      {/* Search and Filter Controls */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-panel p-4 rounded-2xl border border-white/5 bg-slate-900/10">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('services.searchPlaceholder', 'Buscar servicios (ej: laptop, placas, web, IA, soporte...)')}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border bg-slate-950/40 text-white placeholder-slate-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={language === 'es' ? 'Limpiar búsqueda' : 'Clear search'}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar py-1 md:py-0">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap border ${
                selectedType === 'all'
                  ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-white border-transparent shadow-md shadow-brand-cyan/10 font-bold'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {t('services.filterAll', 'Todos los Servicios')}
            </button>
            <button
              onClick={() => setSelectedType('hardware')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap border ${
                selectedType === 'hardware'
                  ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-white border-transparent shadow-md shadow-brand-cyan/10 font-bold'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Laptop className="h-4 w-4" />
              <span>{t('services.filterHardware', 'Hardware & Soporte')}</span>
            </button>
            <button
              onClick={() => setSelectedType('software')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap border ${
                selectedType === 'software'
                  ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-white border-transparent shadow-md shadow-brand-cyan/10 font-bold'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Code className="h-4 w-4" />
              <span>{t('services.filterSoftware', 'Software & IA')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Services detailed catalog */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 px-4 glass-panel rounded-2xl border border-white/5 bg-slate-900/10 max-w-lg mx-auto space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/30 text-slate-400 mx-auto">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">{t('services.noResults', 'No se encontraron servicios')}</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t('services.noResultsDesc', 'No encontramos servicios que coincidan con la búsqueda "{query}" en la categoría seleccionada. Intenta con otra palabra clave.').replace('{query}', searchQuery)}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
              }}
              className="inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue px-5 py-2.5 text-xs font-semibold text-white shadow-md cursor-pointer transition-all active:scale-95 hover:brightness-110"
            >
              <span>{t('services.resetFilters', 'Restablecer filtros')}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((serv, idx) => {
              const Icon = serv.icon;
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.16, 1, 0.3, 1], // easeOutExpo
                    delay: idx * 0.06 
                  }}
                  key={serv.title}
                  className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/10 flex flex-col justify-between hover:border-brand-cyan/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.05)] transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-cyan/5 border border-brand-cyan/20 text-brand-cyan">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold text-white">{serv.title}</h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-brand-cyan/10 bg-brand-cyan/5 text-brand-cyan">
                        {serv.type === 'hardware' ? 'Hardware' : 'Software'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{serv.description}</p>
                    
                    <ul className="space-y-2 pt-3">
                      {serv.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-center space-x-2 text-xs text-slate-500">
                          <CheckCircle className="h-3.5 w-3.5 text-brand-cyan shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5">
                    <button
                      onClick={() => {
                        onPageChange(serv.page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex w-full items-center justify-center space-x-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-cyan/10 hover:border-brand-cyan/30 transition-all active:scale-95 cursor-pointer"
                    >
                      <span>{serv.buttonText}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-brand-cyan" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-white/5 mt-12">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{t('services.whyChooseUs', '¿Por qué elegirnos?')}</h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-500">
            {t('services.whyChooseUsDesc', 'Nuestros clientes nos eligen por la solidez de nuestros procesos técnicos y la honestidad en el trato comercial.')}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((prop, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/30 text-center space-y-3">
              <span className="font-display text-2xl font-extrabold text-brand-cyan text-glow-cyan font-mono">0{idx + 1}</span>
              <h4 className="font-display text-base font-bold text-white">{prop.title}</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{prop.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-brand-cyan/20 bg-gradient-to-r from-brand-cyan/10 to-brand-blue/10 p-8 sm:p-12 text-center space-y-6 shadow-[0_0_40px_rgba(0,240,255,0.05)]">
          <div className="absolute inset-0 bg-dark-navy/40 -z-10"></div>
          <div className="max-w-3xl mx-auto space-y-4">
            <h3 className="font-display text-2xl font-bold sm:text-3xl text-white">{t('services.readyBanner', '¿Listo para empezar tu proyecto tecnológico?')}</h3>
            <p className="text-sm sm:text-base text-slate-400">
              {t('services.readyBannerDesc', 'Contáctanos hoy mismo para programar una consultoría técnica gratuita y estructurar un presupuesto transparente para tus requerimientos de software, hardware o IA.')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button
              onClick={() => {
                onPageChange(ActivePage.Cotizacion);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-cyan/20 transition-all hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <span>{t('btn.startQuote', 'Empezar Cotización')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="https://wa.me/59178459001"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center space-x-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-brand-cyan/30 transition-all active:scale-95"
            >
              <PhoneCall className="h-4 w-4 text-brand-cyan" />
              <span>{t('services.whatsappSupport', 'Soporte por WhatsApp')}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
