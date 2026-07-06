/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  MessageSquareCode, 
  Cpu, 
  Workflow, 
  Database, 
  Network, 
  LineChart, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  Bot,
  Volume2,
  GitBranch
} from 'lucide-react';
import { ActivePage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface SolucionesIAViewProps {
  onPageChange: (page: ActivePage) => void;
}

export default function SolucionesIAView({ onPageChange }: SolucionesIAViewProps) {
  const { t, language } = useLanguage();

  const categories = [
    { 
      title: language === 'es' ? 'Chatbots WhatsApp' : 'WhatsApp Chatbots', 
      desc: language === 'es' 
        ? 'Atención automática interactiva conectada a ChatGPT, Claude o Gemini para dar respuestas contextuales, agendar citas y mostrar catálogos las 24 horas.' 
        : 'Interactive automatic support connected to ChatGPT, Claude, or Gemini to deliver contextual responses, schedule appointments, and display catalogs 24/7.', 
      icon: MessageSquareCode 
    },
    { 
      title: language === 'es' ? 'Agentes de IA' : 'AI Agents', 
      desc: language === 'es' 
        ? 'Sistemas inteligentes autónomos programados para realizar tareas repetitivas de análisis de datos, clasificación de correos y filtrado comercial.' 
        : 'Autonomous intelligent systems programmed to perform repetitive tasks such as data analysis, email sorting, and commercial filtering.', 
      icon: Bot 
    },
    { 
      title: language === 'es' ? 'Voz con IA' : 'AI Voice Solutions', 
      desc: language === 'es' 
        ? 'Sistemas conversacionales telefónicos con voces ultra-realistas o transcripción inteligente automática de audios de clientes.' 
        : 'Telephone conversational systems with ultra-realistic voices or automatic intelligent transcription of customer voice notes.', 
      icon: Volume2 
    },
    { 
      title: language === 'es' ? 'Automatización Avanzada' : 'Advanced Automation', 
      desc: language === 'es' 
        ? 'Sincronización total de sistemas heredados a través de pipelines de datos inteligentes y toma de decisiones automáticas.' 
        : 'Full synchronization of legacy systems through intelligent data pipelines and automatic decision-making.', 
      icon: Workflow 
    },
    { 
      title: language === 'es' ? 'Integración CRM' : 'CRM Integration', 
      desc: language === 'es' 
        ? 'Envía información recolectada por el chatbot directamente a tu sistema CRM de preferencia (HubSpot, Salesforce o a medida).' 
        : 'Send info collected by the chatbot directly to your CRM of choice (HubSpot, Salesforce, or custom).', 
      icon: GitBranch 
    },
    { 
      title: language === 'es' ? 'Bases de Conocimiento' : 'Knowledge Bases', 
      desc: language === 'es' 
        ? 'Entrenamos modelos LLM privados utilizando PDFs corporativos, manuales de marca o políticas internas para respuestas precisas.' 
        : 'We train private LLM models using corporate PDFs, brand manuals, or internal policies for precise responses.', 
      icon: Database 
    },
    { 
      title: language === 'es' ? 'Análisis Inteligente' : 'Intelligent Analytics', 
      desc: language === 'es' 
        ? 'Procesamiento de grandes volúmenes de texto para clasificar quejas, extraer palabras clave o predecir tendencias de comportamiento.' 
        : 'Processing of large volumes of text to classify complaints, extract keywords, or predict behavioral trends.', 
      icon: LineChart 
    },
    { 
      title: language === 'es' ? 'N8N / Make / Zapier' : 'N8N / Make / Zapier', 
      desc: language === 'es' 
        ? 'Flujos lógicos conectados sin código (No-Code/Low-Code) que reducen la carga laboral manual al mínimo.' 
        : 'Logical workflows connected with no-code/low-code tools that reduce manual workload to the absolute minimum.', 
      icon: Network 
    },
    { 
      title: 'OpenAI / Claude / Gemini', 
      desc: language === 'es' 
        ? 'Utilizamos los mejores y más modernos modelos de lenguaje global, optimizando el consumo de tokens y la latencia.' 
        : 'We utilize the best and most modern global language models, optimizing token consumption and latency.', 
      icon: Cpu 
    },
  ];

  const benefits = [
    { 
      title: language === 'es' ? 'Ahorro de Tiempo' : 'Time Savings', 
      desc: language === 'es' 
        ? 'Atención al instante en menos de 2 segundos, respondiendo consultas comunes de inmediato.' 
        : 'Instant support in under 2 seconds, answering common inquiries immediately.', 
      icon: Zap 
    },
    { 
      title: language === 'es' ? 'Reducción de Costos' : 'Cost Reduction', 
      desc: language === 'es' 
        ? 'Automatiza hasta el 80% de consultas recurrentes, disminuyendo gastos operativos de soporte.' 
        : 'Automate up to 80% of recurring queries, lowering support operating expenses.', 
      icon: Cpu 
    },
    { 
      title: language === 'es' ? 'Mayor Productividad' : 'Increased Productivity', 
      desc: language === 'es' 
        ? 'Libera a tu personal de soporte básico para que se enfoquen en negociaciones de alta prioridad.' 
        : 'Free your staff from basic support so they can focus on high-priority negotiations.', 
      icon: Bot 
    },
    { 
      title: language === 'es' ? 'Mayor Retención' : 'Better Retention', 
      desc: language === 'es' 
        ? 'El cliente recibe una atención precisa y cortés en cualquier horario, incluyendo fines de semana.' 
        : 'The customer receives accurate and polite attention at any hour, including weekends.', 
      icon: ShieldCheck 
    },
  ];

  return (
    <div id="soluciones-ia-view" className="bg-dark-deep pb-16 text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 -right-1/4 h-[400px] w-[400px] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none"></div>

      {/* Hero Banner */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <div className="inline-flex max-w-max items-center space-x-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-brand-cyan uppercase">
            <Brain className="h-3.5 w-3.5" />
            <span>{language === 'es' ? 'Inteligencia Artificial Práctica para Empresas' : 'Practical Artificial Intelligence for Businesses'}</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {language === 'es' ? 'Soluciones con ' : 'Solutions with '}<span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent text-glow-cyan">{language === 'es' ? 'Inteligencia Artificial' : 'Artificial Intelligence'}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
            {t('ia.subtitle', 'Integramos IA en tus canales de contacto y flujos internos para automatizar de inmediato.')}
          </p>
        </div>
      </section>

      {/* Grid of AI Services */}
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

      {/* Benefits section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-white/5 mt-12">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{language === 'es' ? 'Beneficios de implementar IA' : 'Benefits of Implementing AI'}</h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-500">
            {language === 'es'
              ? 'La automatización inteligente genera resultados de rentabilidad tangibles en el corto plazo.'
              : 'Intelligent automation generates tangible profitability results in the short term.'}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((ben, idx) => {
            const Icon = ben.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/30 text-center space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-cyan/5 text-brand-cyan">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-display text-base font-bold text-white">{ben.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{ben.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-brand-cyan/20 bg-gradient-to-r from-brand-cyan/10 to-brand-blue/10 p-8 text-center space-y-6">
          <h3 className="font-display text-xl font-bold text-white">{language === 'es' ? 'Transforma tu negocio con IA' : 'Transform Your Business with AI'}</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            {language === 'es'
              ? 'Hablemos sobre cómo un agente autónomo de IA o un chatbot de WhatsApp entrenado con tu base de conocimiento puede reducir la carga operativa de tu negocio de inmediato.'
              : 'Let\'s talk about how an autonomous AI agent or a WhatsApp chatbot trained with your knowledge base can reduce your business\'s operational workload immediately.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                onPageChange(ActivePage.Cotizacion);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue px-6 py-3 text-xs font-semibold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <span>{language === 'es' ? 'Cotizar Solución IA' : 'Quote AI Solution'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
