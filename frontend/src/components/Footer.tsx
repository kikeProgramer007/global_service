/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Cpu, Github, Linkedin, Facebook } from 'lucide-react';
import { ActivePage } from '../types';
import Logo from './Logo';

interface FooterProps {
  onPageChange: (page: ActivePage) => void;
}

export default function Footer({ onPageChange }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const handleLinkClick = (page: ActivePage) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/5 bg-dark-deep pt-16 pb-8 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand Col */}
          <div className="flex flex-col space-y-4">
            <div 
              onClick={() => handleLinkClick(ActivePage.Home)}
              className="flex cursor-pointer items-center"
            >
              <Logo className="h-9 sm:h-10" />
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Soluciones tecnológicas integrales y personalizadas para potenciar la eficiencia, conectividad y crecimiento de tu negocio.
            </p>
            <div className="flex space-x-3 pt-2">
              <a 
                href="#" 
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-400 transition-all hover:border-brand-cyan/30 hover:bg-brand-cyan/10 hover:text-brand-cyan"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-400 transition-all hover:border-brand-cyan/30 hover:bg-brand-cyan/10 hover:text-brand-cyan"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-400 transition-all hover:border-brand-cyan/30 hover:bg-brand-cyan/10 hover:text-brand-cyan"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h3 className="font-display text-sm font-semibold tracking-wider text-white uppercase">Enlaces Rápidos</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => handleLinkClick(ActivePage.Home)}
                  className="transition-colors hover:text-brand-cyan hover:underline text-left"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick(ActivePage.Nosotros)}
                  className="transition-colors hover:text-brand-cyan hover:underline text-left"
                >
                  Nosotros
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick(ActivePage.Portafolio)}
                  className="transition-colors hover:text-brand-cyan hover:underline text-left"
                >
                  Portafolio y Proyectos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick(ActivePage.Blog)}
                  className="transition-colors hover:text-brand-cyan hover:underline text-left"
                >
                  Blog Tecnológico
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick(ActivePage.Contacto)}
                  className="transition-colors hover:text-brand-cyan hover:underline text-left"
                >
                  Contacto Directo
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick(ActivePage.Admin)}
                  className="transition-colors hover:text-brand-cyan hover:underline text-left"
                >
                  Panel Administrador (CMS)
                </button>
              </li>
            </ul>
          </div>

          {/* Services Col */}
          <div>
            <h3 className="font-display text-sm font-semibold tracking-wider text-white uppercase">Servicios</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => handleLinkClick(ActivePage.ServicioTecnico)}
                  className="transition-colors hover:text-brand-cyan hover:underline text-left"
                >
                  Soporte Técnico Laptop/PC
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick(ActivePage.DesarrolloSoftware)}
                  className="transition-colors hover:text-brand-cyan hover:underline text-left"
                >
                  Desarrollo de Software CRM/ERP
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick(ActivePage.SolucionesIA)}
                  className="transition-colors hover:text-brand-cyan hover:underline text-left"
                >
                  Agentes de IA y Chatbots WhatsApp
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick(ActivePage.Servicios)}
                  className="transition-colors hover:text-brand-cyan hover:underline text-left"
                >
                  Seguridad Informática
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick(ActivePage.Servicios)}
                  className="transition-colors hover:text-brand-cyan hover:underline text-left"
                >
                  Soporte IT para Empresas
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h3 className="font-display text-sm font-semibold tracking-wider text-white uppercase">Suscríbete</h3>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">
              Recibe noticias sobre tecnología, seguridad digital e innovaciones en IA directamente en tu correo.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex flex-col space-y-2">
              <div className="relative flex rounded-xl border border-white/10 bg-white/5 focus-within:border-brand-cyan/40">
                <input
                  type="email"
                  required
                  placeholder="Tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center px-3 text-brand-cyan hover:text-white transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-brand-cyan animate-pulse">¡Suscripción exitosa! Muchas gracias.</p>
              )}
            </form>
          </div>
        </div>

        {/* Contact info bar */}
        <div className="mt-12 grid grid-cols-1 gap-6 border-y border-white/5 py-8 sm:grid-cols-3 text-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-brand-cyan">
              <Phone className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-mono">Llámanos o WhatsApp</span>
              <a href="https://wa.me/59178459001" target="_blank" rel="noreferrer" className="text-white hover:text-brand-cyan transition-colors font-medium">
                +591 78459001
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-brand-cyan">
              <Mail className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-mono">Escríbenos por correo</span>
              <a href="mailto:enriquecq@iatech.bo" className="text-white hover:text-brand-cyan transition-colors font-medium">
                enriquecq@iatech.bo
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-brand-cyan">
              <MapPin className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-mono">Ubicación principal</span>
              <span className="text-white font-medium">
                Santa Cruz de la Sierra, Bolivia
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0 text-xs text-slate-600">
          <p>© 2026 Global Service. Todos los derechos reservados.</p>
          <div className="flex space-x-4">
            <button className="hover:text-slate-400">Políticas de Privacidad</button>
            <button className="hover:text-slate-400">Términos de Servicio</button>
            <span className="text-slate-500">Diseñado con ♥ para tu negocio.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
