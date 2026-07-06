/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight, 
  X, 
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { IMAGES } from '../../assets';
import { BlogPost } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCMS } from '../../context/CMSContext';

export default function BlogView() {
  const { t, language } = useLanguage();
  const { blogs: cmsBlogs } = useCMS();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  React.useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPost]);

  const posts: BlogPost[] = cmsBlogs
    .filter(b => b.status === 'active')
    .map(b => ({
      id: b.id,
      title: language === 'es' ? b.titleEs : b.titleEn,
      category: b.category,
      date: b.date,
      readTime: language === 'es' ? b.readTimeEs : b.readTimeEn,
      image: b.image || IMAGES.blog1,
      summary: language === 'es' ? b.summaryEs : b.summaryEn,
      content: language === 'es' ? b.contentEs : b.contentEn
    }));

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
                            (activeCategory === 'tecnologia' && post.category.toLowerCase() === (language === 'es' ? 'tecnología' : 'technology')) ||
                            (activeCategory === 'ia' && post.category.toLowerCase() === 'ia') ||
                            (activeCategory === 'desarrollo' && post.category.toLowerCase() === (language === 'es' ? 'desarrollo' : 'development')) ||
                            (activeCategory === 'seguridad' && post.category.toLowerCase() === (language === 'es' ? 'seguridad' : 'security'));
    return matchesSearch && matchesCategory;
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const getCategoryColor = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower === 'seguridad' || lower === 'security') return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (lower === 'desarrollo' || lower === 'development') return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
    if (lower === 'ia') return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
    return 'text-brand-blue bg-brand-blue/10 border-brand-blue/20';
  };

  const blogCategories = [
    { label: language === 'es' ? 'Todos' : 'All', value: 'all' },
    { label: language === 'es' ? 'Tecnología' : 'Technology', value: 'tecnologia' },
    { label: 'Inteligencia Artificial (IA)', value: 'ia' },
    { label: language === 'es' ? 'Desarrollo de Software' : 'Software Development', value: 'desarrollo' },
    { label: language === 'es' ? 'Seguridad Digital' : 'Digital Security', value: 'seguridad' }
  ];

  return (
    <div id="blog-view" className="bg-dark-deep pb-16 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-1/4 h-[400px] w-[400px] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none"></div>

      {/* Header section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-6 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <div className="inline-flex max-w-max items-center space-x-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-brand-cyan uppercase">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{language === 'es' ? 'Divulgación Tecnológica' : 'Tech Insights'}</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {language === 'es' ? 'Nuestro ' : 'Our '}<span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent text-glow-cyan">{language === 'es' ? 'Blog' : 'Blog'}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
            {t('blog.subtitle', 'Artículos, tutoriales, novedades y consejos técnicos redactados por nuestro equipo.')}
          </p>
        </div>
      </section>

      {/* Search and Categories bar */}
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Search */}
        <div className="relative flex rounded-2xl border border-white/10 bg-slate-900/30 px-4 py-3 focus-within:border-brand-cyan/40">
          <Search className="h-5 w-5 text-slate-500 shrink-0 self-center mr-3" />
          <input
            type="text"
            placeholder={language === 'es' ? 'Buscar artículos técnicos por palabras clave...' : 'Search technical articles by keywords...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
          {blogCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeCategory === cat.value
                  ? 'bg-brand-cyan text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-slate-500 text-sm">
              {language === 'es' ? 'No encontramos ningún artículo que coincida con tu búsqueda.' : 'No articles found matching your search.'}
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="text-xs text-brand-cyan font-semibold hover:underline"
            >
              {language === 'es' ? 'Restaurar filtros de búsqueda' : 'Reset search filters'}
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {currentPosts.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="glass-panel group rounded-2xl border border-white/5 bg-slate-900/30 overflow-hidden hover:border-brand-cyan/20 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="relative overflow-hidden h-48 border-b border-white/5">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      <span className={`absolute top-3 left-3 rounded-md border px-2 py-0.5 text-[9px] font-semibold uppercase ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center space-x-4 text-[10px] text-slate-500 font-mono">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <h3 className="font-display text-sm sm:text-base font-bold text-white group-hover:text-brand-cyan transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 flex items-center space-x-1 text-xs font-semibold text-brand-cyan group hover:underline">
                    <span>{language === 'es' ? 'Leer artículo' : 'Read article'}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-6">
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-slate-900/30 text-slate-400 hover:text-white hover:border-brand-cyan/20 transition-all ${
                    currentPage === 1 ? 'opacity-40 cursor-not-allowed hover:text-slate-400 hover:border-white/5' : 'cursor-pointer'
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-brand-cyan text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.35)] font-extrabold'
                        : 'border border-white/5 bg-slate-900/30 text-slate-400 hover:text-white hover:border-brand-cyan/10'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-slate-900/30 text-slate-400 hover:text-white hover:border-brand-cyan/20 transition-all ${
                    currentPage === totalPages ? 'opacity-40 cursor-not-allowed hover:text-slate-400 hover:border-white/5' : 'cursor-pointer'
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 px-4 py-10 backdrop-blur-md flex items-start justify-center">
            {/* Clickable backdrop overlay */}
            <div className="absolute inset-0 -z-10" onClick={() => setSelectedPost(null)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-dark-navy p-6 sm:p-8 shadow-2xl space-y-6 my-auto"
            >
              {/* Close button */}
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 rounded-full bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors z-20 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-4">
                <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold uppercase ${getCategoryColor(selectedPost.category)}`}>
                  {selectedPost.category}
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white pr-8">{selectedPost.title}</h2>
                
                <div className="flex items-center space-x-4 text-xs text-slate-500 font-mono">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{selectedPost.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedPost.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Banner */}
              <div className="rounded-2xl overflow-hidden border border-white/5 h-72">
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Long formatted reading content */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                <p className="font-semibold text-white">
                  {selectedPost.summary}
                </p>
                <p>
                  {language === 'es'
                    ? 'En la actualidad, la transformación digital y la integración de herramientas basadas en la nube no representan un extra, sino los cimientos sobre los cuales se sostienen el crecimiento comercial y la seguridad operativa de cualquier organización. En el contexto empresarial de Santa Cruz y de todo el territorio nacional, es cada vez más vital estructurar procesos de tecnología limpios, estables y bien resguardados.'
                    : 'Currently, digital transformation and the integration of cloud-based tools do not represent an extra, but rather the foundation upon which business growth and operational security are built. In the business context of Santa Cruz and nationwide, it is increasingly vital to structure clean, stable, and well-guarded technology processes.'}
                </p>
                <h4 className="font-display text-sm font-bold text-white pt-2">
                  {language === 'es' ? 'Análisis de la problemática actual' : 'Analysis of the current issue'}
                </h4>
                <p>
                  {language === 'es'
                    ? 'Muchos negocios locales operan de forma reactiva, es decir, solo buscan apoyo técnico cuando un servidor de base de datos se quema o cuando son víctimas de un virus de tipo ransomware que secuestra sus archivos confidenciales. El verdadero ahorro comercial radica en la prevención: implementar mantenimientos físicos calendarizados de equipos y estructurar firewalls que filtren accesos sospechosos automáticamente en la red.'
                    : 'Many local businesses operate reactively, meaning they only seek technical support when a database server burns out or when they fall victim to ransomware. True commercial savings lie in prevention: implementing scheduled physical maintenance of equipment and structuring firewalls that automatically filter suspicious network access.'}
                </p>
                <h4 className="font-display text-sm font-bold text-white pt-2">
                  {language === 'es' ? 'Recomendaciones del equipo de ingeniería de Global Service' : 'Recommendations from the Global Service engineering team'}
                </h4>
                <p>
                  1. **{language === 'es' ? 'Respaldos Automáticos' : 'Automatic Backups'}**: {language === 'es' ? 'Mantén siempre una política de copias de seguridad de datos cruzadas (una copia física local y una copia cifrada en servicios en la nube).' : 'Always maintain a cross-backup policy (one physical local copy and one encrypted copy in cloud services).'}
                </p>
                <p>
                  2. **{language === 'es' ? 'Auditorías de Red' : 'Network Audits'}**: {language === 'es' ? 'Revisa periódicamente los logs de acceso de tu red WiFi corporativa y desactiva credenciales antiguas.' : 'Periodically review your corporate WiFi network access logs and deactivate old credentials.'}
                </p>
                <p>
                  3. **{language === 'es' ? 'Capacitación del Personal' : 'Staff Training'}**: {language === 'es' ? 'El eslabón más débil de la ciberseguridad suele ser el factor humano. Realiza charlas breves para evitar phishing en correos dudosos.' : 'The weakest link in cybersecurity is usually the human factor. Conduct short briefings to avoid phishing in suspicious emails.'}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">
                  {language === 'es' ? 'Escrito por: Global Service Editorial' : 'Written by: Global Service Editorial'}
                </span>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  {language === 'es' ? 'Cerrar Artículo' : 'Close Article'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
