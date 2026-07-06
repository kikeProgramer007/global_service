/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Home, ArrowRight } from 'lucide-react';
import { ActivePage } from '../../types';
import { IMAGES } from '../../assets';
import { useLanguage } from '../../context/LanguageContext';

interface NotFoundViewProps {
  onPageChange: (page: ActivePage) => void;
}

export default function NotFoundView({ onPageChange }: NotFoundViewProps) {
  const { t, language } = useLanguage();

  return (
    <div id="not-found-view" className="relative min-h-[75vh] bg-dark-deep text-white flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Space decorative glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-brand-cyan/5 blur-[130px] pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-lg space-y-6 flex flex-col items-center">
        {/* Floating Astronaut Image */}
        <div className="relative h-44 w-44">
          <div className="absolute inset-0 rounded-full bg-brand-cyan/20 blur-[25px] animate-pulse"></div>
          <img 
            src={IMAGES.spaceAstronaut} 
            alt="Astronaut floating in space 404 error" 
            referrerPolicy="no-referrer"
            className="relative z-10 h-full w-full object-cover rounded-full border border-brand-cyan/30 animate-float"
          />
        </div>

        {/* 404 code */}
        <h1 className="font-display text-7xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-indigo text-glow-cyan animate-pulse">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="font-display text-xl font-bold sm:text-2xl">
            {language === 'es' ? 'Página no encontrada' : 'Page Not Found'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            {language === 'es'
              ? 'Lo sentimos, el enlace o la ruta que intentas consultar parece haberse desviado en el hiperespacio o no existe en nuestros servidores de Global Service.'
              : 'Sorry, the link or route you are trying to access seems to have drifted into hyperspace or does not exist on our Global Service servers.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onPageChange(ActivePage.Home);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-brand-cyan/15 transition-all hover:scale-103 cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>{language === 'es' ? 'Volver al Inicio' : 'Back to Home'}</span>
          </button>
          <button
            onClick={() => {
              onPageChange(ActivePage.Contacto);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center justify-center space-x-1.5 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold text-slate-400 hover:text-white transition-all hover:border-brand-cyan/30 cursor-pointer"
          >
            <span>{language === 'es' ? 'Informar de un error' : 'Report an error'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
