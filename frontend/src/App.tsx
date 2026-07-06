/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Sparkles, Phone, Laptop, Code, Brain } from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import DevToolbar from './components/DevToolbar';

import HomeView from './components/Views/HomeView';
import NosotrosView from './components/Views/NosotrosView';
import ServicioTecnicoView from './components/Views/ServicioTecnicoView';
import DesarrolloSoftwareView from './components/Views/DesarrolloSoftwareView';
import SolucionesIAView from './components/Views/SolucionesIAView';
import BlogView from './components/Views/BlogView';
import ContactoView from './components/Views/ContactoView';
import CotizacionView from './components/Views/CotizacionView';
import NotFoundView from './components/Views/NotFoundView';
import MantenimientoView from './components/Views/MantenimientoView';
import AdminView from './components/Views/AdminView';

import { CMSProvider } from './context/CMSContext';

const ServiciosView = React.lazy(() => import('./components/Views/ServiciosView'));
const PortafolioView = React.lazy(() => import('./components/Views/PortafolioView'));

import { ActivePage } from './types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>(ActivePage.Home);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'dark';
  });
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: '¡Hola! Soy Gaby, la Inteligencia Artificial de Global Service. ¿En qué solución técnica o ingeniería puedo ayudarte hoy?',
      time: 'Justo ahora'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll logic for chat is implemented where needed, keeping things fast.
  const handlePageChange = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || userInput;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      time: 'Hace un momento'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setUserInput('');
    setIsTyping(true);

    // AI logic response simulation
    setTimeout(() => {
      let replyText = 'Interesante consulta. En Global Service te ofrecemos soporte especializado e ingeniería a medida. Para brindarte un diagnóstico preciso, te sugiero hablar con uno de nuestros ingenieros directamente por WhatsApp o usar el Cotizador Online en el menú superior.';
      
      const query = text.toLowerCase();
      if (query.includes('laptop') || query.includes('repara') || query.includes('mantenimiento') || query.includes('pc') || query.includes('computadora')) {
        replyText = '¡Excelente! Nuestro laboratorio en Equipetrol (Santa Cruz) realiza reparaciones de microelectrónica complejas, cambio de chips, repuestos de pantallas y bisagras para laptops. Ofrecemos Diagnóstico Gratuito. Puedes ver todo el proceso en la pestaña "Servicio Técnico".';
      } else if (query.includes('chatbot') || query.includes('whatsapp') || query.includes('ia') || query.includes('inteligencia artificial')) {
        replyText = 'Desarrollamos Agentes de IA autónomos y chatbots interactivos en WhatsApp entrenados con tus manuales y PDFs. Esto te permite captar prospectos y responder quejas 24/7 sin fallas. Explora más en la pestaña "Soluciones con IA".';
      } else if (query.includes('software') || query.includes('crm') || query.includes('erp') || query.includes('sistema') || query.includes('desarrollo')) {
        replyText = 'Creamos sistemas a medida (ERP, CRM, Ventas, Control de Inventarios, Hotelería) con tecnología ultra veloz como React y Node.js. Te sugiero usar nuestro "Cotizador Online" interactivo en el menú de arriba para estimar un presupuesto aproximado en 1 minuto.';
      } else if (query.includes('precio') || query.includes('costo') || query.includes('cuanto cuesta') || query.includes('presupuesto')) {
        replyText = 'Nuestros presupuestos son modulares y transparentes: una Landing Page inicia en $400 USD, un chatbot de WhatsApp de Inteligencia Artificial inicia en $600 USD y un ERP modular corporativo inicia en $1200 USD. ¿Deseas estructurar un presupuesto en línea? Te invito a la pestaña "Cotización".';
      } else if (query.includes('hola') || query.includes('buenas') || query.includes('saludos')) {
        replyText = '¡Hola! Qué gusto saludarte. Soy Gaby de Global Service. ¿Deseas información sobre reparación de laptops, desarrollo de software, o agentes de Inteligencia Artificial?';
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        time: 'Justo ahora'
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const renderActiveView = () => {
    switch (activePage) {
      case ActivePage.Home:
        return <HomeView onPageChange={handlePageChange} />;
      case ActivePage.Nosotros:
        return <NosotrosView />;
      case ActivePage.Servicios:
        return <ServiciosView onPageChange={handlePageChange} />;
      case ActivePage.ServicioTecnico:
        return <ServicioTecnicoView />;
      case ActivePage.DesarrolloSoftware:
        return <DesarrolloSoftwareView onPageChange={handlePageChange} />;
      case ActivePage.SolucionesIA:
        return <SolucionesIAView onPageChange={handlePageChange} />;
      case ActivePage.Portafolio:
        return <PortafolioView onPageChange={handlePageChange} />;
      case ActivePage.Blog:
        return <BlogView />;
      case ActivePage.Contacto:
        return <ContactoView theme={theme} />;
      case ActivePage.Cotizacion:
        return <CotizacionView />;
      case ActivePage.Admin:
        return (
          <AdminView 
            onPageChange={handlePageChange} 
            theme={theme}
            onThemeToggle={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
          />
        );
      case ActivePage.NotFound:
        return <NotFoundView onPageChange={handlePageChange} />;
      case ActivePage.Mantenimiento:
        return <MantenimientoView />;
      default:
        return <HomeView onPageChange={handlePageChange} />;
    }
  };

  return (
    <CMSProvider>
      <div 
        id="root-app-container" 
        className={`flex min-h-screen flex-col ${theme === 'dark' ? 'dark bg-dark-deep text-white' : 'light bg-slate-50 text-slate-900'} font-sans antialiased select-none selection:bg-brand-cyan/30`}
      >
        {/* Dynamic Header */}
        {activePage !== ActivePage.Admin && (
          <Header 
            activePage={activePage} 
            onPageChange={handlePageChange} 
            theme={theme}
            onThemeToggle={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
          />
        )}

        {/* Main View Area with transition effects */}
        <main id="main-view-content" className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <React.Suspense fallback={
                <div className="min-h-[60vh] flex items-center justify-center bg-dark-deep text-white">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-cyan/20 border-t-brand-cyan"></div>
                    <span className="font-mono text-xs text-slate-500 uppercase tracking-widest animate-pulse">Cargando Módulo...</span>
                  </div>
                </div>
              }>
                {renderActiveView()}
              </React.Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Dynamic Footer */}
        {activePage !== ActivePage.Admin && <Footer onPageChange={handlePageChange} />}

        {/* Evaluator Debugger Console Bar */}
        <DevToolbar activePage={activePage} onPageChange={handlePageChange} />

        {/* Floating Buttons: WhatsApp & AI Chat */}
        {activePage !== ActivePage.Admin && (
          <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3 items-end">
            
            {/* Floating WhatsApp Bubble */}
            <a 
              href="https://wa.me/59178459001" 
              target="_blank" 
              rel="noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 border border-green-500 text-white shadow-lg hover:scale-105 hover:bg-green-500 transition-all cursor-pointer"
              title="Chatear por WhatsApp con un técnico"
            >
              <Phone className="h-5 w-5 fill-white" />
            </a>

            {/* Floating AI Chat Bubble */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105 cursor-pointer ${
                isChatOpen 
                  ? 'bg-slate-900 border border-white/10 text-slate-400' 
                  : 'bg-gradient-to-r from-brand-cyan to-brand-blue border border-brand-cyan/40 shadow-brand-cyan/20 animate-pulse'
              }`}
              title="Preguntar a Gaby IA"
            >
              {isChatOpen ? <X className="h-5 w-5" /> : <Brain className="h-5 w-5 text-white" />}
            </button>

            {/* AI Chat Window Panel */}
            <AnimatePresence>
              {isChatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                  className="mr-1 w-80 sm:w-96 rounded-2xl border border-white/10 bg-slate-950 p-4 shadow-2xl shadow-black/80 flex flex-col h-[450px]"
                >
                  {/* Chat Header */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-cyan/10 border border-brand-cyan/30">
                        <Bot className="h-5 w-5 text-brand-cyan" />
                        <span className="absolute bottom-[-2px] right-[-2px] h-2.5 w-2.5 rounded-full bg-green-500 border border-slate-950"></span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Gaby - Asistente IA</h4>
                        <span className="font-mono text-[9px] tracking-wider text-slate-500 uppercase">Consultor Tecnológico</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsChatOpen(false)}
                      className="rounded-full bg-white/5 p-1.5 text-slate-500 hover:bg-white/10 hover:text-white transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto py-3 space-y-3.5 no-scrollbar">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <div className={`rounded-2xl px-3.5 py-2.5 text-xs ${
                          msg.sender === 'user' 
                            ? 'bg-brand-cyan text-slate-950 font-medium rounded-tr-none shadow-md' 
                            : 'bg-white/5 border border-white/5 text-slate-300 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="font-mono text-[8px] text-slate-600 mt-1">{msg.time}</span>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-center space-x-2 mr-auto bg-white/5 border border-white/5 rounded-2xl px-3.5 py-2.5">
                        <span className="h-2 w-2 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="h-2 w-2 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="h-2 w-2 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    )}
                  </div>

                  {/* Chat Quick Prompts */}
                  <div className="border-t border-white/5 pt-2 pb-1.5 flex flex-wrap gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                    {[
                      { label: '💻 Reparar Laptop', text: '¿Cómo puedo agendar la reparación o mantenimiento de mi laptop?' },
                      { label: '🤖 Chatbot IA', text: 'Quiero integrar un chatbot de Inteligencia Artificial para WhatsApp en mi negocio.' },
                      { label: '🚀 Cotizar Software', text: '¿Cuánto cuesta cotizar un software o sistema a medida ERP/CRM?' },
                      { label: '💰 Precios', text: '¿Qué costos y tarifas aproximadas manejan en sus servicios?' }
                    ].map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt.text)}
                        className="shrink-0 rounded-lg bg-white/5 border border-white/5 px-2.5 py-1.5 text-[10px] font-medium text-slate-400 hover:text-white hover:bg-brand-cyan/10 hover:border-brand-cyan/20 transition-all cursor-pointer"
                      >
                        {prompt.label}
                      </button>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="border-t border-white/5 pt-3 flex items-center space-x-2 shrink-0">
                    <input
                      type="text"
                      placeholder="Haz una consulta técnica..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-brand-cyan/40"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}
      </div>
    </CMSProvider>
  );
}
