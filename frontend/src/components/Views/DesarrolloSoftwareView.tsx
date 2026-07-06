/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Code, 
  Layers, 
  Database, 
  TrendingUp, 
  Cloud,
  ArrowRight,
  MonitorPlay,
  Briefcase
} from 'lucide-react';
import { ActivePage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface DesarrolloSoftwareViewProps {
  onPageChange: (page: ActivePage) => void;
}

export default function DesarrolloSoftwareView({ onPageChange }: DesarrolloSoftwareViewProps) {
  const { t, language } = useLanguage();

  const categories = [
    { 
      title: language === 'es' ? 'Sistemas ERP' : 'ERP Systems', 
      desc: language === 'es' 
        ? 'Sistemas completos para controlar compras, ventas, nóminas, activos fijos e informes gerenciales unificados.' 
        : 'Comprehensive systems to control purchases, sales, payroll, fixed assets, and unified management reports.', 
      icon: Layers 
    },
    { 
      title: language === 'es' ? 'Sistemas CRM' : 'CRM Systems', 
      desc: language === 'es' 
        ? 'Organiza tus leads, automatiza campañas de ventas y fideliza clientes con un historial detallado de interacciones.' 
        : 'Organize your leads, automate sales campaigns, and build customer loyalty with detailed interaction history.', 
      icon: TrendingUp 
    },
    { 
      title: language === 'es' ? 'Sistemas de Ventas' : 'POS & Sales Systems', 
      desc: language === 'es' 
        ? 'Facturación ágil, emisión de recibos en PDF, cotizaciones automáticas, reportes de cajas chicas y ventas diarias.' 
        : 'Agile invoicing, PDF receipts, automatic quotes, petty cash reports, and daily sales tracking.', 
      icon: MonitorPlay 
    },
    { 
      title: language === 'es' ? 'Control de Inventarios' : 'Inventory Management', 
      desc: language === 'es' 
        ? 'Gestión multialmacén, control de mermas, alertas de stock mínimo y trazabilidad de productos con códigos de barra.' 
        : 'Multi-warehouse management, shrinkage control, low-stock alerts, and product traceability with barcodes.', 
      icon: Database 
    },
    { 
      title: language === 'es' ? 'Sistemas de Contabilidad' : 'Accounting Systems', 
      desc: language === 'es' 
        ? 'Asientos contables automatizados, generación de estados de resultados y balances generales sin errores.' 
        : 'Automated journal entries, and error-free generation of income statements and general balance sheets.', 
      icon: Briefcase 
    },
    { 
      title: language === 'es' ? 'Sistemas para Hoteles' : 'Hotel Management Systems', 
      desc: language === 'es' 
        ? 'Control de reservas visuales (Gantt), check-in y check-out rápido, cobro de extras y estadísticas de ocupación.' 
        : 'Visual booking calendar (Gantt chart), fast check-in and check-out, billing for extras, and occupancy stats.', 
      icon: Cloud 
    },
  ];

  const steps = [
    { 
      title: language === 'es' ? '1. Análisis' : '1. Analysis', 
      desc: language === 'es' 
        ? 'Documentamos tus requerimientos y modelamos los flujos lógicos de trabajo.' 
        : 'We document your requirements and model logical workflows.' 
    },
    { 
      title: language === 'es' ? '2. Diseño' : '2. Design', 
      desc: language === 'es' 
        ? 'Modelamos las interfaces de usuario (UI/UX) para validar la experiencia antes del código.' 
        : 'We model user interfaces (UI/UX) to validate the experience before writing code.' 
    },
    { 
      title: language === 'es' ? '3. Desarrollo' : '3. Development', 
      desc: language === 'es' 
        ? 'Escribimos código ágil, modular y documentado con las mejores prácticas del mercado.' 
        : 'We write agile, modular, and documented code following the best industry practices.' 
    },
    { 
      title: language === 'es' ? '4. Pruebas' : '4. Testing', 
      desc: language === 'es' 
        ? 'Sometemos el software a pruebas de estrés, seguridad y compatibilidad en múltiples dispositivos.' 
        : 'We subject the software to stress, security, and compatibility tests across multiple devices.' 
    },
    { 
      title: language === 'es' ? '5. Lanzamiento' : '5. Launch', 
      desc: language === 'es' 
        ? 'Desplegamos en servidores cloud seguros y capacitamos exhaustivamente a tu personal.' 
        : 'We deploy to secure cloud servers and comprehensively train your staff.' 
    },
  ];

  const techStack = [
    { name: 'React.js', category: 'Frontend', desc: language === 'es' ? 'Interfaces ultrarrápidas' : 'Ultra-fast interfaces' },
    { name: 'Node.js', category: 'Backend', desc: language === 'es' ? 'Lógica escalable' : 'Scalable server logic' },
    { name: 'Laravel', category: 'Backend', desc: language === 'es' ? 'Estructuras robustas' : 'Robust structures' },
    { name: 'Python', category: 'Backend/IA', desc: language === 'es' ? 'Procesamiento e IA' : 'Processing & AI' },
    { name: 'PostgreSQL', category: 'Database', desc: language === 'es' ? 'Bases transaccionales' : 'Secure transactions' },
    { name: 'MySQL', category: 'Database', desc: language === 'es' ? 'Sistemas relacionales' : 'Stable relational' },
    { name: 'Firebase', category: 'Serverless', desc: language === 'es' ? 'Tiempo real' : 'Real-time sync' },
  ];

  return (
    <div id="desarrollo-software-view" className="bg-dark-deep pb-16 text-white relative overflow-hidden">
      <div className="absolute top-1/4 -left-1/4 h-[400px] w-[400px] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none"></div>

      {/* Hero Banner */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <div className="inline-flex max-w-max items-center space-x-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-brand-cyan uppercase">
            <Code className="h-3.5 w-3.5" />
            <span>{language === 'es' ? 'Ingeniería de Software de Vanguardia' : 'State-of-the-art Software Engineering'}</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {language === 'es' ? 'Desarrollo de ' : 'Custom '}<span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent text-glow-cyan">{language === 'es' ? 'Software a Medida' : 'Software Development'}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
            {t('software.subtitle', 'Diseñamos e implementamos sistemas web escalables y aplicaciones móviles robustas.')}
          </p>
        </div>
      </section>

      {/* Systems grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/10 hover:border-brand-cyan/20 transition-all flex flex-col space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-cyan/5 text-brand-cyan border border-brand-cyan/10">
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="font-display text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed flex-grow">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Development Process */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-white/5 mt-12">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{language === 'es' ? 'Nuestro Proceso de Desarrollo' : 'Our Development Process'}</h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-500">
            {language === 'es'
              ? 'Un marco ágil de 5 etapas para asegurar la máxima calidad de entrega desde el análisis hasta la puesta en marcha.'
              : 'An agile 5-stage framework to ensure maximum delivery quality from analysis to deployment.'}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-5 text-left">
          {steps.map((step, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/30">
              <h4 className="font-display text-sm font-bold text-brand-cyan mb-1.5">{step.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-white/5 mt-12">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{language === 'es' ? 'Tecnologías que utilizamos' : 'Technologies We Use'}</h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-500">
            {language === 'es'
              ? 'Seleccionamos y utilizamos herramientas de desarrollo modernas, sólidas y ampliamente adoptadas a nivel global.'
              : 'We select and utilize modern, robust, and globally adopted development tools.'}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7 text-center">
          {techStack.map((tech, idx) => (
            <div key={idx} className="glass-panel p-4 rounded-xl border border-white/5 bg-slate-900/10 flex flex-col items-center justify-center space-y-1">
              <span className="text-xs font-semibold text-white">{tech.name}</span>
              <span className="font-mono text-[9px] text-brand-cyan tracking-wider uppercase">{tech.category}</span>
              <span className="text-[9px] text-slate-500">{tech.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Banner */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-brand-cyan/20 bg-gradient-to-r from-brand-cyan/10 to-brand-blue/10 p-8 text-center space-y-6">
          <h3 className="font-display text-xl font-bold text-white">{language === 'es' ? '¿Tienes una idea o flujo de negocio que automatizar?' : 'Have an idea or business flow to automate?'}</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            {language === 'es'
              ? 'Hablemos sobre tus necesidades de software. Nuestro equipo de ingenieros estructurará una propuesta de arquitectura técnica robusta junto con un presupuesto modular adaptado.'
              : 'Let\'s talk about your software needs. Our engineering team will outline a robust technical architecture proposal along with a customized modular budget.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                onPageChange(ActivePage.Cotizacion);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue px-6 py-3 text-xs font-semibold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <span>{language === 'es' ? 'Estructurar Mi Proyecto' : 'Structure My Project'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
