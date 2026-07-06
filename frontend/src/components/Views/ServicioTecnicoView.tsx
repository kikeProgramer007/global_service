/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Laptop, 
  Smartphone, 
  Printer, 
  Tv, 
  Gamepad2, 
  Network, 
  Database,
  MessageSquare,
  Wrench,
  Camera,
  Cpu,
  Activity,
  HardDrive
} from 'lucide-react';
import { IMAGES } from '../../assets';
import { useLanguage } from '../../context/LanguageContext';

export default function ServicioTecnicoView() {
  const { t, language } = useLanguage();

  const repairCategories = [
    { 
      title: language === 'es' ? 'Laptops y Computadoras' : 'Laptops and Computers', 
      desc: language === 'es' 
        ? 'Reparación de placas madre, reballing de procesadores, reparación de bisagras, aumento de memoria RAM/SSD, formateo e instalación de software con licencia original.' 
        : 'Motherboard repair, processor reballing, hinge repair, RAM/SSD upgrades, formatting, and software installation with original licensing.', 
      icon: Laptop,
      image: IMAGES.laptopComputers
    },
    { 
      title: language === 'es' ? 'Celulares y Tablets' : 'Phones and Tablets', 
      desc: language === 'es' 
        ? 'Cambio de pantallas (glass/módulo completo), baterías de alta duración, reparación de puertos de carga USB-C, y depuración de software Android e iOS.' 
        : 'Screen replacement (glass/full modules), high-capacity battery installation, USB-C charging port repairs, and Android/iOS software troubleshooting.', 
      icon: Smartphone,
      image: IMAGES.phonesTablets
    },
    { 
      title: language === 'es' ? 'Impresoras y Escáneres' : 'Printers and Scanners', 
      desc: language === 'es' 
        ? 'Limpieza profunda de cabezales, destranque de papel, calibración de rodillos de arrastre, instalación de sistemas de tinta continua y reparación lógica.' 
        : 'Deep printhead cleaning, paper jam clearance, feed roller calibration, continuous ink system installation, and logic board repairs.', 
      icon: Printer,
      image: IMAGES.printerRepair
    },
    { 
      title: language === 'es' ? 'Televisores y Monitores' : 'TVs and Monitors', 
      desc: language === 'es' 
        ? 'Reparación de iluminación LED (pantalla oscura), placas de fuente de poder, placas lógicas principales y sustitución de conectores HDMI.' 
        : 'LED backlight repair (dark screen), power supply board repairs, main logic board troubleshooting, and HDMI connector replacement.', 
      icon: Tv,
      image: IMAGES.tvRepair
    },
    { 
      title: language === 'es' ? 'Consolas de Videojuegos' : 'Video Game Consoles', 
      desc: language === 'es' 
        ? 'Limpieza térmica profunda, cambio de pasta térmica (Metal Líquido), reemplazo de puertos HDMI de PS5/PS4/Xbox, reparación de joysticks y lectores láser.' 
        : 'Deep thermal cleaning, liquid metal/thermal paste replacement, PS5/PS4/Xbox HDMI port replacement, joystick drift fixes, and laser lens repair.', 
      icon: Gamepad2,
      image: IMAGES.gameConsole
    },
    { 
      title: language === 'es' ? 'Cámaras de Seguridad (CCTV)' : 'CCTV Security Cameras', 
      desc: language === 'es' 
        ? 'Instalación, reparación y mantenimiento preventivo de cámaras analógicas e IP, configuración de NVR/DVR para visualización móvil remota.' 
        : 'Installation, repair, and preventive maintenance of analog and IP cameras, NVR/DVR remote mobile monitoring.', 
      icon: Camera,
      image: IMAGES.cctvSecurity
    },
    { 
      title: language === 'es' ? 'Reparación Electrónica' : 'Electronic Repair', 
      desc: language === 'es' 
        ? 'Reparación a nivel de componentes electrónicos de placas madre, fuentes de poder, tarjetas lógicas y circuitos integrados.' 
        : 'Component-level electronic repair of motherboards, power supplies, logic boards, and integrated circuits.', 
      icon: Cpu,
      image: IMAGES.electronicRepair
    },
    { 
      title: language === 'es' ? 'Mantenimiento Preventivo' : 'Preventive Maintenance', 
      desc: language === 'es' 
        ? 'Limpieza profunda física interna, soplado de polvo, lubricación de ventiladores y cambio de pastas térmicas de alta conductividad.' 
        : 'Deep physical internal cleaning, dust blow, fan lubrication, and high-conductivity thermal paste replacement.', 
      icon: Activity,
      image: IMAGES.preventiveMaintenance
    },
    { 
      title: language === 'es' ? 'Recuperación de Información' : 'Data Recovery', 
      desc: language === 'es' 
        ? 'Extracción segura de información de discos duros mecánicos dañados, SSD quemados, pendrives corruptos y borrados accidentales.' 
        : 'Secure file extraction from damaged mechanical hard drives, failed SSDs, corrupted flash drives, and accidental deletions.', 
      icon: Database,
      image: IMAGES.dataRecovery
    },
    { 
      title: language === 'es' ? 'Instalación de Software' : 'Software Installation', 
      desc: language === 'es' 
        ? 'Instalación de sistemas operativos oficiales, paquetes ofimáticos, utilidades, controladores oficiales y desinfección profunda de malware.' 
        : 'Installation of official operating systems, office suites, utility suites, official drivers, and deep malware disinfection.', 
      icon: HardDrive,
      image: IMAGES.softwareInstall
    },
    { 
      title: language === 'es' ? 'Redes y Conectividad' : 'Networks and Connectivity', 
      desc: language === 'es' 
        ? 'Configuración de routers de largo alcance, instalación de extensores WiFi Mesh, ponchado e instalación de cableado estructurado categoría 6/6A.' 
        : 'Long-range router setup, Mesh WiFi extender installation, ethernet crimping, and structured Category 6/6A cabling deployment.', 
      icon: Network,
      image: IMAGES.networkConnectivity
    },
    { 
      title: language === 'es' ? 'Accesorios y Repuestos' : 'Accessories and Spare Parts', 
      desc: language === 'es' 
        ? 'Venta e instalación de repuestos originales de alta calidad, cargadores certificados, coolers de alto rendimiento y accesorios de conectividad.' 
        : 'Sale and installation of high-quality original spare parts, certified chargers, high-performance coolers, and connectivity accessories.', 
      icon: Wrench,
      image: IMAGES.accessoriesParts
    },
  ];

  const steps = [
    { 
      title: language === 'es' ? 'Recepción' : 'Reception', 
      text: language === 'es' 
        ? 'Registramos el equipo emitiendo un ticket detallado de su estado físico.' 
        : 'We check in your device and issue a detailed ticket describing its physical status.' 
    },
    { 
      title: language === 'es' ? 'Diagnóstico' : 'Diagnosis', 
      text: language === 'es' 
        ? 'Revisión técnica en laboratorio con multímetros y osciloscopios.' 
        : 'Technical diagnosis in our lab using specialized multimeters and oscilloscopes.' 
    },
    { 
      title: language === 'es' ? 'Presupuesto' : 'Estimate', 
      text: language === 'es' 
        ? 'Te informamos el diagnóstico y costo exacto vía WhatsApp para tu aprobación.' 
        : 'We notify you of the diagnosis and exact cost via WhatsApp for your approval.' 
    },
    { 
      title: language === 'es' ? 'Reparación' : 'Repair', 
      text: language === 'es' 
        ? 'Trabajamos con repuestos originales bajo estrictas normas térmicas.' 
        : 'We perform repairs with original parts under strict ESD and thermal standards.' 
    },
    { 
      title: language === 'es' ? 'Control de Calidad' : 'Quality Control', 
      text: language === 'es' 
        ? 'Sometemos el equipo a pruebas de estrés para validar que funcione al 100%.' 
        : 'We stress-test your device to ensure it performs at 100% stability.' 
    },
    { 
      title: language === 'es' ? 'Entrega' : 'Delivery', 
      text: language === 'es' 
        ? 'Retiras tu equipo con boleta y sello de garantía escrita de 3 a 6 meses.' 
        : 'You pick up your device with an official receipt and written warranty of 3 to 6 months.' 
    },
  ];

  return (
    <div id="servicio-tecnico-view" className="bg-dark-deep pb-16 text-white relative overflow-hidden">
      <div className="absolute top-1/4 -right-1/4 h-[400px] w-[400px] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none"></div>

      {/* Hero Banner */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Banner text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex max-w-max items-center space-x-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-brand-cyan uppercase">
              <Wrench className="h-3.5 w-3.5" />
              <span>{language === 'es' ? 'Soporte de Hardware de Alta Gama' : 'High-End Hardware Support'}</span>
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
              {language === 'es' ? 'Soluciones técnicas para que ' : 'Technical solutions so '}<span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent text-glow-cyan">{language === 'es' ? 'todo funcione perfecto' : 'everything runs perfectly'}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {t('technical.subtitle', 'Brindamos reparación, mantenimiento y soporte para equipos electrónicos con garantía, repuestos originales y técnicos certificados.')}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="https://wa.me/59178459001" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center space-x-2 rounded-xl bg-green-600 hover:bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquare className="h-4.5 w-4.5" />
                <span>{language === 'es' ? 'Hablar por WhatsApp' : 'Chat via WhatsApp'}</span>
              </a>
              <a 
                href="https://wa.me/59178459001" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center space-x-2 rounded-xl bg-brand-cyan hover:brightness-110 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-brand-cyan/15 transition-all active:scale-95 cursor-pointer"
              >
                <span>{language === 'es' ? 'Solicitar Servicio' : 'Request Service'}</span>
              </a>
            </div>
          </div>

          {/* Banner image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-brand-cyan/10 blur-[30px]"></div>
              <img 
                src={IMAGES.heroGamerPcRepair} 
                alt="PC Gamer setup hardware diagnostics and repair" 
                referrerPolicy="no-referrer"
                className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Repairs catalog */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{language === 'es' ? '¿Qué equipos reparamos?' : 'What equipment do we repair?'}</h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-500">
            {language === 'es'
              ? 'Tenemos herramientas específicas, laboratorio de última generación y personal altamente capacitado para reparar tus dispositivos.'
              : 'We have specialized equipment, a state-of-the-art laboratory, and highly trained staff to repair your devices.'}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {repairCategories.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="group glass-panel rounded-2xl border border-white/5 bg-slate-900/10 hover:border-brand-cyan/25 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Image Container with elegant overlay */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent z-10"></div>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute bottom-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/25 backdrop-blur-md shadow-md">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-5 flex flex-col flex-grow space-y-2.5">
                  <h3 className="font-display text-base font-bold text-white group-hover:text-brand-cyan transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed flex-grow">
                    {item.desc}
                  </p>
                  
                  {/* Action Link */}
                  <div className="pt-2">
                    <a 
                      href="https://wa.me/59178459001" 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-cyan hover:text-brand-cyan/80 transition-colors"
                    >
                      <span>{language === 'es' ? 'Ver más' : 'Read more'}</span>
                      <span className="text-[10px] transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-white/5 mt-12">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{language === 'es' ? 'Nuestro Proceso de Servicio' : 'Our Service Process'}</h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-500">
            {language === 'es'
              ? 'Seguimos rigurosas etapas lógicas para asegurar la calidad y satisfacción en cada reparación.'
              : 'We follow rigorous, logical stages to ensure high quality and absolute satisfaction in every repair.'}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 text-center">
          {steps.map((step, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/30 relative">
              <div className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-cyan/10 font-mono text-xs font-semibold text-brand-cyan">
                {idx + 1}
              </div>
              <div className="pt-4 space-y-2">
                <h4 className="font-display text-sm font-bold text-white">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-brand-cyan/20 bg-slate-950 p-8 md:p-12 shadow-2xl">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src={IMAGES.ctaBanner} 
              alt="Futuristic high-tech fiber optic light lines background" 
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover opacity-30 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40"></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left max-w-xl">
              <h3 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                {language === 'es' ? '¿Listo para reparar tu equipo?' : 'Ready to repair your device?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'es'
                  ? 'Confía en ingenieros expertos. Diagnósticos precisos, repuestos originales garantizados y soporte post-servicio.'
                  : 'Trust in expert engineers. Accurate diagnostics, guaranteed original parts, and dedicated post-service support.'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto shrink-0">
              <a 
                href="https://wa.me/59178459001" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center space-x-2 rounded-xl bg-brand-cyan hover:brightness-110 px-6 py-3.5 text-xs font-bold text-slate-950 shadow-lg shadow-brand-cyan/20 transition-all active:scale-95 cursor-pointer"
              >
                <span>{language === 'es' ? 'Solicitar Servicio' : 'Request Service'}</span>
                <span>→</span>
              </a>
              <a 
                href="https://wa.me/59178459001" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center space-x-2 rounded-xl border border-white/10 bg-slate-950/50 hover:bg-slate-900 px-6 py-3.5 text-xs font-bold text-white transition-all active:scale-95 cursor-pointer backdrop-blur-md"
              >
                <MessageSquare className="h-4 w-4 text-green-500" />
                <span>{language === 'es' ? 'Hablar por WhatsApp' : 'Chat via WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
