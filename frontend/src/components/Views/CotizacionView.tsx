/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  MessageSquare, 
  Sparkles, 
  DollarSign 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function CotizacionView() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    serviceType: 'desarrollo-software',
    projectScope: 'web-app', // web-app, mobile-app, chatbot, maintenance, landing
    timeline: '1-3-meses', // <1-mes, 1-3-meses, 3-6-meses
    features: [] as string[]
  });
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValidationError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleFeature = (feature: string) => {
    const current = [...formData.features];
    const idx = current.indexOf(feature);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(feature);
    }
    setFormData({
      ...formData,
      features: current
    });
  };

  // Cost calculation engine
  useEffect(() => {
    let base = 0;
    
    // Core Service base cost
    if (formData.serviceType === 'desarrollo-software') {
      if (formData.projectScope === 'web-app') base = 900;
      else if (formData.projectScope === 'mobile-app') base = 1400;
      else if (formData.projectScope === 'landing') base = 400;
      else base = 800;
    } else if (formData.serviceType === 'ia') {
      base = 600; // Base AI integration
    } else if (formData.serviceType === 'servicio-tecnico') {
      base = 60; // Repair baseline
    } else if (formData.serviceType === 'seguridad') {
      base = 450;
    } else {
      base = 250; // IT Support start
    }

    // Addons cost
    formData.features.forEach(feature => {
      if (feature === 'auth') base += 150;
      if (feature === 'payments') base += 250;
      if (feature === 'database') base += 200;
      if (feature === 'ai-agent') base += 350;
      if (feature === 'admin-panel') base += 200;
      if (feature === 'realtime') base += 180;
    });

    // Timeline modifier
    if (formData.timeline === '<1-mes') {
      base *= 1.15; // Urgent rush fee
    } else if (formData.timeline === '3-6-meses') {
      base *= 0.95; // Longer scope discount
    }

    setEstimatedCost(Math.round(base));
  }, [formData]);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        setValidationError(language === 'es' ? 'Por favor completa los campos obligatorios (*).' : 'Please fill in the required fields (*).');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCompleted(true);
  };

  const buildWhatsAppLink = () => {
    const serviceLabel = formData.serviceType === 'desarrollo-software' ? 'Desarrollo de Software' :
                         formData.serviceType === 'ia' ? 'Soluciones con Inteligencia Artificial' :
                         formData.serviceType === 'servicio-tecnico' ? 'Servicio Técnico' : 'Soporte IT';
    const featureLabels = formData.features.join(', ');
    const text = `Hola Global Service, acabo de usar su Cotizador Online. Deseo cotizar un proyecto de: *${serviceLabel}* (${formData.projectScope}).\n\n*Detalles:*\n- Cliente: ${formData.name}\n- Empresa: ${formData.company || 'Particular'}\n- Teléfono: ${formData.phone}\n- Tiempo esperado: ${formData.timeline}\n- Módulos adicionales: ${featureLabels || 'Ninguno'}\n- Presupuesto Estimado: *$${estimatedCost} USD*\n\n¿Podemos agendar una breve videollamada para definir el alcance?`;
    return `https://wa.me/59178459001?text=${encodeURIComponent(text)}`;
  };

  return (
    <div id="cotizacion-view" className="bg-dark-deep pb-16 text-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 -left-1/4 h-[400px] w-[400px] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none"></div>

      {/* Header section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-6 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <div className="inline-flex max-w-max items-center space-x-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-brand-cyan uppercase">
            <Calculator className="h-3.5 w-3.5" />
            <span>{language === 'es' ? 'Cotizador de Presupuesto Digital' : 'Digital Budget Estimator'}</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {language === 'es' ? 'Cotiza tu ' : 'Quote Your '}<span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent text-glow-cyan">{language === 'es' ? 'Proyecto' : 'Project'}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
            {t('quote.subtitle', 'Estima instantáneamente el presupuesto aproximado para tu desarrollo o reparación y contacta directamente a nuestros asesores.')}
          </p>
        </div>
      </section>

      {/* Step Indicators */}
      <section className="mx-auto max-w-xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs text-slate-500">
          <div className={`flex items-center space-x-1.5 ${step >= 1 ? 'text-brand-cyan' : ''}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${step >= 1 ? 'border-brand-cyan bg-brand-cyan/10' : 'border-slate-700'}`}>1</span>
            <span>{language === 'es' ? 'Contacto' : 'Contact'}</span>
          </div>
          <div className="flex-1 border-t border-slate-800 mx-3"></div>
          <div className={`flex items-center space-x-1.5 ${step >= 2 ? 'text-brand-cyan' : ''}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${step >= 2 ? 'border-brand-cyan bg-brand-cyan/10' : 'border-slate-700'}`}>2</span>
            <span>{language === 'es' ? 'Proyecto' : 'Project'}</span>
          </div>
          <div className="flex-1 border-t border-slate-800 mx-3"></div>
          <div className={`flex items-center space-x-1.5 ${step >= 3 ? 'text-brand-cyan' : ''}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${step >= 3 ? 'border-brand-cyan bg-brand-cyan/10' : 'border-slate-700'}`}>3</span>
            <span>{language === 'es' ? 'Resumen' : 'Summary'}</span>
          </div>
        </div>
      </section>

      {/* Main Wizard Card */}
      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/30">
          {isCompleted ? (
            <div className="text-center py-10 space-y-5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan shadow-lg">
                <CheckCircle className="h-8 w-8 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold text-white">{language === 'es' ? '¡Cotización Estructurada con Éxito!' : 'Quote Structured Successfully!'}</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                  {language === 'es' ? 'Hemos generado tu estimación preliminar de presupuesto de:' : 'We have generated your preliminary budget estimate of:'}
                </p>
                <div className="inline-flex items-center justify-center space-x-1 rounded-2xl bg-brand-cyan/10 px-6 py-3 border border-brand-cyan/20 mt-2">
                  <DollarSign className="h-6 w-6 text-brand-cyan" />
                  <span className="font-display text-3xl font-extrabold text-white text-glow-cyan">{estimatedCost}</span>
                  <span className="text-slate-400 font-bold text-sm">USD</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed pt-2">
                {language === 'es' 
                  ? 'Para consolidar esta estimación, refinar los requerimientos técnicos y agendar una llamada con nuestros ingenieros de forma gratuita, presiona el botón de abajo.'
                  : 'To finalize this estimate, refine technical requirements, and schedule a call with our engineers for free, click the button below.'}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setIsCompleted(false);
                    setStep(1);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  {language === 'es' ? 'Recalcular Proyecto' : 'Recalculate Project'}
                </button>
                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 rounded-xl bg-green-600 hover:bg-green-500 px-6 py-3 text-xs font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                  <span>{language === 'es' ? 'Enviar Cotización por WhatsApp' : 'Send Quote via WhatsApp'}</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFinish} className="space-y-6">
              
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-3 duration-200">
                  <h3 className="font-display text-base font-bold text-white border-b border-white/5 pb-2">{language === 'es' ? 'Información Básica del Solicitante' : 'Basic Contact Information'}</h3>
                  
                  {validationError && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                      {validationError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="basic-name" className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{language === 'es' ? 'Nombre Completo *' : 'Full Name *'}</label>
                      <input
                        id="basic-name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={language === 'es' ? 'Ej. Enrique Castro' : 'e.g. Enrique Castro'}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 outline-none focus:border-brand-cyan/40 focus:ring-1 focus:ring-brand-cyan/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="basic-company" className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{language === 'es' ? 'Empresa / Institución' : 'Company / Institution'}</label>
                      <input
                        id="basic-company"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder={language === 'es' ? 'Ej. IA Tech S.R.L. (Opcional)' : 'e.g. IA Tech S.R.L. (Optional)'}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 outline-none focus:border-brand-cyan/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="basic-email" className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{language === 'es' ? 'Correo Electrónico *' : 'Email Address *'}</label>
                      <input
                        id="basic-email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="enrique@iatech.bo"
                        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 outline-none focus:border-brand-cyan/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="basic-phone" className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{language === 'es' ? 'Teléfono o WhatsApp *' : 'Phone or WhatsApp *'}</label>
                      <input
                        id="basic-phone"
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+591 78459001"
                        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 outline-none focus:border-brand-cyan/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="basic-service-type" className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{language === 'es' ? 'Tipo de Servicio Principal' : 'Primary Service Type'}</label>
                    <select
                      id="basic-service-type"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-brand-cyan/40"
                    >
                      <option value="desarrollo-software">{language === 'es' ? 'Desarrollo de Software a Medida' : 'Custom Software Development'}</option>
                      <option value="ia">{language === 'es' ? 'Soluciones con Inteligencia Artificial' : 'Artificial Intelligence Solutions'}</option>
                      <option value="servicio-tecnico">{language === 'es' ? 'Servicio Técnico Especializado' : 'Specialized Technical Service'}</option>
                      <option value="seguridad">{language === 'es' ? 'Ciberseguridad y Auditorías' : 'Cybersecurity and Audits'}</option>
                      <option value="soporte">{language === 'es' ? 'Soporte Corporativo / Outsourcing IT' : 'Corporate Support / IT Outsourcing'}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Project Scope */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-200">
                  <h3 className="font-display text-base font-bold text-white border-b border-white/5 pb-2">{language === 'es' ? 'Detalles del Requerimiento' : 'Requirement Details'}</h3>
                  
                  {formData.serviceType === 'desarrollo-software' && (
                    <div className="space-y-1.5">
                      <label htmlFor="project-scope-select" className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{language === 'es' ? 'Alcance del Software' : 'Software Scope'}</label>
                      <select
                        id="project-scope-select"
                        name="projectScope"
                        value={formData.projectScope}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-brand-cyan/40"
                      >
                        <option value="web-app">{language === 'es' ? 'Aplicación Web Interactiva ($900+)' : 'Interactive Web Application ($900+)'}</option>
                        <option value="mobile-app">{language === 'es' ? 'Aplicación Móvil Android/iOS ($1400+)' : 'Android/iOS Mobile Application ($1400+)'}</option>
                        <option value="landing">{language === 'es' ? 'Sitio Web / Landing Page Corporativa ($400+)' : 'Corporate Website / Landing Page ($400+)'}</option>
                        <option value="erp-crm">{language === 'es' ? 'Sistema ERP o CRM Completo ($1200+)' : 'Complete ERP or CRM System ($1200+)'}</option>
                      </select>
                    </div>
                  )}

                  {formData.serviceType === 'ia' && (
                    <div className="space-y-1.5">
                      <label htmlFor="ia-scope-select" className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{language === 'es' ? 'Solución de Inteligencia Artificial' : 'Artificial Intelligence Solution'}</label>
                      <select
                        id="ia-scope-select"
                        name="projectScope"
                        value={formData.projectScope}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-brand-cyan/40"
                      >
                        <option value="chatbot">{language === 'es' ? 'Chatbot Inteligente de WhatsApp ($600+)' : 'Intelligent WhatsApp Chatbot ($600+)'}</option>
                        <option value="voice-agent">{language === 'es' ? 'Agente de Voz / Telefonía con IA ($900+)' : 'AI Voice / Telephone Agent ($900+)'}</option>
                        <option value="kb">{language === 'es' ? 'Base de conocimiento de consulta interna ($500+)' : 'Internal Consultation Knowledge Base ($500+)'}</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label htmlFor="timeline-select" className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{language === 'es' ? 'Tiempo Estimado de Entrega' : 'Estimated Delivery Time'}</label>
                    <select
                      id="timeline-select"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-brand-cyan/40"
                    >
                      <option value="<1-mes">{language === 'es' ? 'Urgente (menos de 1 mes) [+15% Costo]' : 'Urgent (less than 1 month) [+15% Cost]'}</option>
                      <option value="1-3-meses">{language === 'es' ? 'Estándar (1 a 3 meses) [Costo Regular]' : 'Standard (1 to 3 months) [Regular Cost]'}</option>
                      <option value="3-6-meses">{language === 'es' ? 'Largo Alcance (3 a 6 meses) [5% Descuento]' : 'Long Range (3 to 6 months) [5% Discount]'}</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{language === 'es' ? 'Módulos o Requerimientos Especiales (Addons)' : 'Special Modules or Requirements (Addons)'}</span>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {[
                        { id: 'auth', label_es: 'Registro e Inicio de Sesión de usuarios (+$150)', label_en: 'User Registration & Login (+$150)' },
                        { id: 'payments', label_es: 'Pasarela de Pagos (QR, Tarjetas) (+$250)', label_en: 'Payment Gateway (QR, Cards) (+$250)' },
                        { id: 'database', label_es: 'Base de datos transaccional PostgreSQL (+$200)', label_en: 'Transactional PostgreSQL Database (+$200)' },
                        { id: 'ai-agent', label_es: 'Agente IA consultor de datos integrado (+$350)', label_en: 'Integrated Data Consultant AI Agent (+$350)' },
                        { id: 'admin-panel', label_es: 'Panel administrativo de reportes en PDF (+$200)', label_en: 'Administrative Panel with PDF Reports (+$200)' },
                        { id: 'realtime', label_es: 'Sincronización de datos en tiempo real (+$180)', label_en: 'Real-time Data Synchronization (+$180)' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleFeature(item.id)}
                          className={`flex items-center text-left rounded-xl border p-3 text-xs transition-all cursor-pointer ${
                            formData.features.includes(item.id)
                              ? 'bg-brand-cyan/15 border-brand-cyan text-white shadow-md'
                              : 'bg-slate-950/20 border-white/5 text-slate-400 hover:bg-slate-950/40 hover:text-white'
                          }`}
                        >
                          <div className={`mr-2.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${formData.features.includes(item.id) ? 'border-brand-cyan bg-brand-cyan text-slate-950' : 'border-slate-700'}`}>
                            {formData.features.includes(item.id) && '✓'}
                          </div>
                          <span>{language === 'es' ? item.label_es : item.label_en}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Summary and Calc */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-200">
                  <h3 className="font-display text-base font-bold text-white border-b border-white/5 pb-2">{language === 'es' ? 'Estimación de Presupuesto' : 'Budget Estimate'}</h3>
                  
                  <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{language === 'es' ? 'Tipo de Servicio:' : 'Service Type:'}</span>
                      <span className="text-xs font-semibold text-white uppercase font-mono tracking-wide">{formData.serviceType}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-2">
                      <span className="text-xs text-slate-400">{language === 'es' ? 'Alcance de Proyecto:' : 'Project Scope:'}</span>
                      <span className="text-xs font-semibold text-white uppercase font-mono tracking-wide">{formData.projectScope}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-2">
                      <span className="text-xs text-slate-400">{language === 'es' ? 'Plazo Esperado:' : 'Expected Timeline:'}</span>
                      <span className="text-xs font-semibold text-white uppercase font-mono tracking-wide">{formData.timeline}</span>
                    </div>
                    <div className="border-t border-white/5 pt-2 space-y-1">
                      <span className="text-xs text-slate-400">{language === 'es' ? 'Módulos seleccionados:' : 'Selected Modules:'}</span>
                      <div className="flex flex-wrap gap-1">
                        {formData.features.length === 0 ? (
                          <span className="text-[10px] text-slate-500 italic">{language === 'es' ? 'Ninguno' : 'None'}</span>
                        ) : (
                          formData.features.map(f => (
                            <span key={f} className="rounded bg-white/5 border border-white/5 px-2 py-0.5 font-mono text-[9px] text-brand-cyan uppercase">
                              {f}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Calculated Price Showcase */}
                  <div className="text-center bg-gradient-to-br from-brand-cyan/10 to-brand-blue/5 border border-brand-cyan/20 rounded-2xl py-6 space-y-2 shadow-lg shadow-brand-cyan/5">
                    <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{language === 'es' ? 'Presupuesto preliminar estimado' : 'Estimated preliminary budget'}</span>
                    <div className="flex items-center justify-center space-x-1">
                      <DollarSign className="h-6 w-6 text-brand-cyan" />
                      <span className="font-display text-4xl font-extrabold text-white text-glow-cyan">{estimatedCost}</span>
                      <span className="text-slate-400 font-bold text-sm">USD</span>
                    </div>
                    <p className="text-[9px] sm:text-xs text-slate-500 italic px-4 max-w-lg mx-auto">
                      {language === 'es' 
                        ? '* Estimación de costo basada en requerimientos lógicos modulares de desarrollo. Los valores finales se definirán en un alcance técnico detallado.'
                        : '* Cost estimation based on logical modular development requirements. Final values will be defined in a detailed technical scope.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center space-x-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>{language === 'es' ? 'Atrás' : 'Back'}</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:brightness-110 active:scale-95 cursor-pointer"
                  >
                    <span>{language === 'es' ? 'Siguiente' : 'Next'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 cursor-pointer"
                  >
                    <span>{language === 'es' ? 'Guardar y Estructurar' : 'Save and Structure'}</span>
                    <Sparkles className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
