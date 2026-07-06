import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Laptop } from 'lucide-react';
import { IMAGES } from '../assets';

export interface ServiceCardData {
  id: string;
  title: string;
  description: string;
  image: string;
  iconName: string;
  whatsappMessage?: string;
}

interface ServiceCardProps {
  service: ServiceCardData;
  language?: 'es' | 'en';
}

export default function ServiceCard({ service, language = 'es' }: ServiceCardProps) {
  const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[service.iconName] || Laptop;
  const imageSrc = service.image || IMAGES.techRepair;
  const waText = service.whatsappMessage || service.title;
  const waLink = `https://wa.me/59178459001?text=${encodeURIComponent(
    language === 'es'
      ? `Hola Global Service, me interesa el servicio: ${waText}`
      : `Hello Global Service, I'm interested in: ${waText}`
  )}`;

  return (
    <div className="group glass-panel rounded-2xl border border-white/5 bg-slate-900/10 hover:border-brand-cyan/25 transition-all duration-300 flex flex-col overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent z-10" />
        <img
          src={imageSrc}
          alt={service.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          onError={(e) => {
            (e.target as HTMLImageElement).src = IMAGES.techRepair;
          }}
        />
        <div className="absolute bottom-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/25 backdrop-blur-md shadow-md">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow space-y-2.5">
        <h3 className="font-display text-base font-bold text-white group-hover:text-brand-cyan transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed flex-grow line-clamp-4">
          {service.description}
        </p>
        <div className="pt-2">
          <a
            href={waLink}
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
}
