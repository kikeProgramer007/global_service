/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Layers, ArrowUpRight, EyeOff, Eye } from 'lucide-react';
import { ActivePage } from '../types';

interface DevToolbarProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
}

export default function DevToolbar({ activePage, onPageChange }: DevToolbarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const screens = [
    { label: '1. Inicio / Home', page: ActivePage.Home },
    { label: '2. Nosotros', page: ActivePage.Nosotros },
    { label: '3. Servicios', page: ActivePage.Servicios },
    { label: '4. Servicio Técnico', page: ActivePage.ServicioTecnico },
    { label: '5. Desarrollo Software', page: ActivePage.DesarrolloSoftware },
    { label: '6. Soluciones con IA', page: ActivePage.SolucionesIA },
    { label: '7. Portafolio', page: ActivePage.Portafolio },
    { label: '8. Blog', page: ActivePage.Blog },
    { label: '9. Contacto', page: ActivePage.Contacto },
    { label: '10. Cotización', page: ActivePage.Cotizacion },
    { label: '11. 404 Error', page: ActivePage.NotFound },
    { label: '12. Mantenimiento', page: ActivePage.Mantenimiento },
  ];

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-brand-cyan/40 text-brand-cyan shadow-lg shadow-brand-cyan/20 hover:scale-105 transition-all cursor-pointer"
        title="Mostrar panel de navegación rápida"
      >
        <Settings className="h-5 w-5 animate-spin-slow" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-5xl rounded-2xl border border-brand-cyan/20 bg-slate-950/90 px-4 py-3 shadow-[0_0_25px_rgba(0,240,255,0.15)] backdrop-blur-xl animate-in slide-in-from-bottom duration-300">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        {/* Header */}
        <div className="flex items-center justify-between md:space-x-3">
          <div className="flex items-center space-x-2">
            <Layers className="h-4.5 w-4.5 text-brand-cyan" />
            <span className="font-display text-xs font-semibold tracking-wider text-white uppercase">
              Consola del Evaluador
            </span>
            <span className="rounded-full bg-brand-cyan/10 px-2 py-0.5 font-mono text-[9px] font-medium text-brand-cyan">
              12 Pantallas
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="rounded p-1 text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-colors"
            title="Minimizar panel"
          >
            <EyeOff className="h-4 w-4" />
          </button>
        </div>

        {/* Links Grid */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto no-scrollbar py-1">
          {screens.map((screen) => (
            <button
              key={screen.page}
              onClick={() => {
                onPageChange(screen.page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium tracking-wide transition-all cursor-pointer ${
                activePage === screen.page
                  ? 'bg-brand-cyan text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.3)] font-semibold'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <span>{screen.label}</span>
              <ArrowUpRight className="h-3 w-3 opacity-60" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
