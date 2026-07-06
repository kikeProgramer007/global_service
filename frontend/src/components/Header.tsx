/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Cpu, ChevronDown, Sun, Moon, Database } from 'lucide-react';
import { ActivePage } from '../types';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';

interface HeaderProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export default function Header({ activePage, onPageChange, theme, onThemeToggle }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  const menuItems = [
    { label: t('nav.home'), page: ActivePage.Home },
    { label: t('nav.about'), page: ActivePage.Nosotros },
  ];

  const serviceSubItems = [
    { label: t('nav.techService'), page: ActivePage.ServicioTecnico },
    { label: t('nav.softwareDev'), page: ActivePage.DesarrolloSoftware },
    { label: t('nav.aiSolutions'), page: ActivePage.SolucionesIA },
  ];

  const otherMenuItems = [
    { label: t('nav.portfolio'), page: ActivePage.Portafolio },
    { label: t('nav.blog'), page: ActivePage.Blog },
    { label: t('nav.contact'), page: ActivePage.Contacto },
  ];


  const handleNavClick = (page: ActivePage) => {
    onPageChange(page);
    setIsOpen(false);
    setServicesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isServiceActive = serviceSubItems.some(item => item.page === activePage) || activePage === ActivePage.Servicios;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-dark-deep/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div 
          onClick={() => handleNavClick(ActivePage.Home)}
          className="flex cursor-pointer items-center"
        >
          <Logo theme={theme} className="h-9 sm:h-10 md:h-11" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {menuItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:text-white ${
                activePage === item.page 
                  ? 'text-brand-cyan text-glow-cyan bg-white/5' 
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Services Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:text-white ${
                isServiceActive 
                  ? 'text-brand-cyan text-glow-cyan bg-white/5' 
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <span>{t('nav.services', 'Servicios')}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {/* Dropdown Menu */}
            {servicesDropdownOpen && (
              <div 
                onMouseLeave={() => setServicesDropdownOpen(false)}
                className="absolute left-0 mt-1 w-56 rounded-xl border border-white/10 bg-dark-navy p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <button
                  onClick={() => handleNavClick(ActivePage.Servicios)}
                  className={`flex w-full items-center px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
                    activePage === ActivePage.Servicios 
                      ? 'text-brand-cyan bg-white/5' 
                      : 'text-slate-500 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {t('nav.allServices', 'Ver Todos los Servicios')}
                </button>
                <div className="my-1 border-t border-white/5"></div>
                {serviceSubItems.map((subItem) => (
                  <button
                    key={subItem.page}
                    onClick={() => handleNavClick(subItem.page)}
                    className={`flex w-full items-center px-3 py-2.5 text-sm rounded-lg transition-all ${
                      activePage === subItem.page 
                        ? 'text-brand-cyan bg-brand-cyan/5 font-medium' 
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {otherMenuItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:text-white ${
                activePage === item.page 
                  ? 'text-brand-cyan text-glow-cyan bg-white/5' 
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Theme Toggle & CTA Button */}
        <div className="hidden lg:flex items-center">
          {/* CMS Admin Button */}
          <button
            onClick={() => handleNavClick(ActivePage.Admin)}
            className={`mr-3.5 flex h-9 items-center justify-center rounded-full border px-3 py-1 text-[11px] font-bold transition-all duration-300 cursor-pointer ${
              activePage === ActivePage.Admin
                ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                : theme === 'light'
                ? 'border-slate-200 bg-white text-slate-600 hover:border-brand-blue/30'
                : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-brand-cyan/30'
            }`}
            title="Panel de Control CMS"
          >
            <Database className="mr-1.5 h-3.5 w-3.5" />
            <span>CMS</span>
          </button>


          {/* Theme Toggle Button */}
          <button
            onClick={onThemeToggle}
            className={`mr-4 flex h-9 items-center space-x-2 rounded-full border px-3 py-1 transition-all duration-300 cursor-pointer ${
              theme === 'light' 
                ? 'border-slate-200 bg-white shadow-sm hover:border-brand-blue/30' 
                : 'border-white/10 bg-slate-950/40 hover:border-brand-cyan/30'
            }`}
            title={theme === 'dark' ? t('nav.themeLight', 'Activar modo claro') : t('nav.themeDark', 'Activar modo oscuro')}
          >
            <Sun className={`h-4 w-4 ${theme === 'light' ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <div className={`h-4 w-[1px] ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
            <div className={`relative h-4.5 w-8 rounded-full transition-all duration-300 p-0.5 ${theme === 'light' ? 'bg-amber-100 border border-amber-200' : 'bg-slate-800'}`}>
              <div className={`h-3 w-3 rounded-full transition-all duration-300 ${theme === 'light' ? 'bg-amber-500 translate-x-3.5' : 'bg-slate-500 translate-x-0'}`} />
            </div>
          </button>

          <button
            onClick={() => handleNavClick(ActivePage.Cotizacion)}
            className={`relative inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer overflow-hidden group ${
              activePage === ActivePage.Cotizacion 
                ? 'bg-gradient-to-r from-brand-cyan to-brand-blue shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                : 'bg-white/5 hover:bg-brand-cyan/20 border border-white/10 hover:border-brand-cyan/40 shadow-[0_0_15px_rgba(0,240,255,0.05)]'
            }`}
          >
            <span className="relative z-10">{t('nav.quote', 'Cotizar Ahora')}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
          </button>
        </div>

        {/* Mobile menu button and theme toggle */}
        <div className="flex lg:hidden items-center space-x-2">

          {/* Mobile Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className={`flex h-9 items-center space-x-2 rounded-full border px-3 py-1 transition-all duration-300 cursor-pointer ${
              theme === 'light' 
                ? 'border-slate-200 bg-white shadow-sm' 
                : 'border-white/10 bg-slate-950/40'
            }`}
            title={theme === 'dark' ? t('nav.themeLight', 'Activar modo claro') : t('nav.themeDark', 'Activar modo oscuro')}
          >
            <Sun className={`h-4 w-4 ${theme === 'light' ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <div className={`h-4 w-[1px] ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
            <div className={`relative h-4.5 w-8 rounded-full transition-all duration-300 p-0.5 ${theme === 'light' ? 'bg-amber-100 border border-amber-200' : 'bg-slate-800'}`}>
              <div className={`h-3 w-3 rounded-full transition-all duration-300 ${theme === 'light' ? 'bg-amber-500 translate-x-3.5' : 'bg-slate-500 translate-x-0'}`} />
            </div>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all border border-transparent hover:border-white/5"
          >
            {isOpen ? <X className="h-6 w-6 text-brand-cyan" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-b border-white/5 bg-dark-navy/95 backdrop-blur-xl animate-in slide-in-from-top duration-200">
          <div className="space-y-1.5 px-4 pb-6 pt-3">
            <button
              onClick={() => handleNavClick(ActivePage.Home)}
              className={`flex w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${
                activePage === ActivePage.Home ? 'bg-brand-cyan/10 text-brand-cyan' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {t('nav.home', 'Inicio')}
            </button>
            <button
              onClick={() => handleNavClick(ActivePage.Nosotros)}
              className={`flex w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${
                activePage === ActivePage.Nosotros ? 'bg-brand-cyan/10 text-brand-cyan' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {t('nav.about', 'Nosotros')}
            </button>
            
            <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('nav.services', 'Servicios')}
            </div>
            <button
              onClick={() => handleNavClick(ActivePage.Servicios)}
              className={`flex w-full pl-8 pr-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activePage === ActivePage.Servicios ? 'text-brand-cyan font-semibold' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              {t('nav.all', 'Todos los Servicios')}
            </button>
            {serviceSubItems.map((subItem) => (
              <button
                key={subItem.page}
                onClick={() => handleNavClick(subItem.page)}
                className={`flex w-full pl-8 pr-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activePage === subItem.page ? 'text-brand-cyan font-semibold bg-brand-cyan/5' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {subItem.label}
              </button>
            ))}

            <div className="my-2 border-t border-white/5"></div>

            {otherMenuItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`flex w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  activePage === item.page ? 'bg-brand-cyan/10 text-brand-cyan' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => handleNavClick(ActivePage.Admin)}
              className={`flex w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${
                activePage === ActivePage.Admin ? 'bg-brand-cyan/10 text-brand-cyan' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Database className="mr-2.5 h-5 w-5" />
              <span>Panel de Control CMS</span>
            </button>

            <div className="pt-4">
              <button
                onClick={() => handleNavClick(ActivePage.Cotizacion)}
                className="flex w-full items-center justify-center px-4 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-brand-cyan to-brand-blue shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:brightness-110 active:scale-[0.98] transition-all"
              >
                {t('nav.quoteProject', 'Cotizar Proyecto')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
