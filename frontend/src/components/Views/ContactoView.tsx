/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle, 
  Facebook, 
  Linkedin, 
  Github, 
  Map 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCMS } from '../../context/CMSContext';

const branches = [
  {
    id: 'equipetrol',
    nameEs: 'Casa Matriz - Equipetrol',
    nameEn: 'Main Office - Equipetrol',
    addressEs: 'Barrio Equipetrol, Calle 8 Este #15, Santa Cruz de la Sierra, Bolivia',
    addressEn: 'Barrio Equipetrol, Calle 8 Este #15, Santa Cruz de la Sierra, Bolivia',
    descEs: 'Oficinas centrales de ingeniería, laboratorio microelectrónico avanzado y atención al cliente corporativo.',
    descEn: 'Headquarters, advanced microelectronics laboratory, and corporate customer support.',
    iframeSrc: 'https://maps.google.com/maps?q=Barrio%20Equipetrol,%20Calle%208%20Este%20%2315,%20Santa%20Cruz%20de%20la%20Sierra,%20Bolivia&t=&z=16&ie=UTF8&iwloc=&output=embed',
    mapLink: 'https://maps.google.com/maps?q=Barrio+Equipetrol,+Calle+8+Este+%2315,+Santa+Cruz+de+la+Sierra,+Bolivia'
  },
  {
    id: 'norte',
    nameEs: 'Sucursal Norte (Montero)',
    nameEn: 'Northern Branch (Montero)',
    addressEs: 'Carretera al Norte, Montero, Santa Cruz, Bolivia',
    addressEn: 'Northern Highway, Montero, Santa Cruz, Bolivia',
    descEs: 'Laboratorio de servicio técnico, mantenimiento express y soporte especializado para clientes de la zona norte y provincias.',
    descEn: 'Technical service laboratory, express maintenance, and specialized support for northern zone and provinces.',
    iframeSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243445.61364748166!2d-63.37399599592875!3d-17.562911605777092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93ee3f6c8233ce45%3A0xab45d0f4dad6c768!2sGLOBAL%20SERVICE!5e0!3m2!1ses-419!2sbo!4v1783297314059!5m2!1ses-419!2sbo',
    mapLink: 'https://www.google.com/maps?q=-17.341899070602274,-63.253601776119666'
  },
  {
    id: 'chiriguano',
    nameEs: 'Sucursal C.C. Chiriguano',
    nameEn: 'Chiriguano Shopping Center Branch',
    addressEs: 'Centro Comercial Chiriguano, Santa Cruz de la Sierra, Bolivia',
    addressEn: 'Chiriguano Shopping Center, Santa Cruz de la Sierra, Bolivia',
    descEs: 'Punto de atención express en el centro comercial tecnológico más grande de la ciudad. Recepción de equipos, venta de repuestos y soporte rápido.',
    descEn: 'Express support branch in the city\'s largest tech shopping center. Device reception, spare parts, and fast turnaround hardware repair.',
    iframeSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5372.648731643376!2d-63.21008396625709!3d-17.789988621356105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93f1c2a7b7d71569%3A0x1dce2be104dfb72e!2sCentro%20Comercial%20Chiriguano!5e0!3m2!1ses-419!2sbo!4v1783297435991!5m2!1ses-419!2sbo',
    mapLink: 'https://www.google.com/maps?q=-17.79009697638171,-63.20577487257182'
  }
];

interface ContactoViewProps {
  theme?: 'light' | 'dark';
}

