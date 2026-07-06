import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, LucideIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCMS, CMSService } from '../../context/CMSContext';
import { api } from '../../services/api';
import { mapServiceToCMS } from '../../services/mappers';
import ServiceCard, { ServiceCardData } from '../ServiceCard';
import Pagination from '../Pagination';

export type ServiceCategorySlug = CMSService['category'];

interface ServiceCategoryPageProps {
  category: ServiceCategorySlug;
  heroIcon: LucideIcon;
  viewId: string;
}

const ITEMS_PER_PAGE = 9;

export default function ServiceCategoryPage({
  category,
  heroIcon: HeroIcon,
  viewId,
}: ServiceCategoryPageProps) {
  const { language } = useLanguage();
  const { categoryPages, services: cmsServices } = useCMS();
  const [currentPage, setCurrentPage] = useState(1);
  const [services, setServices] = useState<ServiceCardData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const config = categoryPages[category];

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await api.getPublicServices({
          category,
          page: String(currentPage),
          limit: String(ITEMS_PER_PAGE),
        });
        setServices(
          data.services.map((s) => {
            const mapped = mapServiceToCMS(s);
            return {
              id: mapped.id,
              title: language === 'es' ? mapped.titleEs : mapped.titleEn,
              description: language === 'es' ? mapped.descShortEs : mapped.descShortEn,
              image: mapped.image,
              iconName: mapped.iconName,
            };
          })
        );
        setTotalPages(data.totalPages || 1);
      } catch {
        const filtered = cmsServices
          .filter((s) => s.category === category && s.status === 'active')
          .sort((a, b) => a.order - b.order);
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        setServices(
          filtered.slice(start, start + ITEMS_PER_PAGE).map((s) => ({
            id: s.id,
            title: language === 'es' ? s.titleEs : s.titleEn,
            description: language === 'es' ? s.descShortEs : s.descShortEn,
            image: s.image,
            iconName: s.iconName,
          }))
        );
        setTotalPages(Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE)));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [category, currentPage, language, cmsServices]);

  return (
    <div id={viewId} className="bg-dark-deep pb-16 text-white relative overflow-hidden">
      <div className="absolute top-1/4 -right-1/4 h-[400px] w-[400px] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none" />

      <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex max-w-max items-center space-x-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-brand-cyan uppercase">
              <HeroIcon className="h-3.5 w-3.5" />
              <span>{language === 'es' ? config.badgeEs : config.badgeEn}</span>
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
              {language === 'es' ? config.titleEs : config.titleEn}
              <span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent text-glow-cyan">
                {language === 'es' ? config.titleHighlightEs : config.titleHighlightEn}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {language === 'es' ? config.subtitleEs : config.subtitleEn}
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
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-brand-cyan/10 blur-[30px]" />
              <img
                src={config.heroImage}
                alt=""
                referrerPolicy="no-referrer"
                className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl animate-float object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            {language === 'es' ? config.gridTitleEs : config.gridTitleEn}
          </h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-500">
            {language === 'es' ? config.gridSubtitleEs : config.gridSubtitleEn}
          </p>
        </div>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-2xl border border-white/5 bg-slate-900/20 animate-pulse" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            {language === 'es'
              ? 'No hay servicios registrados en esta categoría.'
              : 'No services registered in this category yet.'}
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((item) => (
              <div key={item.id}>
                <ServiceCard service={item} language={language} />
              </div>
            ))}
          </motion.div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-10"
        />
      </section>
    </div>
  );
}
