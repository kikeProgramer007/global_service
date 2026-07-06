/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { 
  Laptop, 
  Code, 
  Brain, 
  ShieldCheck, 
  Briefcase, 
  ShoppingCart,
  CheckCircle,
  Users,
  Award,
  Star,
  MessageSquare,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { ActivePage } from '../../types';
import { IMAGES } from '../../assets';
import { useLanguage } from '../../context/LanguageContext';
import { useCMS } from '../../context/CMSContext';

interface HomeViewProps {
  onPageChange: (page: ActivePage) => void;
}

export default function HomeView({ onPageChange }: HomeViewProps) {
  const { t, language } = useLanguage();
  const { pageContents, testimonials: cmsTestimonials, services: cmsServices } = useCMS();
  const homeContent = pageContents.home;

  const getIconComponent = (name: string) => {
    const Icon = (LucideIcons as any)[name];
    return Icon || Laptop;
  };

  const stats = [
    { value: homeContent.statsExperience, label: language === 'es' ? 'Años de Experiencia' : 'Years of Experience', icon: Award },
    { value: homeContent.statsProjects, label: language === 'es' ? 'Clientes Satisfechos' : 'Satisfied Clients', icon: Users },
    { value: homeContent.statsRating, label: language === 'es' ? 'Proyectos Realizados' : 'Projects Completed', icon: CheckCircle },
    { value: homeContent.statsReparations, label: language === 'es' ? 'Soporte Técnico' : 'Technical Support', icon: Headphones },
    { value: '100%', label: language === 'es' ? 'Garantía Asegurada' : 'Guaranteed Warranty', icon: ShieldCheck },
  ];

  // Map active CMS services for the Home page grid
  const activeCmsServices = cmsServices
    .filter(s => s.status === 'active')
    .slice(0, 6);

  const services = activeCmsServices.map(s => {
    let page = ActivePage.Servicios;
    if (s.category === 'servicio-tecnico') page = ActivePage.ServicioTecnico;
    else if (s.category === 'desarrollo-software') page = ActivePage.DesarrolloSoftware;
    else if (s.category === 'soluciones-ia') page = ActivePage.SolucionesIA;

    let color = 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
    if (s.category === 'desarrollo-software') color = 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30';
    else if (s.category === 'soluciones-ia') color = 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30';

    return {
      title: language === 'es' ? s.titleEs : s.titleEn,
      description: language === 'es' ? s.descShortEs : s.descShortEn,
      icon: getIconComponent(s.iconName),
      page,
      color
    };
  });

  // Map CMS testimonials
  const testimonials = cmsTestimonials.map(t => ({
    name: t.name,
    role: language === 'es' ? t.roleEs : t.roleEn,
    avatar: t.avatar || IMAGES.client1,
    rating: t.rating,
    text: language === 'es' ? t.textEs : t.textEn
  }));

  const benefits = [
    { title: language === 'es' ? 'Garantía Real' : 'Real Warranty' },
    { title: language === 'es' ? 'Atención Inmediata' : 'Immediate Response' },
    { title: language === 'es' ? 'Soporte 24/7' : '24/7 Support' },
    { title: language === 'es' ? 'Seguridad Máxima' : 'Maximum Security' }
  ];

  const commitments = [
    { 
      title: language === 'es' ? 'Personal capacitado y certified' : 'Trained and certified staff', 
      text: language === 'es' 
        ? 'Técnicos e ingenieros con certificaciones de marcas líderes mundiales.' 
        : 'Technicians and engineers with certifications from leading global brands.' 
    },
    { 
      title: language === 'es' ? 'Tecnología actualizada de última generación' : 'Next-generation updated technology', 
      text: language === 'es' 
        ? 'Uso de herramientas de diagnóstico y stacks de desarrollo modernos.' 
        : 'Use of modern diagnostic tools and development stacks.' 
    },
    { 
      title: language === 'es' ? 'Soluciones adaptadas a tus necesidades reales' : 'Solutions adapted to your actual needs', 
      text: language === 'es' 
        ? 'No cobramos de más; diseñamos soluciones enfocadas en la eficiencia de costos.' 
        : 'We don\'t overcharge; we design solutions focused on cost-efficiency.' 
    },
    { 
      title: language === 'es' ? 'Garantía y honestidad comercial' : 'Warranty and commercial honesty', 
      text: language === 'es' 
        ? 'Repuestos genuinos, presupuestos transparentes y soporte continuo post-servicio.' 
        : 'Genuine spare parts, transparent budgets, and continuous post-service support.' 
    }
  ];

  const clientsList = [
    { name: 'Banco Metropolitano', industry: 'Banca y Finanzas', icon: 'Building2', desc: 'Sistemas de seguridad, soporte técnico de servidores y bases de datos críticas.' },
    { name: 'Clínica San Lucas', industry: 'Salud e Investigación', icon: 'Heart', desc: 'Instalación y mantenimiento preventivo/correctivo de hardware y redes de alta velocidad.' },
    { name: 'Constructora del Oriente', industry: 'Industrial y Logística', icon: 'HardHat', desc: 'Integración de sistemas de automatización industrial y software corporativo personalizado.' },
    { name: 'Distribuidora del Sur', industry: 'Comercio y Retail', icon: 'Truck', desc: 'Diseño e implementación de su portal e-commerce escalable con automatización de stock.' },
    { name: 'AgroTec LATAM', industry: 'Tecnología Agro', icon: 'Leaf', desc: 'Soporte de infraestructura IT, sensorización en campo y tableros inteligentes BI.' },
    { name: 'IATech Soluciones', industry: 'Desarrollo Digital', icon: 'Cpu', desc: 'Desarrollo conjunto de aplicaciones empresariales híbridas y automatizaciones con IA.' },
  ];

  return (
    <div id="home-view" className="relative overflow-hidden bg-dark-deep pb-12 text-white">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-2/3 -right-1/4 h-[500px] w-[500px] rounded-full bg-brand-blue/5 blur-[120px] pointer-events-none"></div>

      {/* Hero Section */}
      <section id="home-hero" className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            <div className="inline-flex max-w-max items-center space-x-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-brand-cyan uppercase">
              <span className="flex h-2 w-2 rounded-full bg-brand-cyan animate-pulse"></span>
              <span>{language === 'es' ? homeContent.heroBadgeEs : homeContent.heroBadgeEn}</span>
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
              {language === 'es' ? homeContent.heroTitleEs : homeContent.heroTitleEn}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {language === 'es' ? homeContent.heroSubtitleEs : homeContent.heroSubtitleEn}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => onPageChange(ActivePage.Servicios)}
                className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-cyan/20 transition-all hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <span>{t('nav.services', 'Servicios')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onPageChange(ActivePage.Contacto)}
                className="flex items-center justify-center space-x-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-brand-cyan/30 transition-all active:scale-95 cursor-pointer"
              >
                <span>{t('btn.contactUs', 'Contáctanos')}</span>
                <MessageSquare className="h-4 w-4 text-brand-cyan" />
              </button>
            </div>
            
            {/* Short benefits line */}
            <div className="pt-6 grid grid-cols-2 gap-4 border-t border-white/5 text-xs sm:grid-cols-4 text-slate-500 font-mono">
              {benefits.map((ben, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-brand-cyan" />
                  <span>{ben.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Right Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              {/* Outer Glowing Ring */}
              <div className="absolute inset-0 rounded-3xl bg-brand-cyan/10 blur-[30px] animate-pulse-slow"></div>
              {/* Main Image */}
              <img
                src={IMAGES.heroLaptop}
                alt="Futuristic Laptop Global Service"
                referrerPolicy="no-referrer"
                className="relative z-10 w-full max-w-md rounded-2xl border border-brand-cyan/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="home-services" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {language === 'es' ? '¿Qué podemos hacer por ti?' : 'What can we do for you?'}
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
            {language === 'es'
              ? 'Sistemas de experiencia y tecnología de vanguardia para personas, empresas e instituciones.'
              : 'Cutting-edge experience systems and technology for individuals, businesses, and institutions.'}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                onClick={() => onPageChange(service.page)}
                className={`glass-panel glass-panel-hover flex flex-col justify-between p-6 rounded-2xl border bg-gradient-to-b cursor-pointer ${service.color}`}
              >
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950/50 border border-white/5 text-brand-cyan shadow-md">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{service.description}</p>
                </div>
                <div className="mt-6 flex items-center space-x-1 text-xs font-semibold text-brand-cyan group hover:underline">
                  <span>{t('btn.learnMore', 'Saber más')}</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Counter Section */}
      <section id="home-stats" className="border-y border-white/5 bg-slate-950/40 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5 text-center">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex flex-col items-center space-y-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-cyan/5 text-brand-cyan">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-display text-3xl font-extrabold text-white sm:text-4xl">{stat.value}</span>
                  <span className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitments & Features Section */}
      <section id="home-commitments" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Content */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-white">
              {language === 'es' ? 'Compromiso sólido con la tecnología' : 'Solid commitment to technology'}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {language === 'es'
                ? 'Trabajamos con metodologías ágiles y con los más altos estándares del mercado tecnológico. Te ayudamos a resolver problemas inmediatos y a sentar bases robustas para el futuro.'
                : 'We work with agile methodologies and the highest standards of the technology market. We help you solve immediate problems and lay robust foundations for the future.'}
            </p>
            <ul className="space-y-3.5">
              {commitments.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-cyan/10 text-brand-cyan">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <button
                onClick={() => onPageChange(ActivePage.Nosotros)}
                className="inline-flex items-center space-x-2 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 px-5 py-2.5 text-xs font-semibold text-brand-cyan hover:bg-brand-cyan/20 transition-all cursor-pointer"
              >
                <span>{language === 'es' ? 'Conoce más sobre nosotros' : 'Learn more about us'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Right Image Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400" 
              alt="Work session 1" 
              referrerPolicy="no-referrer"
              className="rounded-2xl border border-white/5 shadow-lg shadow-black/40 hover:scale-[1.02] transition-all object-cover h-48 w-full"
            />
            <img 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=400" 
              alt="Work session 2" 
              referrerPolicy="no-referrer"
              className="rounded-2xl border border-white/5 shadow-lg shadow-black/40 hover:scale-[1.02] transition-all object-cover h-48 w-full mt-6"
            />
          </div>
        </div>
      </section>

      {/* Our Clients Section */}
      <section id="home-clients" className="border-t border-white/5 bg-slate-950/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="inline-flex max-w-max items-center space-x-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-brand-cyan uppercase">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Nuestra Red de Confianza</span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Empresas que confían en nosotros
            </h2>
            <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-500">
              Colaboramos estrechamente con sectores clave para diseñar, optimizar y mantener su infraestructura tecnológica al máximo rendimiento.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clientsList.map((client, index) => {
              const Icon = getIconComponent(client.icon);
              return (
                <div
                  key={index}
                  className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/10 flex flex-col justify-between hover:border-brand-cyan/25 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950/40 border border-white/5 text-brand-cyan shadow-md">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-[9px] tracking-wider text-brand-cyan uppercase bg-brand-cyan/10 px-2.5 py-1 rounded-full border border-brand-cyan/10">
                        {client.industry}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-white transition-colors">
                        {client.name}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mt-2">
                        {client.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="home-testimonials" className="border-t border-white/5 bg-slate-950/20 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t('home.testimonials', 'Lo que dicen nuestros clientes')}
            </h2>
            <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-500">
              {language === 'es'
                ? 'Casos de éxito de personas y corporaciones que confían su tecnología en nosotros.'
                : 'Success stories of individuals and corporations who trust their technology with us.'}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testi, idx) => (
              <div 
                key={idx}
                className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-white/5 bg-slate-900/30"
              >
                <div className="space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 italic leading-relaxed">
                    "{testi.text}"
                  </p>
                </div>
                
                <div className="mt-6 flex items-center space-x-3.5 border-t border-white/5 pt-4">
                  <img 
                    src={testi.avatar} 
                    alt={testi.name} 
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full border border-brand-cyan/20 object-cover"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">{testi.name}</h4>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-mono">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-brand-cyan/20 bg-gradient-to-r from-brand-cyan/10 to-brand-blue/10 p-8 sm:p-12 text-center space-y-6 shadow-[0_0_40px_rgba(0,240,255,0.05)]">
          <div className="absolute inset-0 bg-dark-navy/40 -z-10"></div>
          <div className="max-w-3xl mx-auto space-y-4">
            <h3 className="font-display text-2xl font-bold sm:text-3xl text-white">{t('home.cta.title', '¿Tienes un reto tecnológico?')}</h3>
            <p className="text-sm sm:text-base text-slate-400">
              {t('home.cta.subtitle', 'Nuestros ingenieros están listos para diseñar una solución a la medida de tu presupuesto.')}
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
            <button
              onClick={() => {
                onPageChange(ActivePage.Contacto);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-center space-x-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-brand-cyan/30 transition-all active:scale-95 cursor-pointer"
            >
              <span>{t('btn.contactUs', 'Contáctanos')}</span>
              <MessageSquare className="h-4 w-4 text-brand-cyan" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