export default function ContactoView({ theme = 'dark' }: ContactoViewProps) {
  const { t, language } = useLanguage();
  const { pageContents, submitMessage } = useCMS();
  const contactContent = pageContents.contacto;
  const [activeBranchId, setActiveBranchId] = useState('equipetrol');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'servicio-tecnico',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await submitMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.service,
        message: formData.message,
        serviceRequested: formData.service,
      });
      setIsSubmitted(true);
    } catch {
      setSubmitError(language === 'es' ? 'Error al enviar el mensaje. Intenta nuevamente.' : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contacto-view" className={`${theme === 'dark' ? 'bg-dark-deep text-white' : 'bg-slate-50 text-slate-800'} pb-16 relative overflow-hidden transition-colors duration-300`}>
      {/* Background Glows */}
      <div className={`absolute top-1/4 -left-1/4 h-[400px] w-[400px] rounded-full ${theme === 'dark' ? 'bg-brand-cyan/5' : 'bg-brand-blue/5'} blur-[120px] pointer-events-none`}></div>

      {/* Header section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <div className={`inline-flex max-w-max items-center space-x-2 rounded-full border ${theme === 'dark' ? 'border-brand-cyan/20 bg-brand-cyan/5 text-brand-cyan' : 'border-brand-blue/20 bg-brand-blue/5 text-brand-blue'} px-4 py-1.5 text-xs font-semibold tracking-wider uppercase`}>
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{language === 'es' ? 'Soporte Inmediato' : 'Immediate Support'}</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {language === 'es' ? 'Contáctanos ' : 'Contact '}<span className={`bg-gradient-to-r ${theme === 'dark' ? 'from-brand-cyan to-brand-blue' : 'from-brand-blue to-brand-indigo'} bg-clip-text text-transparent ${theme === 'dark' ? 'text-glow-cyan' : ''}`}>{language === 'es' ? 'Directamente' : 'Us Directly'}</span>
          </h1>
          <p className={`mx-auto max-w-2xl text-sm sm:text-base ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {t('contact.subtitle', 'Estamos listos para atenderte en nuestro laboratorio o de forma remota.')}
          </p>
        </div>
      </section>

      {/* Contact Grid: Details + Form */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          {/* Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`glass-panel p-6 rounded-2xl border ${theme === 'dark' ? 'border-white/5 bg-slate-900/10' : 'border-slate-200 bg-white shadow-sm'} space-y-6`}>
              <h3 className={`font-display text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('contact.info.title', 'Información de Contacto')}</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                {language === 'es' 
                  ? 'Nuestros ingenieros y coordinadores técnicos están listos para agendar revisiones o armar alcances lógicos para tus proyectos.'
                  : 'Our engineers and technical coordinators are ready to schedule reviews or build logical scopes for your projects.'}
              </p>
              
              <div className="space-y-4.5">
                {/* Phone */}
                <div className="flex items-start space-x-3.5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme === 'dark' ? 'bg-brand-cyan/5 border-brand-cyan/15 text-brand-cyan' : 'bg-brand-blue/5 border-brand-blue/15 text-brand-blue'}`}>
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-500 font-mono uppercase">{language === 'es' ? 'WhatsApp / Teléfono' : 'WhatsApp / Phone'}</h4>
                    <a href={`https://wa.me/${contactContent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className={`text-sm font-semibold ${theme === 'dark' ? 'text-white hover:text-brand-cyan' : 'text-slate-800 hover:text-brand-blue'} transition-colors`}>
                      {contactContent.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3.5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme === 'dark' ? 'bg-brand-cyan/5 border-brand-cyan/15 text-brand-cyan' : 'bg-brand-blue/5 border-brand-blue/15 text-brand-blue'}`}>
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-500 font-mono uppercase">{language === 'es' ? 'Correo Corporativo' : 'Corporate Email'}</h4>
                    <a href={`mailto:${contactContent.email}`} className={`text-sm font-semibold ${theme === 'dark' ? 'text-white hover:text-brand-cyan' : 'text-slate-800 hover:text-brand-blue'} transition-colors`}>
                      {contactContent.email}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-3.5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme === 'dark' ? 'bg-brand-cyan/5 border-brand-cyan/15 text-brand-cyan' : 'bg-brand-blue/5 border-brand-blue/15 text-brand-blue'}`}>
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-500 font-mono uppercase">{t('contact.info.address', 'Dirección')}</h4>
                    <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} leading-relaxed`}>
                      {language === 'es' ? contactContent.addressEs : contactContent.addressEn}
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-3.5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme === 'dark' ? 'bg-brand-cyan/5 border-brand-cyan/15 text-brand-cyan' : 'bg-brand-blue/5 border-brand-blue/15 text-brand-blue'}`}>
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-500 font-mono uppercase">{t('contact.info.hours', 'Horario de Atención')}</h4>
                    <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} leading-relaxed`}>
                      {t('contact.info.hoursText', 'Lunes a Viernes: 08:30 - 18:30 | Sábados: 09:00 - 13:00')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className={`pt-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
                <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-700'} uppercase tracking-wider mb-3`}>{language === 'es' ? 'Síguenos en Redes' : 'Follow Us'}</h4>
                <div className="flex space-x-3">
                  <a href="#" className={`flex h-9 w-9 items-center justify-center rounded-lg ${theme === 'dark' ? 'bg-white/5 text-slate-400 hover:text-brand-cyan hover:bg-brand-cyan/10 border-white/5' : 'bg-slate-100 text-slate-600 hover:text-brand-blue hover:bg-brand-blue/10 border-slate-200'} border transition-all`}>
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={`flex h-9 w-9 items-center justify-center rounded-lg ${theme === 'dark' ? 'bg-white/5 text-slate-400 hover:text-brand-cyan hover:bg-brand-cyan/10 border-white/5' : 'bg-slate-100 text-slate-600 hover:text-brand-blue hover:bg-brand-blue/10 border-slate-200'} border transition-all`}>
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className={`flex h-9 w-9 items-center justify-center rounded-lg ${theme === 'dark' ? 'bg-white/5 text-slate-400 hover:text-brand-cyan hover:bg-brand-cyan/10 border-white/5' : 'bg-slate-100 text-slate-600 hover:text-brand-blue hover:bg-brand-blue/10 border-slate-200'} border transition-all`}>
                    <Github className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className={`glass-panel p-6 sm:p-8 rounded-2xl border ${theme === 'dark' ? 'border-white/5 bg-slate-900/30' : 'border-slate-200 bg-white shadow-sm'}`}>
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${theme === 'dark' ? 'bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan' : 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue'} shadow-lg`}>
                    <CheckCircle className="h-8 w-8 animate-pulse" />
                  </div>
                  <h3 className={`font-display text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{language === 'es' ? '¡Mensaje Enviado con Éxito!' : 'Message Sent Successfully!'}</h3>
                  <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} max-w-md mx-auto leading-relaxed`}>
                    {t('contact.form.success', '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo a la brevedad.')}
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className={`rounded-xl border ${theme === 'dark' ? 'border-white/15 bg-white/5 text-slate-300 hover:text-white hover:border-brand-cyan/30' : 'border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-950 hover:border-brand-blue/30'} px-5 py-2.5 text-xs font-semibold transition-all cursor-pointer`}
                    >
                      {language === 'es' ? 'Enviar otro mensaje' : 'Send another message'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4.5">
                  <h3 className={`font-display text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2`}>{t('contact.form.title', 'Envíanos un mensaje')}</h3>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="name-input" className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{t('contact.form.name', 'Nombre Completo')}</label>
                      <input
                        id="name-input"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={language === 'es' ? 'Ej. Enrique Castro' : 'e.g. Enrique Castro'}
                        className={`w-full rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-slate-950/40 text-white placeholder-slate-600 focus:border-brand-cyan/40 focus:ring-brand-cyan/20' : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-brand-blue/40 focus:ring-brand-blue/20'} px-4 py-3 text-xs sm:text-sm outline-none focus:ring-1`}
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label htmlFor="phone-input" className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{t('contact.form.phone', 'Teléfono / WhatsApp')}</label>
                      <input
                        id="phone-input"
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+591 78459001"
                        className={`w-full rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-slate-950/40 text-white placeholder-slate-600 focus:border-brand-cyan/40 focus:ring-brand-cyan/20' : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-brand-blue/40 focus:ring-brand-blue/20'} px-4 py-3 text-xs sm:text-sm outline-none focus:ring-1`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email-input" className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{t('contact.form.email', 'Correo Electrónico')}</label>
                    <input
                      id="email-input"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="enrique@iatech.bo"
                      className={`w-full rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-slate-950/40 text-white placeholder-slate-600 focus:border-brand-cyan/40 focus:ring-brand-cyan/20' : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-brand-blue/40 focus:ring-brand-blue/20'} px-4 py-3 text-xs sm:text-sm outline-none focus:ring-1`}
                    />
                  </div>

                  {/* Service */}
                  <div className="space-y-1.5">
                    <label htmlFor="service-select" className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{language === 'es' ? '¿Qué servicio necesitas?' : 'Which service do you need?'}</label>
                    <select
                      id="service-select"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-slate-950/40 text-white focus:border-brand-cyan/40' : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-brand-blue/40'} px-4 py-3 text-xs sm:text-sm outline-none`}
                    >
                      <option value="servicio-tecnico" className={theme === 'dark' ? 'bg-dark-navy' : 'bg-white'}>{t('nav.techService', 'Servicio Técnico')}</option>
                      <option value="desarrollo-software" className={theme === 'dark' ? 'bg-dark-navy' : 'bg-white'}>{t('nav.softwareDev', 'Desarrollo de Software')}</option>
                      <option value="ia" className={theme === 'dark' ? 'bg-dark-navy' : 'bg-white'}>{t('nav.aiSolutions', 'Soluciones con IA')}</option>
                      <option value="seguridad" className={theme === 'dark' ? 'bg-dark-navy' : 'bg-white'}>{language === 'es' ? 'Ciberseguridad y Auditoría' : 'Cybersecurity and Auditing'}</option>
                      <option value="soporte" className={theme === 'dark' ? 'bg-dark-navy' : 'bg-white'}>{language === 'es' ? 'Soporte y Outsourcing IT mensual' : 'Monthly IT Support & Outsourcing'}</option>
                      <option value="venta" className={theme === 'dark' ? 'bg-dark-navy' : 'bg-white'}>{language === 'es' ? 'Adquisición / Venta de Equipamiento' : 'Equipment Procurement / Sales'}</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message-textarea" className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">{t('contact.form.message', 'Mensaje')}</label>
                    <textarea
                      id="message-textarea"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={language === 'es' ? 'Ej. Deseo una cotización para...' : 'e.g. I would like a quote for...'}
                      className={`w-full rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-slate-950/40 text-white placeholder-slate-600 focus:border-brand-cyan/40 focus:ring-brand-cyan/20' : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-brand-blue/40 focus:ring-brand-blue/20'} px-4 py-3 text-xs sm:text-sm outline-none focus:ring-1`}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className={`flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r ${theme === 'dark' ? 'from-brand-cyan to-brand-blue shadow-brand-cyan/20' : 'from-brand-blue to-brand-indigo shadow-brand-blue/10'} px-6 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.99] cursor-pointer`}
                    >
                      <span>{t('btn.send', 'Enviar')}</span>
                      <Send className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Google Map and Directions */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-8">
          <h2 className={`font-display text-xl font-bold sm:text-2xl flex items-center justify-center space-x-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <Map className={`h-5 w-5 ${theme === 'dark' ? 'text-brand-cyan' : 'text-brand-blue'}`} />
            <span>{language === 'es' ? 'Nuestras Sucursales' : 'Our Branches'}</span>
          </h2>
          <p className={`mx-auto max-w-xl text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>
            {language === 'es' 
              ? 'Contamos con múltiples puntos de atención y laboratorios de ingeniería de alta tecnología.'
              : 'We have multiple customer support centers and high-tech engineering laboratories.'}
          </p>
        </div>

        {/* Branch Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {branches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => setActiveBranchId(branch.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                activeBranchId === branch.id
                  ? theme === 'dark'
                    ? 'bg-brand-cyan text-slate-950 border-brand-cyan shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                    : 'bg-brand-blue text-white border-brand-blue shadow-[0_0_15px_rgba(30,64,175,0.25)]'
                  : theme === 'dark'
                    ? 'bg-slate-900/30 text-slate-400 border-white/5 hover:border-brand-cyan/20 hover:text-white'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand-blue/30 hover:text-slate-900'
              }`}
            >
              {language === 'es' ? branch.nameEs : branch.nameEn}
            </button>
          ))}
        </div>

        {/* Interactive Google Map and Directions Grid */}
        {(() => {
          const selectedBranch = branches.find(b => b.id === activeBranchId) || branches[0];
          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map Container */}
              <div className={`lg:col-span-2 relative rounded-3xl overflow-hidden border h-96 group transition-all duration-300 ${theme === 'dark' ? 'border-white/5 bg-slate-950' : 'border-slate-200 bg-slate-100'}`}>
                {/* Google Map iFrame with dark mode filter or custom professional light styling filter */}
                <iframe
                  key={selectedBranch.id}
                  src={selectedBranch.iframeSrc}
                  width="100%"
                  height="100%"
                  style={{ 
                    border: 0,
                    filter: theme === 'dark' 
                      ? 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' 
                      : 'grayscale(30%) contrast(98%) brightness(101%)', // Silver-slate clean filter to bypass the stark Google default yellow/greens
                  }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={language === 'es' ? selectedBranch.nameEs : selectedBranch.nameEn}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${theme === 'dark' ? 'opacity-80 hover:opacity-100' : 'opacity-100'}`}
                ></iframe>
                
                {/* Ambient Map Glow */}
                <div className={`absolute inset-0 pointer-events-none border rounded-3xl transition-all duration-300 ${theme === 'dark' ? 'border-brand-cyan/10 group-hover:border-brand-cyan/30' : 'border-transparent'}`}></div>
              </div>

              {/* Directions / Info Card */}
              <div className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between space-y-6 transition-all duration-300 ${theme === 'dark' ? 'border-white/5 bg-slate-900/20' : 'border-slate-200 bg-white shadow-sm text-slate-800'}`}>
                <div className="space-y-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme === 'dark' ? 'bg-brand-cyan/5 border-brand-cyan/20 text-brand-cyan shadow-brand-cyan/10' : 'bg-brand-blue/5 border-brand-blue/20 text-brand-blue shadow-brand-blue/5'} flex h-12 w-12 items-center justify-center rounded-2xl border shadow-lg`}>
                    <MapPin className="h-6 w-6 animate-pulse" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className={`font-display text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {language === 'es' ? selectedBranch.nameEs : selectedBranch.nameEn}
                    </h3>
                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {language === 'es' ? selectedBranch.descEs : selectedBranch.descEn}
                    </p>
                    <div className="pt-2 space-y-1.5 font-mono text-xs">
                      <p className="text-slate-500 uppercase tracking-wider text-[10px]">{language === 'es' ? 'Dirección Exacta' : 'Exact Address'}</p>
                      <p className={`leading-relaxed font-sans font-semibold ${theme === 'dark' ? 'text-brand-cyan' : 'text-brand-blue'}`}>
                        {language === 'es' ? selectedBranch.addressEs : selectedBranch.addressEn}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`space-y-2 pt-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
                  <a 
                    href={selectedBranch.mapLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className={`flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r ${theme === 'dark' ? 'from-brand-cyan to-brand-blue' : 'from-brand-blue to-brand-indigo'} px-4 py-3 text-xs font-semibold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer`}
                  >
                    <span>{language === 'es' ? 'Abrir en Google Maps' : 'Open in Google Maps'}</span>
                    <Send className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })()}
      </section>
    </div>
  );
}
