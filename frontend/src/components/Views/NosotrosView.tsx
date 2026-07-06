/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Target, 
  Compass, 
  Heart, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Lightbulb, 
  UsersRound,
  Building2,
  HeartPulse,
  HardHat,
  Truck,
  Leaf,
  Cpu,
  Handshake
} from 'lucide-react';
import { IMAGES } from '../../assets';
import { useLanguage } from '../../context/LanguageContext';
import { useCMS } from '../../context/CMSContext';

export default function NosotrosView() {
  const { t, language } = useLanguage();
  const { pageContents, teamMembers } = useCMS();
  const nosotrosContent = pageContents.nosotros;

  const team = teamMembers
    .filter((m) => m.status === 'active')
    .sort((a, b) => a.order - b.order)
    .map((m) => ({
      name: m.name,
      role: language === 'es' ? m.roleEs : m.roleEn,
      image: m.image,
      description: language === 'es' ? m.bioEs : m.bioEn,
    }));

  const values = [
    { 
      title: language === 'es' ? 'Responsabilidad' : 'Responsibility', 
      text: language === 'es' 
        ? 'Asumimos cada proyecto y reparación con máxima dedicación, cumpliendo siempre con los plazos acordados.' 
        : 'We take on every project and repair with maximum dedication, always meeting the agreed deadlines.', 
      icon: ShieldCheck 
    },
    { 
      title: language === 'es' ? 'Honestidad' : 'Honesty', 
      text: language === 'es' 
        ? 'Ofrecemos diagnósticos y presupuestos transparentes, cobrando lo justo y utilizando repuestos originales.' 
        : 'We offer transparent diagnostics and quotes, charging fairly and using original replacement parts.', 
      icon: Award 
    },
    { 
      title: language === 'es' ? 'Compromiso' : 'Commitment', 
      text: language === 'es' 
        ? 'Nos enfocamos en el crecimiento de nuestros clientes, convirtiéndonos en un socio estratégico de largo plazo.' 
        : 'We focus on our clients\' growth, becoming a long-term strategic partner.', 
      icon: Heart 
    },
    { 
      title: language === 'es' ? 'Innovación' : 'Innovation', 
      text: language === 'es' 
        ? 'Investigamos de manera continua las nuevas tendencias globales, integrando IA y tecnologías avanzadas.' 
        : 'We continuously research new global trends, integrating AI and advanced technologies.', 
      icon: Lightbulb 
    },
    { 
      title: language === 'es' ? 'Calidad' : 'Quality', 
      text: language === 'es' 
        ? 'Buscamos la excelencia técnica en cada desarrollo de software, auditoría de seguridad o reparación de placa.' 
        : 'We pursue technical excellence in every software development, security audit, or board repair.', 
      icon: CheckCircle2 
    },
    { 
      title: language === 'es' ? 'Trabajo en Equipo' : 'Teamwork', 
      text: language === 'es' 
        ? 'Fomentamos un ambiente de colaboración multidisciplinar para dar soporte completo a problemas complejos.' 
        : 'We foster a multidisciplinary collaboration environment to provide comprehensive support for complex problems.', 
      icon: UsersRound 
    },
  ];

  const stats = [
    { num: '+6', text: language === 'es' ? 'Años de Experiencia' : 'Years of Experience', label: language === 'es' ? 'Estabilidad' : 'Stability' },
    { num: '800+', label: language === 'es' ? 'Proyectos' : 'Projects', text: language === 'es' ? 'Completados con Éxito' : 'Successfully Completed' },
    { num: '500+', label: language === 'es' ? 'Clientes' : 'Clients', text: language === 'es' ? 'Empresas y Particulares' : 'Companies & Individuals' },
    { num: '24/7', label: language === 'es' ? 'Atención IT' : 'IT Support', text: language === 'es' ? 'Soporte y Respuesta' : 'Support & Response' }
  ];

  const clientsList = [
    { name: 'Banco Metropolitano', industry: 'Banca y Finanzas', icon: Building2, desc: 'Sistemas de alta disponibilidad, soporte de servidores y bases de datos críticas.' },
    { name: 'Clínica San Lucas', industry: 'Salud', icon: HeartPulse, desc: 'Instalación, cableado estructurado y soporte de hardware médico especializado.' },
    { name: 'Constructora del Oriente', industry: 'Industrial', icon: HardHat, desc: 'Automatización industrial y desarrollo de ERPs a medida.' },
    { name: 'Distribuidora del Sur', industry: 'Retail y Consumo', icon: Truck, desc: 'Desarrollo de su tienda online con pasarela de pagos integrada.' },
    { name: 'AgroTec LATAM', industry: 'Tecnología Agro', icon: Leaf, desc: 'Soluciones IoT y tableros inteligentes para monitoreo de cultivos.' },
    { name: 'IATech Soluciones', industry: 'Desarrollo de Software', icon: Cpu, desc: 'Co-desarrollo de productos de software en la nube e integraciones con IA.' },
  ];

  return (
    <div id="nosotros-view" className="bg-dark-deep pb-16 text-white relative overflow-hidden">
      <div className="absolute top-1/4 -right-1/4 h-[400px] w-[400px] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none"></div>

      {/* Hero Banner */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <div className="inline-flex max-w-max items-center space-x-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-brand-cyan uppercase">
            <Users className="h-3.5 w-3.5" />
            <span>{language === 'es' ? 'Nuestra Identidad' : 'Our Identity'}</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {language === 'es' ? nosotrosContent.titleEs : nosotrosContent.titleEn}
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
            {language === 'es' ? nosotrosContent.subtitleEs : nosotrosContent.subtitleEn}
          </p>
        </div>

        {/* Big Team banner image */}
        <div className="mt-12 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-dark-deep via-transparent to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
            alt="Global Service Team work session"
            referrerPolicy="no-referrer"
            className="w-full h-80 sm:h-96 object-cover brightness-75 hover:scale-[1.01] transition-transform duration-500"
          />
        </div>
      </section>

      {/* History and Numbers */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* History details */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {language === 'es' ? nosotrosContent.storyTitleEs : nosotrosContent.storyTitleEn}
            </h2>
            <div className="space-y-4 text-slate-400 text-sm leading-relaxed whitespace-pre-line">
              {language === 'es' ? nosotrosContent.storyTextEs : nosotrosContent.storyTextEn}
            </div>
          </div>

          {/* Numbers grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {stats.map((item, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/30 flex flex-col justify-center text-center">
                <span className="font-display text-3xl font-extrabold text-brand-cyan text-glow-cyan">{item.num}</span>
                <span className="text-white text-xs font-semibold mt-1">{item.label}</span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Mission Card */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-brand-cyan/5 to-transparent space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              {language === 'es' ? nosotrosContent.missionTitleEs : nosotrosContent.missionTitleEn}
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              {language === 'es' ? nosotrosContent.missionTextEs : nosotrosContent.missionTextEn}
            </p>
          </div>

          {/* Vision Card */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-brand-blue/5 to-transparent space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              {language === 'es' ? nosotrosContent.visionTitleEs : nosotrosContent.visionTitleEn}
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              {language === 'es' ? nosotrosContent.visionTextEs : nosotrosContent.visionTextEn}
            </p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{language === 'es' ? 'Nuestros Valores' : 'Our Values'}</h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-500">
            {language === 'es' 
              ? 'Los pilares éticos sobre los cuales construimos relaciones sólidas con nuestros clientes día a día.'
              : 'The ethical pillars on which we build solid relationships with our clients day by day.'}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/10 flex space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-cyan/5 text-brand-cyan border border-brand-cyan/10">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-bold text-white">{val.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{val.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Our Clients Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="text-center space-y-4">
          <div className="inline-flex max-w-max items-center space-x-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-brand-cyan uppercase">
            <Handshake className="h-3.5 w-3.5" />
            <span>Alianzas de Éxito</span>
          </div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Nuestros Clientes</h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-500">
            Tenemos el honor de colaborar con empresas e instituciones que lideran sus sectores, impulsando su transformación digital y garantizando su continuidad operativa.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clientsList.map((client, idx) => {
            const Icon = client.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/10 flex flex-col justify-between hover:border-brand-cyan/25 transition-all duration-300">
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
                    <h4 className="font-display text-sm font-bold text-white">{client.name}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1.5">{client.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{t('about.team', 'Nuestro Equipo')}</h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-500">
            {t('about.teamSubtitle', 'Ingenieros y técnicos apasionados por la excelencia en cada línea de código y cada soldadura.')}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.name} className="glass-panel group rounded-2xl border border-white/5 bg-slate-900/30 overflow-hidden hover:border-brand-cyan/30 transition-all duration-300">
              <div className="relative overflow-hidden h-64">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-navy to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h4 className="text-sm font-bold text-white">{member.name}</h4>
                  <span className="text-[10px] font-mono tracking-wider text-brand-cyan uppercase">{member.role}</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-xs text-slate-400 leading-relaxed">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
