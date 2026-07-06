/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, MessageSquare, RefreshCw, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function MantenimientoView() {
  const { t, language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    hours: '04',
    minutes: '18',
    seconds: '45'
  });

  // Simple ticking simulation for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      let h = parseInt(timeLeft.hours);
      let m = parseInt(timeLeft.minutes);
      let s = parseInt(timeLeft.seconds);

      if (s > 0) {
        s--;
      } else {
        s = 59;
        if (m > 0) {
          m--;
        } else {
          m = 59;
          if (h > 0) {
            h--;
          } else {
            h = 4; // Loop back
          }
        }
      }

      setTimeLeft({
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div id="mantenimiento-view" className="relative min-h-[75vh] bg-dark-deep text-white flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-xl space-y-7 flex flex-col items-center">
        
        {/* Animated cog/wrench circle */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-brand-cyan/25 blur-[25px] animate-pulse-slow"></div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-brand-cyan/40 text-brand-cyan shadow-lg shadow-brand-cyan/15 relative">
            <RefreshCw className="h-7 w-7 animate-spin" style={{ animationDuration: '8s' }} />
            <ShieldAlert className="absolute bottom-1 right-1 h-4.5 w-4.5 text-white bg-dark-navy border border-brand-cyan/40 rounded-full p-0.5" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
            {language === 'es' ? 'Sitio en mantenimiento' : 'Site under maintenance'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            {language === 'es'
              ? 'Estamos actualizando nuestros servidores e integrando nuevos módulos de Inteligencia Artificial para ofrecerte una experiencia de navegación mucho más rápida y automatizada. ¡Volveremos muy pronto!'
              : 'We are updating our servers and integrating new Artificial Intelligence modules to offer you a much faster and more automated browsing experience. We will be back very soon!'}
          </p>
        </div>

        {/* Dynamic Countdown Clock */}
        <div className="space-y-2">
          <span className="font-mono text-[9px] tracking-widest text-slate-500 uppercase flex items-center justify-center space-x-1">
            <Clock className="h-3 w-3 text-brand-cyan animate-pulse" />
            <span>{language === 'es' ? 'Regresamos en aproximadamente:' : 'Back in approximately:'}</span>
          </span>
          
          <div className="flex items-center justify-center space-x-2.5 sm:space-x-3.5">
            {[
              { val: timeLeft.hours, label: language === 'es' ? 'Horas' : 'Hours' },
              { val: timeLeft.minutes, label: language === 'es' ? 'Minutos' : 'Minutes' },
              { val: timeLeft.seconds, label: language === 'es' ? 'Segundos' : 'Seconds' },
            ].map((unit, idx) => (
              <div key={idx} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="glass-panel min-w-[56px] sm:min-w-[70px] rounded-2xl border border-white/5 bg-slate-950/40 py-2.5 sm:py-3.5 text-xl sm:text-3xl font-extrabold text-white text-glow-cyan font-mono">
                    {unit.val}
                  </div>
                  <span className="font-mono text-[9px] text-slate-500 uppercase mt-1.5">{unit.label}</span>
                </div>
                {idx < 2 && (
                  <span className="text-brand-cyan font-extrabold text-xl sm:text-2xl ml-2.5 sm:ml-3.5 mt-[-15px] animate-pulse">:</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Assistance button */}
        <div className="pt-2">
          <a 
            href="https://wa.me/59178459001" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center space-x-2 rounded-xl bg-green-600 hover:bg-green-500 px-5 py-3 text-xs font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{language === 'es' ? 'Soporte Inmediato por WhatsApp' : 'Immediate WhatsApp Support'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
