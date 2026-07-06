/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  ExternalLink, 
  CheckCircle,
  X,
  Code,
  Smartphone,
  Brain,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { IMAGES } from '../../assets';
import { Project, ActivePage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCMS } from '../../context/CMSContext';
import LazyImage from '../LazyImage';

interface PortafolioViewProps {
  onPageChange: (page: ActivePage) => void;
}

export default function PortafolioView({ onPageChange }: PortafolioViewProps) {
  const { t, language } = useLanguage();
  const { projects: cmsProjects } = useCMS();
  const [filter, setFilter] = useState<'all' | 'software' | 'mobile' | 'ia' | 'website'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  React.useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  const projects: Project[] = cmsProjects
    .filter((p) => p.status === 'publicado')
    .map((p) => ({
      id: p.id,
      title: language === 'es' ? p.titleEs : p.titleEn,
      category: p.category,
      image: p.image || IMAGES.project1,
      description: language === 'es' ? p.descriptionEs : p.descriptionEn,
      client: p.client,
      tech: p.tech,
    }));

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'software': return <Code className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'ia': return <Brain className="h-4 w-4" />;
      case 'website': return <Globe className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'software': return language === 'es' ? 'Sistemas' : 'Systems';
      case 'mobile': return language === 'es' ? 'App Móvil' : 'Mobile App';
      case 'ia': return language === 'es' ? 'Inteligencia Artificial' : 'Artificial Intelligence';
      case 'website': return language === 'es' ? 'Sitio Web' : 'Website';
      default: return language === 'es' ? 'Proyecto' : 'Project';
    }
  };

  const filterButtons = [
    { label: language === 'es' ? 'Todos' : 'All', value: 'all' },
    { label: language === 'es' ? 'Sistemas ERP/CRM' : 'ERP/CRM Systems', value: 'software' },
    { label: language === 'es' ? 'Apps Móviles' : 'Mobile Apps', value: 'mobile' },
    { label: language === 'es' ? 'Intel. Artificial' : 'Artificial Intelligence', value: 'ia' },
    { label: language === 'es' ? 'Sitios Web' : 'Websites', value: 'website' }
  ];

  const resultsAchieved = [
    language === 'es' ? 'Reducción de carga laboral repetitiva' : 'Reduction of repetitive workload',
    language === 'es' ? 'Trazabilidad lógica en tiempo real' : 'Real-time logical traceability',
    language === 'es' ? 'Emisión y exportación automática en PDF/Excel' : 'Automatic emission and export in PDF/Excel'
  ];

  return (
    <div id="portafolio-view" className="bg-dark-deep pb-16 text-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/4 -left-1/4 h-[400px] w-[400px] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none"></div>

      {/* Header section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <div className="inline-flex max-w-max items-center space-x-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-brand-cyan uppercase">
            <Briefcase className="h-3.5 w-3.5" />
            <span>{language === 'es' ? 'Casos de Éxito de Clientes' : 'Customer Success Stories'}</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {language === 'es' ? 'Nuestro ' : 'Our '}<span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent text-glow-cyan">{language === 'es' ? 'Portafolio' : 'Portfolio'}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
            {t('portfolio.subtitle', 'Explora una selección de los últimos sistemas de software, aplicaciones de inteligencia artificial y desarrollos móviles que hemos implementado.')}
          </p>
        </div>
      </section>

      {/* Categories filter buttons */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value as any)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                filter === btn.value
                  ? 'bg-brand-cyan text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentProjects.map((project) => (
              <div 
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="glass-panel group rounded-2xl border border-white/5 bg-slate-900/30 overflow-hidden hover:border-brand-cyan/30 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Project Image */}
                  <div className="relative overflow-hidden h-48 border-b border-white/5">
                    <LazyImage 
                      src={project.image} 
                      alt={project.title} 
                      referrerPolicy="no-referrer"
                      containerClassName="w-full h-full"
                      className="group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5 rounded-lg bg-dark-deep/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-brand-cyan border border-brand-cyan/20">
                      {getCategoryIcon(project.category)}
                      <span>{getCategoryLabel(project.category)}</span>
                    </div>
                  </div>
                  {/* Project text */}
                  <div className="p-5 space-y-2">
                    <span className="font-mono text-[9px] tracking-wider text-slate-500 uppercase">{project.client}</span>
                    <h3 className="font-display text-base font-bold text-white group-hover:text-brand-cyan transition-colors">{project.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{project.description}</p>
                  </div>
                </div>
                
                {/* Footer details */}
                <div className="px-5 pb-5 pt-3 border-t border-white/5 flex flex-wrap gap-1">
                  {project.tech.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="rounded bg-white/5 border border-white/5 px-2 py-0.5 font-mono text-[9px] text-slate-500 uppercase">
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-slate-500">
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-4">
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-slate-900/30 text-slate-400 hover:text-white hover:border-brand-cyan/20 transition-all ${
                  currentPage === 1 ? 'opacity-40 cursor-not-allowed hover:text-slate-400 hover:border-white/5' : 'cursor-pointer'
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-brand-cyan text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.35)] font-extrabold'
                      : 'border border-white/5 bg-slate-900/30 text-slate-400 hover:text-white hover:border-brand-cyan/10'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-slate-900/30 text-slate-400 hover:text-white hover:border-brand-cyan/20 transition-all ${
                  currentPage === totalPages ? 'opacity-40 cursor-not-allowed hover:text-slate-400 hover:border-white/5' : 'cursor-pointer'
                }`}
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call To Action */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 border-t border-white/5 mt-12">
        <div className="glass-panel p-8 rounded-2xl border border-brand-cyan/20 bg-gradient-to-r from-brand-cyan/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="font-display text-lg font-bold text-white">{t('portfolio.cta.title', '¿Listo para ser nuestro próximo caso de éxito?')}</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {t('portfolio.cta.subtitle', 'Permite que nuestro equipo de ingenieros diseñe e implemente tu sistema ideal con la máxima eficiencia técnica.')}
            </p>
          </div>
          <button
            onClick={() => {
              onPageChange(ActivePage.Cotizacion);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex shrink-0 items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue px-5 py-3 text-xs font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <span>{language === 'es' ? 'Iniciar Mi Proyecto' : 'Start My Project'}</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 px-4 py-10 backdrop-blur-md flex items-start justify-center">
            {/* Clickable backdrop overlay */}
            <div className="absolute inset-0 -z-10" onClick={() => setSelectedProject(null)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-dark-navy p-6 sm:p-8 shadow-2xl space-y-6 my-auto"
            >
              {/* Close button */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 rounded-full bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors z-20 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-4">
                <span className="inline-flex items-center space-x-1.5 rounded-lg bg-brand-cyan/10 px-2.5 py-1 text-xs font-semibold text-brand-cyan border border-brand-cyan/20 uppercase font-mono">
                  {getCategoryLabel(selectedProject.category)}
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white pr-8">{selectedProject.title}</h2>
                <div className="font-mono text-xs text-slate-500">
                  {language === 'es' ? 'Cliente' : 'Client'}: <span className="text-white font-sans font-semibold">{selectedProject.client}</span>
                </div>
              </div>

              {/* Image banner inside modal */}
              <div className="rounded-xl overflow-hidden border border-white/5 h-64">
                <LazyImage 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  referrerPolicy="no-referrer"
                  containerClassName="w-full h-full"
                  className="object-cover"
                />
              </div>

              {/* Long description */}
              <div className="space-y-3.5">
                <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">{language === 'es' ? 'Resumen del Proyecto' : 'Project Summary'}</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {selectedProject.description} {language === 'es'
                    ? 'Para este cliente, desarrollamos un ecosistema completo de control lógico enfocado en resolver cuellos de botella clave. El sistema se diseñó de manera adaptativa para ejecutarse de manera fluida en computadoras de escritorio, tablets y dispositivos móviles, logrando mejorar los tiempos lógicos internos de la organización en un plazo inmediato.'
                    : 'For this client, we developed a complete logical control ecosystem focused on resolving key bottlenecks. The system was adaptively designed to run smoothly on desktops, tablets, and mobile devices, improving the organization\'s internal workflows instantly.'}
                </p>
              </div>

              {/* Tech and Results */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-white/5">
                <div>
                  <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-2">{language === 'es' ? 'Tecnologías Utilizadas' : 'Technologies Used'}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tech.map((t, idx) => (
                      <span key={idx} className="rounded-lg bg-white/5 border border-white/5 px-2.5 py-1 font-mono text-[10px] text-brand-cyan uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-2">{language === 'es' ? 'Resultados Logrados' : 'Results Achieved'}</h4>
                  <ul className="space-y-1.5">
                    {resultsAchieved.map((res, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-xs text-slate-400">
                        <CheckCircle className="h-3.5 w-3.5 text-brand-cyan shrink-0" />
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  {language === 'es' ? 'Cerrar Detalles' : 'Close Details'}
                </button>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    onPageChange(ActivePage.Cotizacion);
                  }}
                  className="rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  {language === 'es' ? 'Cotizar Algo Similar' : 'Get Quote for Similar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
