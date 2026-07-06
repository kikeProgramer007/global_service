import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  Wrench, 
  Briefcase, 
  BookOpen, 
  Heart, 
  Users, 
  MessageSquare, 
  Image as ImageIcon, 
  Settings, 
  Shield, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Eye, 
  Check, 
  X, 
  Send, 
  Calendar, 
  Clock, 
  TrendingUp,
  Globe, 
  FileUp, 
  Video, 
  Laptop, 
  Brain,
  Filter,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Menu,
  Sun
} from 'lucide-react';
import { useCMS, CMSService, CMSProject, CMSBlogPost, CMSMessage, CMSQuote, CMSMediaItem, CMSTeamMember, UserRole } from '../../context/CMSContext';
import { useLanguage } from '../../context/LanguageContext';
import { ActivePage } from '../../types';
import Pagination from '../Pagination';
import { IMAGES } from '../../assets';

interface AdminViewProps {
  onPageChange?: (page: ActivePage) => void;
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
}

export default function AdminView({ onPageChange, theme = 'dark', onThemeToggle }: AdminViewProps) {
  const { language } = useLanguage();
  const {
    currentUser,
    users,
    services,
    projects,
    blogs,
    messages,
    quotes,
    testimonials,
    mediaItems,
    pageContents,
    categoryPages,
    teamMembers,
    isLoading,
    isConnected,
    apiError,
    dashboardStats,
    
    login,
    logout,
    addUser,
    deleteUser,
    updatePageContents,
    updateCategoryPage,
    uploadImage,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    
    addService,
    updateService,
    deleteService,
    
    addProject,
    updateProject,
    deleteProject,
    
    addBlog,
    updateBlog,
    deleteBlog,
    
    updateMessageStatus,
    updateQuoteStatus,
    
    addMediaItem,
    deleteMediaItem
  } = useCMS();

  // Navigation states
  const [activeTab, setActiveTab] = useState<'inicio' | 'paginas' | 'servicios' | 'portafolio' | 'blog' | 'formularios' | 'galeria' | 'config' | 'usuarios'>('inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Login State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showLoginError, setShowLoginError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sub-tabs for forms
  const [formSubTab, setFormSubTab] = useState<'mensajes' | 'cotizaciones'>('mensajes');
  const [pageEditTab, setPageEditTab] = useState<'home' | 'nosotros' | 'contacto' | 'equipo'>('home');
  const [servicesPage, setServicesPage] = useState(1);
  const servicesPerPage = 10;
  const [serviceImageFile, setServiceImageFile] = useState<File | null>(null);

  // Modal / Editing states
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<CMSService | null>(null);
  const [serviceFormData, setServiceFormData] = useState({
    titleEs: '',
    titleEn: '',
    category: 'servicio-tecnico' as CMSService['category'],
    descShortEs: '',
    descShortEn: '',
    descLongEs: '',
    descLongEn: '',
    iconName: 'Laptop',
    image: '',
    gallery: [] as string[],
    benefitsEs: [] as string[],
    benefitsEn: [] as string[],
    processEs: [] as string[],
    processEn: [] as string[],
    status: 'active' as CMSService['status'],
    order: 1
  });

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<CMSProject | null>(null);
  const [projectFormData, setProjectFormData] = useState({
    titleEs: '',
    titleEn: '',
    category: 'software' as CMSProject['category'],
    client: '',
    descriptionEs: '',
    descriptionEn: '',
    image: '',
    gallery: [] as string[],
    tech: [] as string[],
    demoUrl: '',
    videoUrl: '',
    status: 'publicado' as CMSProject['status']
  });

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<CMSBlogPost | null>(null);
  const [blogFormData, setBlogFormData] = useState({
    titleEs: '',
    titleEn: '',
    slug: '',
    categoryEs: '',
    categoryEn: '',
    image: '',
    summaryEs: '',
    summaryEn: '',
    contentEs: '',
    contentEn: '',
    author: '',
    status: 'publicado' as CMSBlogPost['status']
  });

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaFormData, setMediaFormData] = useState({
    file: null as File | null,
    useCase: ''
  });

  // User list modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUserFormData, setNewUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor' as UserRole
  });

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<CMSTeamMember | null>(null);
  const [teamImageFile, setTeamImageFile] = useState<File | null>(null);
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    roleEs: '',
    roleEn: '',
    bioEs: '',
    bioEn: '',
    image: '',
    status: 'active' as CMSTeamMember['status'],
    order: 1
  });

  // Page contents editing state
  const [homePageData, setHomePageData] = useState({ ...pageContents.home });
  const [nosotrosPageData, setNosotrosPageData] = useState({ ...pageContents.nosotros });
  const [contactoPageData, setContactoPageData] = useState({ ...pageContents.contacto });

  const handlePageContentSave = async (page: 'home' | 'nosotros' | 'contacto') => {
    try {
      if (page === 'home') {
        await updatePageContents('home', homePageData);
      } else if (page === 'nosotros') {
        await updatePageContents('nosotros', nosotrosPageData);
      } else if (page === 'contacto') {
        await updatePageContents('contacto', contactoPageData);
      }
      alert('¡Página guardada exitosamente!');
    } catch {
      alert('Error al guardar la página. Verifica la conexión con el servidor.');
    }
  };

  // Helper lists
  const availableIcons = ['Laptop', 'Code', 'Brain', 'ShieldCheck', 'Briefcase', 'ShoppingCart', 'Wrench', 'CheckCircle'];

  // Handle Logins
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) return;
    setIsLoggingIn(true);
    const success = await login(emailInput.trim(), passwordInput);
    setIsLoggingIn(false);
    if (!success) {
      setShowLoginError(true);
    } else {
      setShowLoginError(false);
      setHomePageData({ ...pageContents.home });
      setNosotrosPageData({ ...pageContents.nosotros });
      setContactoPageData({ ...pageContents.contacto });
    }
  };

  // 1. SERVICES MODAL HANDLERS
  const openServiceModal = (service: CMSService | null = null) => {
    setServiceImageFile(null);
    if (service) {
      setEditingService(service);
      setServiceFormData({
        titleEs: service.titleEs,
        titleEn: service.titleEn,
        category: service.category,
        descShortEs: service.descShortEs,
        descShortEn: service.descShortEn,
        descLongEs: service.descLongEs,
        descLongEn: service.descLongEn,
        iconName: service.iconName,
        image: service.image,
        gallery: service.gallery || [],
        benefitsEs: service.benefitsEs || [],
        benefitsEn: service.benefitsEn || [],
        processEs: service.processEs || [],
        processEn: service.processEn || [],
        status: service.status,
        order: service.order
      });
    } else {
      setEditingService(null);
      setServiceFormData({
        titleEs: '',
        titleEn: '',
        category: 'servicio-tecnico',
        descShortEs: '',
        descShortEn: '',
        descLongEs: '',
        descLongEn: '',
        iconName: 'Laptop',
        image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=600',
        gallery: [],
        benefitsEs: ['Garantía escrita de 90 días', 'Diagnóstico gratuito'],
        benefitsEn: ['90-day written warranty', 'Free diagnostics'],
        processEs: ['Recepción', 'Diagnóstico', 'Aprobación', 'Reparación'],
        processEn: ['Intake', 'Diagnostic', 'Approval', 'Repair'],
        status: 'active',
        order: services.length + 1
      });
    }
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = serviceFormData.image;
      if (serviceImageFile) {
        imageUrl = await uploadImage(serviceImageFile);
      }
      const payload = { ...serviceFormData, image: imageUrl };
      if (editingService) {
        await updateService(editingService.id, payload);
      } else {
        await addService(payload);
      }
      setIsServiceModalOpen(false);
      setServiceImageFile(null);
    } catch {
      alert('Error al guardar el servicio.');
    }
  };

  // 2. PROJECTS MODAL HANDLERS
  const openProjectModal = (project: CMSProject | null = null) => {
    if (project) {
      setEditingProject(project);
      setProjectFormData({
        titleEs: project.titleEs,
        titleEn: project.titleEn,
        category: project.category,
        client: project.client,
        descriptionEs: project.descriptionEs,
        descriptionEn: project.descriptionEn,
        image: project.image,
        gallery: project.gallery || [],
        tech: project.tech || [],
        demoUrl: project.demoUrl || '',
        videoUrl: project.videoUrl || '',
        status: project.status
      });
    } else {
      setEditingProject(null);
      setProjectFormData({
        titleEs: '',
        titleEn: '',
        category: 'software',
        client: '',
        descriptionEs: '',
        descriptionEn: '',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
        gallery: [],
        tech: ['React', 'Node.js', 'Tailwind'],
        demoUrl: '',
        videoUrl: '',
        status: 'publicado'
      });
    }
    setIsProjectModalOpen(true);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectFormData);
      } else {
        await addProject(projectFormData);
      }
      setIsProjectModalOpen(false);
    } catch {
      alert('Error al guardar el proyecto.');
    }
  };

  // 3. BLOGS MODAL HANDLERS
  const openBlogModal = (blog: CMSBlogPost | null = null) => {
    if (blog) {
      setEditingBlog(blog);
      setBlogFormData({
        titleEs: blog.titleEs,
        titleEn: blog.titleEn,
        slug: blog.slug,
        categoryEs: blog.categoryEs,
        categoryEn: blog.categoryEn,
        image: blog.image,
        summaryEs: blog.summaryEs,
        summaryEn: blog.summaryEn,
        contentEs: blog.contentEs,
        contentEn: blog.contentEn,
        author: blog.author,
        status: blog.status
      });
    } else {
      setEditingBlog(null);
      setBlogFormData({
        titleEs: '',
        titleEn: '',
        slug: '',
        categoryEs: 'Soporte',
        categoryEn: 'Support',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
        summaryEs: '',
        summaryEn: '',
        contentEs: '',
        contentEn: '',
        author: currentUser?.name || 'Administrador',
        status: 'publicado'
      });
    }
    setIsBlogModalOpen(true);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = blogFormData.slug || blogFormData.titleEs.toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');
      
    const data = {
      ...blogFormData,
      slug,
      dateEs: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      dateEn: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTimeEs: '5 min de lectura',
      readTimeEn: '5 min read'
    };

    try {
      if (editingBlog) {
        await updateBlog(editingBlog.id, data);
      } else {
        await addBlog(data);
      }
      setIsBlogModalOpen(false);
    } catch {
      alert('Error al guardar el artículo.');
    }
  };

  // 4. MEDIA SUBMIT HANDLER
  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFormData.file) return;
    try {
      await addMediaItem(mediaFormData.file, mediaFormData.useCase || 'Biblioteca General');
      setIsMediaModalOpen(false);
      setMediaFormData({ file: null, useCase: '' });
    } catch {
      alert('Error al subir el archivo.');
    }
  };

  // 5. USER ADD SUBMIT HANDLER
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserFormData.email || !newUserFormData.password) return;
    try {
      await addUser({
        name: newUserFormData.name || newUserFormData.email.split('@')[0],
        email: newUserFormData.email,
        password: newUserFormData.password,
        role: newUserFormData.role,
      });
      setIsUserModalOpen(false);
      setNewUserFormData({ name: '', email: '', password: '', role: 'editor' });
    } catch {
      alert('Error al crear el usuario.');
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = teamFormData.image;
      if (teamImageFile) {
        imageUrl = await uploadImage(teamImageFile);
      }
      const payload = { ...teamFormData, image: imageUrl };
      if (editingTeamMember) {
        await updateTeamMember(editingTeamMember.id, payload);
      } else {
        await addTeamMember(payload);
      }
      setIsTeamModalOpen(false);
      setTeamImageFile(null);
    } catch {
      alert('Error al guardar miembro del equipo.');
    }
  };

  const openTeamModal = (member: CMSTeamMember | null = null) => {
    setTeamImageFile(null);
    if (member) {
      setEditingTeamMember(member);
      setTeamFormData({
        name: member.name,
        roleEs: member.roleEs,
        roleEn: member.roleEn,
        bioEs: member.bioEs,
        bioEn: member.bioEn,
        image: member.image,
        status: member.status,
        order: member.order
      });
    } else {
      setEditingTeamMember(null);
      setTeamFormData({
        name: '',
        roleEs: '',
        roleEn: '',
        bioEs: '',
        bioEn: '',
        image: IMAGES.teamLeader,
        status: 'active',
        order: teamMembers.length + 1
      });
    }
    setIsTeamModalOpen(true);
  };

  const filteredServices = services.filter(s => s.titleEs.toLowerCase().includes(searchQuery.toLowerCase()));
  const servicesTotalPages = Math.max(1, Math.ceil(filteredServices.length / servicesPerPage));
  const paginatedServices = filteredServices.slice(
    (servicesPage - 1) * servicesPerPage,
    servicesPage * servicesPerPage
  );

  // NOT LOGGED IN VIEW: Render Beautiful CMS login portal
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-950 text-white font-sans">
        <div className="absolute inset-0 bg-radial-gradient from-brand-cyan/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl relative z-10"
        >
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2.5 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-cyan to-brand-blue shadow-lg shadow-brand-cyan/20">
              <Shield className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <h2 className="font-display text-lg font-black tracking-wider text-white">GLOBAL <span className="text-brand-cyan">SERVICE</span></h2>
              <p className="font-mono text-[9px] tracking-widest text-slate-500 uppercase">Panel de Control CMS</p>
            </div>
          </div>

          <div className="text-center space-y-1.5 mb-6">
            <h3 className="text-xl font-bold tracking-tight">Acceso Administrativo</h3>
            <p className="text-xs text-slate-400">Inicia sesión para gestionar el contenido dinámico del sitio web.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Correo electrónico</label>
              <input 
                type="email" 
                placeholder="admin@globalservice.bo" 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/15 bg-slate-950 text-white text-xs outline-none focus:border-brand-cyan/60 focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/15 bg-slate-950 text-white text-xs outline-none focus:border-brand-cyan/60 focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all"
                required
              />
            </div>

            {showLoginError && (
              <p className="text-xs text-red-400 font-mono flex items-center space-x-1.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{apiError || 'Credenciales incorrectas. Intenta nuevamente.'}</span>
              </p>
            )}

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:brightness-110 active:scale-[0.98] shadow-lg shadow-brand-cyan/15 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 space-y-2 text-[11px] text-slate-500 font-mono leading-relaxed">
            <p className="text-slate-400 font-bold">Credenciales de prueba:</p>
            <p>• Email: <span className="text-brand-cyan">admin@globalservice.bo</span></p>
            <p>• Contraseña: <span className="text-brand-cyan">admin123.</span></p>
            {!isConnected && (
              <p className="text-amber-400 mt-2">⚠ Backend no disponible. Inicia el servidor en el puerto 4000.</p>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans select-none relative">
      
      {/* Mobile Sidebar Backdrop/Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 md:hidden transition-opacity duration-300" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* SIDEBAR NAVIGATION PANEL */}
      <aside 
        className={`bg-slate-900 border-r border-white/5 shrink-0 transition-all duration-300 z-30 flex flex-col justify-between ${
          isSidebarOpen 
            ? 'w-64 max-md:fixed max-md:top-0 max-md:left-0 max-md:bottom-0 max-md:h-full' 
            : 'w-0 md:w-20 overflow-hidden'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="h-20 border-b border-white/5 px-6 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-brand-cyan to-brand-blue shadow-md">
                <Shield className="h-4.5 w-4.5 text-slate-950" />
              </div>
              {isSidebarOpen && (
                <div>
                  <h3 className="font-display text-sm font-black tracking-wider text-white">GLOBAL <span className="text-brand-cyan">SERVICE</span></h3>
                  <p className="text-[8px] font-mono tracking-widest text-slate-500 uppercase">Administrador</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-400 hover:text-white md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1 flex-1">
            {[
              { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
              { id: 'paginas', label: 'Páginas', icon: FileText },
              { id: 'servicios', label: 'Servicios', icon: Wrench },
              { id: 'portafolio', label: 'Portafolio', icon: Briefcase },
              { id: 'blog', label: 'Blog', icon: BookOpen },
              { id: 'formularios', label: 'Formularios', icon: MessageSquare, badge: messages.filter(m => m.status === 'nuevo').length + quotes.filter(q => q.status === 'nuevo').length },
              { id: 'galeria', label: 'Galería', icon: ImageIcon },
              { id: 'usuarios', label: 'Usuarios', icon: Users },
            ].map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-brand-cyan text-slate-950 shadow-md shadow-brand-cyan/10' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <IconComponent className="h-4 w-4 shrink-0" />
                  {isSidebarOpen && (
                    <span className="ml-3 flex-1 text-left">{item.label}</span>
                  )}
                  {isSidebarOpen && item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${isActive ? 'bg-slate-950 text-brand-cyan' : 'bg-brand-cyan/20 text-brand-cyan'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile bottom */}
        <div className="p-4 border-t border-white/5 bg-slate-900/40">
          <div className="flex items-center space-x-3">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="h-10 w-10 rounded-xl border border-white/10"
            />
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-brand-cyan uppercase font-mono font-bold tracking-wider truncate">{currentUser.role}</p>
              </div>
            )}
            {isSidebarOpen && (
              <button 
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 cursor-pointer"
                title="Cerrar Sesión"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE WRAPPER */}
      <div className="flex-1 flex flex-col overflow-y-auto min-h-screen">
        
        {/* TOP STATUS HEADER BAR */}
        <header className="h-20 border-b border-white/5 px-6 md:px-8 flex items-center justify-between shrink-0 bg-slate-900/30 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-white capitalize">{activeTab}</h2>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Módulo de Administración</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Back to Site Link */}
            <a 
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (onPageChange) {
                  onPageChange(ActivePage.Home);
                } else {
                  window.location.reload(); // Reload triggers back to homepage of standard view
                }
              }}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300 hover:text-brand-cyan hover:border-brand-cyan/30 transition-all cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-brand-cyan animate-pulse" />
              <span>Ver Web Pública</span>
            </a>

            <div className="h-8 w-[1px] bg-white/5 hidden sm:block"></div>

            <span className="font-mono text-xs text-slate-400">
              {new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>

            {onThemeToggle && (
              <>
                <div className="h-8 w-[1px] bg-white/5"></div>
                <button
                  onClick={onThemeToggle}
                  className={`flex h-8 items-center space-x-2 rounded-full border px-2.5 py-1 transition-all duration-300 cursor-pointer ${
                    theme === 'light' 
                      ? 'border-slate-200 bg-white shadow-sm hover:border-brand-blue/30 text-slate-800' 
                      : 'border-white/10 bg-slate-950/40 hover:border-brand-cyan/30 text-white'
                  }`}
                  title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
                >
                  <Sun className={`h-4 w-4 ${theme === 'light' ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                  <div className={`h-4 w-[1px] ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
                  <div className={`relative h-4.5 w-8 rounded-full transition-all duration-300 p-0.5 ${theme === 'light' ? 'bg-amber-100 border border-amber-200' : 'bg-slate-800'}`}>
                    <div className={`h-3 w-3 rounded-full transition-all duration-300 ${theme === 'light' ? 'bg-amber-500 translate-x-3.5' : 'bg-slate-500 translate-x-0'}`} />
                  </div>
                </button>
              </>
            )}
          </div>
        </header>

        {/* WORKSPACE CONTENT BODY */}
        <main className="flex-1 p-6 md:p-8 space-y-6">

          {/* ==================================================================== */}
          {/* TAB 1: INICIO (DASHBOARD HIGHLIGHTS) */}
          {/* ==================================================================== */}
          {activeTab === 'inicio' && (
            <div className="space-y-6">
              
              {/* Intro Banner */}
              <div className="p-6 rounded-3xl border border-brand-cyan/20 bg-gradient-to-r from-brand-cyan/5 to-transparent relative overflow-hidden">
                <div className="relative z-10 space-y-1">
                  <h1 className="font-display text-xl font-bold text-white">¡Hola de nuevo, {currentUser.name}!</h1>
                  <p className="text-xs text-slate-400">Bienvenido al CMS de Global Service. Aquí tienes un resumen del estado de tu sitio web.</p>
                </div>
              </div>

              {/* Statistics Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { title: 'Páginas activas', value: 3, label: 'En edición', color: 'text-brand-cyan', bg: 'bg-brand-cyan/5' },
                  { title: 'Servicios', value: services.length, label: `${services.filter(s => s.status === 'inactive').length} inactivos`, color: 'text-green-400', bg: 'bg-green-500/5' },
                  { title: 'Proyectos', value: projects.length, label: `${projects.filter(p => p.status === 'borrador').length} borradores`, color: 'text-purple-400', bg: 'bg-purple-500/5' },
                  { title: 'Blogs publicados', value: blogs.length, label: `${blogs.filter(b => b.status === 'borrador').length} borradores`, color: 'text-orange-400', bg: 'bg-orange-500/5' },
                  { title: 'Mensajes totales', value: messages.length + quotes.length, label: `${messages.filter(m => m.status === 'nuevo').length + quotes.filter(q => q.status === 'nuevo').length} sin leer`, color: 'text-cyan-400', bg: 'bg-cyan-500/5' }
                ].map((stat, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-white/5 bg-slate-900/40 space-y-2 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{stat.title}</span>
                    <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
                    <span className="text-[10px] text-slate-500">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Graphical Site Activity Simulation & Recent Forms */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Traffic Activity Graph Widget */}
                <div className="lg:col-span-2 p-6 rounded-3xl border border-white/5 bg-slate-900/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Tránsito de Visitas Estimado</h3>
                      <p className="text-[10px] text-slate-500 font-mono">Últimos 7 días en el sitio</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 font-mono text-[10px] font-bold flex items-center space-x-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>+24.5%</span>
                    </span>
                  </div>

                  {/* SVG Pure Chart */}
                  <div className="h-48 w-full relative pt-4 flex items-end">
                    <svg className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0%" y1="0%" x2="100%" y2="0%" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="0%" y1="33%" x2="100%" y2="33%" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="0%" y1="66%" x2="100%" y2="66%" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      
                      {/* Area Area */}
                      <path 
                        d="M0,160 L15%,110 L30%,130 L45%,70 L60%,90 L75%,30 L100%,10 L100%,190 L0,190 Z" 
                        fill="url(#chartGrad)" 
                      />
                      
                      {/* Line Line */}
                      <path 
                        d="M0,160 L15%,110 L30%,130 L45%,70 L60%,90 L75%,30 L100%,10" 
                        fill="none" 
                        stroke="#00f0ff" 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                      />
                    </svg>

                    {/* Chart labels bottom */}
                    <div className="w-full flex justify-between text-[9px] font-mono text-slate-500 z-10">
                      <span>Lunes</span>
                      <span>Martes</span>
                      <span>Miércoles</span>
                      <span>Jueves</span>
                      <span>Viernes</span>
                      <span>Sábado</span>
                      <span>Domingo</span>
                    </div>
                  </div>
                </div>

                {/* Form messages summary list widget */}
                <div className="p-6 rounded-3xl border border-white/5 bg-slate-900/20 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">Últimos Formularios</h3>
                      <button 
                        onClick={() => setActiveTab('formularios')}
                        className="text-[10px] font-bold font-mono text-brand-cyan uppercase hover:underline"
                      >
                        Ver todos
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {messages.slice(0, 3).map((m) => (
                        <div key={m.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white truncate max-w-[120px]">{m.name}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                              m.status === 'nuevo' ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-slate-800 text-slate-400'
                            }`}>{m.status}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{m.message}</p>
                          <span className="text-[8px] text-slate-500 font-mono text-right">{new Date(m.date).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================== */}
          {/* TAB 2: EDITING PAGES CONFIGURATION (PÁGINAS CMS) */}
          {/* ==================================================================== */}
          {activeTab === 'paginas' && (
            <div className="space-y-6">
              
              {/* Pages Subtabs */}
              <div className="flex items-center space-x-2.5 border-b border-white/5 pb-4">
                {[
                  { id: 'home', label: 'Inicio (Home)' },
                  { id: 'nosotros', label: 'Nosotros' },
                  { id: 'equipo', label: 'Equipo' },
                  { id: 'contacto', label: 'Contacto' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setPageEditTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      pageEditTab === tab.id
                        ? 'bg-brand-cyan text-slate-950 border-brand-cyan shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                        : 'bg-slate-900/30 text-slate-400 border-white/5 hover:border-brand-cyan/20 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 2A: EDIT HOME PAGE */}
              {pageEditTab === 'home' && (
                <div className="p-6 rounded-3xl border border-white/5 bg-slate-900/20 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-sm font-bold text-white">Editar Secciones de Inicio</h3>
                    <button 
                      onClick={() => handlePageContentSave('home')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 text-xs font-bold cursor-pointer hover:brightness-110 transition-all"
                    >
                      Guardar Cambios
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Título Principal (Hero)</label>
                      <input 
                        type="text" 
                        value={homePageData.heroTitleEs}
                        onChange={(e) => setHomePageData(prev => ({ ...prev, heroTitleEs: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:border-brand-cyan/60"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Subtítulo de Portada</label>
                      <textarea 
                        rows={3}
                        value={homePageData.heroSubtitleEs}
                        onChange={(e) => setHomePageData(prev => ({ ...prev, heroSubtitleEs: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:border-brand-cyan/60 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Métrica: Experiencia</label>
                      <input 
                        type="text" 
                        value={homePageData.statsExperience}
                        onChange={(e) => setHomePageData(prev => ({ ...prev, statsExperience: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:border-brand-cyan/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Métrica: Calificación</label>
                      <input 
                        type="text" 
                        value={homePageData.statsRating}
                        onChange={(e) => setHomePageData(prev => ({ ...prev, statsRating: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:border-brand-cyan/60"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2B: EDIT NOSOTROS PAGE */}
              {pageEditTab === 'nosotros' && (
                <div className="p-6 rounded-3xl border border-white/5 bg-slate-900/20 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-sm font-bold text-white">Editar Secciones de Nosotros</h3>
                    <button 
                      onClick={() => handlePageContentSave('nosotros')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 text-xs font-bold cursor-pointer hover:brightness-110 transition-all"
                    >
                      Guardar Cambios
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Título de la Historia</label>
                      <input 
                        type="text" 
                        value={nosotrosPageData.storyTitleEs}
                        onChange={(e) => setNosotrosPageData(prev => ({ ...prev, storyTitleEs: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:border-brand-cyan/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Historia Corporativa</label>
                      <textarea 
                        rows={4}
                        value={nosotrosPageData.storyTextEs}
                        onChange={(e) => setNosotrosPageData(prev => ({ ...prev, storyTextEs: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:border-brand-cyan/60 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Misión</label>
                      <textarea 
                        rows={3}
                        value={nosotrosPageData.missionTextEs}
                        onChange={(e) => setNosotrosPageData(prev => ({ ...prev, missionTextEs: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:border-brand-cyan/60 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Visión</label>
                      <textarea 
                        rows={3}
                        value={nosotrosPageData.visionTextEs}
                        onChange={(e) => setNosotrosPageData(prev => ({ ...prev, visionTextEs: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:border-brand-cyan/60 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2C: EDIT CONTACT PAGE */}
              {pageEditTab === 'contacto' && (
                <div className="p-6 rounded-3xl border border-white/5 bg-slate-900/20 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-sm font-bold text-white">Editar Datos de Contacto y Horarios</h3>
                    <button 
                      onClick={() => handlePageContentSave('contacto')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 text-xs font-bold cursor-pointer hover:brightness-110 transition-all"
                    >
                      Guardar Cambios
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Teléfono Directo</label>
                      <input 
                        type="text" 
                        value={contactoPageData.phone}
                        onChange={(e) => setContactoPageData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:border-brand-cyan/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">WhatsApp Oficial</label>
                      <input 
                        type="text" 
                        value={contactoPageData.whatsapp}
                        onChange={(e) => setContactoPageData(prev => ({ ...prev, whatsapp: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:border-brand-cyan/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Correo Electrónico Corporativo</label>
                      <input 
                        type="email" 
                        value={contactoPageData.email}
                        onChange={(e) => setContactoPageData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:border-brand-cyan/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Horario de Atención (Español)</label>
                      <input 
                        type="text" 
                        value={contactoPageData.hoursEs}
                        onChange={(e) => setContactoPageData(prev => ({ ...prev, hoursEs: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:border-brand-cyan/60"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Dirección Física Completa</label>
                      <input 
                        type="text" 
                        value={contactoPageData.addressEs}
                        onChange={(e) => setContactoPageData(prev => ({ ...prev, addressEs: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:border-brand-cyan/60"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2D: TEAM MANAGEMENT */}
              {pageEditTab === 'equipo' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-sm font-bold text-white">Gestionar Nuestro Equipo</h3>
                    <button
                      onClick={() => openTeamModal(null)}
                      className="px-4 py-2 rounded-xl bg-brand-cyan text-slate-950 text-xs font-bold cursor-pointer hover:brightness-110 transition-all flex items-center space-x-1.5"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agregar Miembro</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamMembers.map((m) => (
                      <div key={m.id} className="p-4 rounded-2xl border border-white/5 bg-slate-900/20 flex gap-4">
                        <img src={m.image} alt={m.name} className="h-16 w-16 rounded-xl object-cover border border-white/10 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{m.name}</h4>
                          <p className="text-[10px] text-brand-cyan font-mono truncate">{m.roleEs}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{m.bioEs}</p>
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => openTeamModal(m)} className="text-[10px] text-brand-cyan hover:underline cursor-pointer">Editar</button>
                            <button
                              onClick={() => { if (confirm('¿Eliminar miembro?')) deleteTeamMember(m.id); }}
                              className="text-[10px] text-red-400 hover:underline cursor-pointer"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================================== */}
          {/* TAB 3: SERVICIOS MANAGEMENT (CRUD) */}
          {/* ==================================================================== */}
          {activeTab === 'servicios' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Buscar servicios..." 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setServicesPage(1); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs outline-none focus:border-brand-cyan/60"
                  />
                </div>

                <button 
                  onClick={() => openServiceModal(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-cyan text-slate-950 text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-md shadow-brand-cyan/15"
                >
                  <Plus className="h-4 w-4 stroke-[3px]" />
                  <span>Nuevo Servicio</span>
                </button>
              </div>

              {/* Table List of Services */}
              <div className="rounded-2xl border border-white/5 bg-slate-900/10 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-900/40 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      <th className="p-4">Servicio</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">Orden</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                    {services
                      .filter(s => s.titleEs.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice((servicesPage - 1) * servicesPerPage, servicesPage * servicesPerPage)
                      .map((s) => (
                        <tr key={s.id} className="hover:bg-white/[0.02] transition-all">
                          <td className="p-4 font-bold text-white flex items-center space-x-3">
                            <img src={s.image} alt="" className="h-8 w-8 rounded-lg object-cover border border-white/10 shrink-0" />
                            <span>{s.titleEs}</span>
                          </td>
                          <td className="p-4 capitalize font-mono text-[10px] text-slate-400">
                            {s.category.replace('-', ' ')}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                              s.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>{s.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                          </td>
                          <td className="p-4 font-mono text-slate-400">{s.order}</td>
                          <td className="p-4 text-right space-x-1.5">
                            <button 
                              onClick={() => openServiceModal(s)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-cyan hover:bg-white/5 cursor-pointer"
                              title="Editar"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm('¿Estás seguro de eliminar este servicio?')) deleteService(s.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={servicesPage}
                totalPages={servicesTotalPages}
                onPageChange={setServicesPage}
              />
            </div>
          )}

          {/* ==================================================================== */}
          {/* TAB 4: PORTAFOLIO MANAGEMENT (CRUD) */}
          {/* ==================================================================== */}
          {activeTab === 'portafolio' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Buscar proyectos..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs outline-none focus:border-brand-cyan/60"
                  />
                </div>

                <button 
                  onClick={() => openProjectModal(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-cyan text-slate-950 text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-md shadow-brand-cyan/15"
                >
                  <Plus className="h-4 w-4 stroke-[3px]" />
                  <span>Nuevo Proyecto</span>
                </button>
              </div>

              {/* Table List of Projects */}
              <div className="rounded-2xl border border-white/5 bg-slate-900/10 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-900/40 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      <th className="p-4">Proyecto</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                    {projects
                      .filter(p => p.titleEs.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.02] transition-all">
                          <td className="p-4 font-bold text-white flex items-center space-x-3">
                            <img src={p.image} alt="" className="h-8 w-8 rounded-lg object-cover border border-white/10 shrink-0" />
                            <span>{p.titleEs}</span>
                          </td>
                          <td className="p-4 capitalize font-mono text-[10px] text-slate-400">
                            {p.category}
                          </td>
                          <td className="p-4 text-slate-400">{p.client}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                              p.status === 'publicado' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
                            }`}>{p.status}</span>
                          </td>
                          <td className="p-4 text-right space-x-1.5">
                            <button 
                              onClick={() => openProjectModal(p)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-cyan hover:bg-white/5 cursor-pointer"
                              title="Editar"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm('¿Estás seguro de eliminar este proyecto del portafolio?')) deleteProject(p.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================================== */}
          {/* TAB 5: BLOG ARTICLES MANAGEMENT (CRUD) */}
          {/* ==================================================================== */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Buscar artículos..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs outline-none focus:border-brand-cyan/60"
                  />
                </div>

                <button 
                  onClick={() => openBlogModal(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-cyan text-slate-950 text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-md shadow-brand-cyan/15"
                >
                  <Plus className="h-4 w-4 stroke-[3px]" />
                  <span>Nuevo Artículo</span>
                </button>
              </div>

              {/* Table List of Blog Posts */}
              <div className="rounded-2xl border border-white/5 bg-slate-900/10 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-900/40 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      <th className="p-4">Título</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Autor</th>
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                    {blogs
                      .filter(b => b.titleEs.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition-all">
                          <td className="p-4 font-bold text-white flex items-center space-x-3">
                            <img src={b.image} alt="" className="h-8 w-8 rounded-lg object-cover border border-white/10 shrink-0" />
                            <span className="truncate max-w-[200px]">{b.titleEs}</span>
                          </td>
                          <td className="p-4 font-mono text-[10px] text-slate-400">
                            {b.categoryEs}
                          </td>
                          <td className="p-4 text-slate-400">{b.author}</td>
                          <td className="p-4 font-mono text-[10px] text-slate-500">{b.dateEs}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                              b.status === 'publicado' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
                            }`}>{b.status}</span>
                          </td>
                          <td className="p-4 text-right space-x-1.5">
                            <button 
                              onClick={() => openBlogModal(b)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-cyan hover:bg-white/5 cursor-pointer"
                              title="Editar"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm('¿Estás seguro de eliminar este artículo del blog?')) deleteBlog(b.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================================== */}
          {/* TAB 6: FORM SUBMISSIONS (MESSAGES & QUOTES) */}
          {/* ==================================================================== */}
          {activeTab === 'formularios' && (
            <div className="space-y-6">
              
              {/* Form categories toggle */}
              <div className="flex items-center space-x-2.5 border-b border-white/5 pb-4">
                {[
                  { id: 'mensajes', label: `Mensajes de Contacto (${messages.length})` },
                  { id: 'cotizaciones', label: `Cotizaciones Solicitadas (${quotes.length})` }
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setFormSubTab(sub.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      formSubTab === sub.id
                        ? 'bg-brand-cyan text-slate-950 border-brand-cyan shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                        : 'bg-slate-900/30 text-slate-400 border-white/5 hover:border-brand-cyan/20 hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* 6A. MESSAGES LOG */}
              {formSubTab === 'mensajes' && (
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div key={m.id} className="p-5 rounded-2xl border border-white/5 bg-slate-900/20 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-white">{m.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">{m.email} | Cel: {m.phone}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] text-slate-500 font-mono">{new Date(m.date).toLocaleString()}</span>
                          <select 
                            value={m.status}
                            onChange={(e) => updateMessageStatus(m.id, e.target.value as any)}
                            className="px-2 py-1 rounded bg-slate-950 text-white border border-white/10 text-[10px] outline-none font-bold cursor-pointer focus:border-brand-cyan/40"
                          >
                            <option value="nuevo">Nuevo</option>
                            <option value="contactado">Contactado</option>
                            <option value="cerrado">Cerrado</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <p className="font-bold text-brand-cyan font-mono text-[10px] uppercase">Mensaje:</p>
                        <p className="text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-white/5 leading-relaxed">{m.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 6B. INTERACTIVE QUOTES LOG */}
              {formSubTab === 'cotizaciones' && (
                <div className="space-y-4">
                  {quotes.map((q) => (
                    <div key={q.id} className="p-5 rounded-2xl border border-white/5 bg-slate-900/20 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-white">{q.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">{q.email} | Cel: {q.phone}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono font-bold text-brand-cyan">Cost: ${q.approxCost} USD</span>
                          <span className="text-[9px] text-slate-500 font-mono">{new Date(q.date).toLocaleString()}</span>
                          <select 
                            value={q.status}
                            onChange={(e) => updateQuoteStatus(q.id, e.target.value as any)}
                            className="px-2 py-1 rounded bg-slate-950 text-white border border-white/10 text-[10px] outline-none font-bold cursor-pointer focus:border-brand-cyan/40"
                          >
                            <option value="nuevo">Nuevo</option>
                            <option value="contactado">Contactado</option>
                            <option value="cerrado">Cerrado</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div>
                          <p className="text-[10px] uppercase text-slate-500">Solución técnica:</p>
                          <p className="text-white font-sans font-bold capitalize">{q.solutionType.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-slate-500">Módulos Solicitados:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {q.features.map((f, idx) => (
                              <span key={idx} className="bg-white/5 border border-white/5 text-[9px] text-slate-300 px-2 py-0.5 rounded">
                                {f.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>

                        {q.notes && (
                          <div className="md:col-span-2 pt-2 border-t border-white/5">
                            <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Notas del cliente:</p>
                            <p className="text-slate-300 font-sans leading-relaxed">{q.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================================================================== */}
          {/* TAB 7: MEDIA GALLERY / MULTIMEDIA */}
          {/* ==================================================================== */}
          {activeTab === 'galeria' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
                <p className="text-xs text-slate-400">Biblioteca de archivos, imágenes de banners, logotipos y PDFs.</p>
                
                <button 
                  onClick={() => setIsMediaModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-cyan text-slate-950 text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-md shadow-brand-cyan/15"
                >
                  <FileUp className="h-4 w-4" />
                  <span>Subir Archivo</span>
                </button>
              </div>

              {/* Grid of media items */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {mediaItems.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/5 bg-slate-900/20 overflow-hidden flex flex-col justify-between group relative">
                    <div className="aspect-square w-full bg-slate-950 relative flex items-center justify-center">
                      {item.type === 'image' ? (
                        <img src={item.url} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" />
                      ) : (
                        <div className="text-center space-y-2">
                          <FileText className="h-8 w-8 mx-auto text-brand-cyan" />
                          <span className="text-[10px] text-slate-400 font-mono">{item.name.split('.').pop()?.toUpperCase()}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-slate-900 space-y-1">
                      <p className="text-[10px] font-bold text-white truncate">{item.name}</p>
                      <div className="flex justify-between items-center text-[8px] font-mono text-slate-500">
                        <span>{item.size}</span>
                        <span className="truncate max-w-[80px]">{item.useCase}</span>
                      </div>
                    </div>

                    {/* Delete overlay */}
                    <button 
                      onClick={() => {
                        if (confirm('¿Eliminar este archivo de la galería?')) deleteMediaItem(item.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 hover:bg-red-500 hover:text-white text-slate-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg"
                      title="Eliminar archivo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================================== */}
          {/* TAB 8: USUARIOS MANAGEMENT */}
          {/* ==================================================================== */}
          {activeTab === 'usuarios' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Gestión de Personal y Cuentas</h3>
                  <p className="text-xs text-slate-400">Control de usuarios con privilegios de edición.</p>
                </div>
                
                <button 
                  onClick={() => setIsUserModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-cyan text-slate-950 text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-md shadow-brand-cyan/15"
                >
                  <Plus className="h-4 w-4" />
                  <span>Registrar Usuario</span>
                </button>
              </div>

              {/* Grid of users */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((u) => (
                  <div key={u.username} className="p-5 rounded-2xl border border-white/5 bg-slate-900/20 flex items-center space-x-4 relative">
                    <img src={u.avatar} alt={u.name} className="h-12 w-12 rounded-xl object-cover border border-white/10" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{u.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{u.email}</p>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                        u.role === 'admin' ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-slate-800 text-slate-400'
                      }`}>{u.role}</span>
                    </div>

                    {currentUser.role === 'admin' && u.id && u.id !== currentUser.id && (
                      <button 
                        onClick={() => {
                          if (confirm(`¿Estás seguro de desvincular a ${u.name}?`)) deleteUser(u.id!);
                        }}
                        className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-slate-500 transition-all cursor-pointer"
                        title="Desvincular"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ==================================================================== */}
      {/* DIALOGS / MODAL OVERLAYS */}
      {/* ==================================================================== */}

      {/* 1. SERVICES CRUD MODAL */}
      <AnimatePresence>
        {isServiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsServiceModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 rounded-3xl border border-white/10 bg-slate-900 text-white relative z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold">{editingService ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
                <button onClick={() => setIsServiceModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="h-5 w-5" /></button>
              </div>

              <form onSubmit={handleServiceSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Nombre del Servicio</label>
                    <input type="text" value={serviceFormData.titleEs} onChange={(e) => setServiceFormData(prev => ({ ...prev, titleEs: e.target.value, titleEn: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none focus:border-brand-cyan/60" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Categoría</label>
                    <select value={serviceFormData.category} onChange={(e) => setServiceFormData(prev => ({ ...prev, category: e.target.value as any }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none">
                      <option value="servicio-tecnico">Servicio Técnico</option>
                      <option value="desarrollo-software">Desarrollo de Software</option>
                      <option value="soluciones-ia">Soluciones de IA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Ícono</label>
                    <select value={serviceFormData.iconName} onChange={(e) => setServiceFormData(prev => ({ ...prev, iconName: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none">
                      {availableIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Descripción Corta del Servicio</label>
                  <textarea rows={2} value={serviceFormData.descShortEs} onChange={(e) => setServiceFormData(prev => ({ ...prev, descShortEs: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none resize-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Imagen Principal</label>
                  {(serviceFormData.image || serviceImageFile) && (
                    <img
                      src={serviceImageFile ? URL.createObjectURL(serviceImageFile) : serviceFormData.image}
                      alt="Vista previa"
                      className="h-24 w-full object-cover rounded-lg border border-white/10 mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setServiceImageFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none text-xs mb-2"
                  />
                  <input
                    type="text"
                    placeholder="O pegar URL de imagen..."
                    value={serviceFormData.image}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Estado</label>
                    <select value={serviceFormData.status} onChange={(e) => setServiceFormData(prev => ({ ...prev, status: e.target.value as any }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none">
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Orden</label>
                    <input type="number" value={serviceFormData.order} onChange={(e) => setServiceFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none" />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-brand-cyan text-slate-950 font-bold uppercase tracking-wider cursor-pointer">Guardar Servicio</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. PORTFOLIO CRUD MODAL */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsProjectModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 rounded-3xl border border-white/10 bg-slate-900 text-white relative z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold">{editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
                <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="h-5 w-5" /></button>
              </div>

              <form onSubmit={handleProjectSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Título del Proyecto</label>
                    <input type="text" value={projectFormData.titleEs} onChange={(e) => setProjectFormData(prev => ({ ...prev, titleEs: e.target.value, titleEn: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Cliente</label>
                    <input type="text" value={projectFormData.client} onChange={(e) => setProjectFormData(prev => ({ ...prev, client: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Categoría</label>
                    <select value={projectFormData.category} onChange={(e) => setProjectFormData(prev => ({ ...prev, category: e.target.value as any }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none">
                      <option value="software">Software</option>
                      <option value="mobile">Móvil</option>
                      <option value="ia">Inteligencia Artificial</option>
                      <option value="website">Web Corporativa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Estado</label>
                    <select value={projectFormData.status} onChange={(e) => setProjectFormData(prev => ({ ...prev, status: e.target.value as any }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none">
                      <option value="publicado">Publicado</option>
                      <option value="borrador">Borrador</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Descripción del Proyecto</label>
                  <textarea rows={3} value={projectFormData.descriptionEs} onChange={(e) => setProjectFormData(prev => ({ ...prev, descriptionEs: e.target.value, descriptionEn: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none resize-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Imagen Principal (URL)</label>
                  <input type="text" value={projectFormData.image} onChange={(e) => setProjectFormData(prev => ({ ...prev, image: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none" />
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-brand-cyan text-slate-950 font-bold uppercase tracking-wider cursor-pointer">Guardar Proyecto</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. BLOGS CRUD MODAL */}
      <AnimatePresence>
        {isBlogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsBlogModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 rounded-3xl border border-white/10 bg-slate-900 text-white relative z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold">{editingBlog ? 'Editar Artículo' : 'Nuevo Artículo'}</h3>
                <button onClick={() => setIsBlogModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="h-5 w-5" /></button>
              </div>

              <form onSubmit={handleBlogSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Título del Post</label>
                  <input type="text" value={blogFormData.titleEs} onChange={(e) => setBlogFormData(prev => ({ ...prev, titleEs: e.target.value, titleEn: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Categoría</label>
                    <input type="text" value={blogFormData.categoryEs} onChange={(e) => setBlogFormData(prev => ({ ...prev, categoryEs: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Estado</label>
                    <select value={blogFormData.status} onChange={(e) => setBlogFormData(prev => ({ ...prev, status: e.target.value as any }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none">
                      <option value="publicado">Publicado</option>
                      <option value="borrador">Borrador</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Resumen / Reseña Corta</label>
                  <textarea rows={2} value={blogFormData.summaryEs} onChange={(e) => setBlogFormData(prev => ({ ...prev, summaryEs: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none resize-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Contenido Completo (HTML/Texto)</label>
                  <textarea rows={6} value={blogFormData.contentEs} onChange={(e) => setBlogFormData(prev => ({ ...prev, contentEs: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none font-mono" />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Imagen de Portada (URL)</label>
                  <input type="text" value={blogFormData.image} onChange={(e) => setBlogFormData(prev => ({ ...prev, image: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none" />
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-brand-cyan text-slate-950 font-bold uppercase tracking-wider cursor-pointer">Guardar Artículo</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MULTIMEDIA FILE UPLOADER SIMULATOR MODAL */}
      <AnimatePresence>
        {isMediaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsMediaModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl border border-white/10 bg-slate-900 text-white relative z-10 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold">Subir Nuevo Recurso de Media</h3>
                <button onClick={() => setIsMediaModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="h-5 w-5" /></button>
              </div>

              <form onSubmit={handleMediaSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Archivo</label>
                  <input
                    type="file"
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={(e) => setMediaFormData(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Módulo / Caso de uso</label>
                  <input type="text" placeholder="Ej: Banner Home, Blog, PDF Catálogo..." value={mediaFormData.useCase} onChange={(e) => setMediaFormData(prev => ({ ...prev, useCase: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none" />
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-brand-cyan text-slate-950 font-bold uppercase tracking-wider cursor-pointer">Subir Archivo</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. REGISTER USER MODAL */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsUserModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl border border-white/10 bg-slate-900 text-white relative z-10 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold">Vincular Nuevo Personal Técnico</h3>
                <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="h-5 w-5" /></button>
              </div>

              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Nombre Completo</label>
                  <input type="text" placeholder="Ej: Mario Justiniano" value={newUserFormData.name} onChange={(e) => setNewUserFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none" required />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Correo Institucional</label>
                  <input type="email" placeholder="mario.j@globalservice.bo" value={newUserFormData.email} onChange={(e) => setNewUserFormData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none" required />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Contraseña</label>
                  <input type="password" placeholder="Mínimo 6 caracteres" value={newUserFormData.password} onChange={(e) => setNewUserFormData(prev => ({ ...prev, password: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none" required minLength={6} />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Privilegios (Rol)</label>
                  <select value={newUserFormData.role} onChange={(e) => setNewUserFormData(prev => ({ ...prev, role: e.target.value as any }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none">
                    <option value="admin">Administrador (Acceso Total)</option>
                    <option value="editor">Editor (Sólo contenido de páginas)</option>
                  </select>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-brand-cyan text-slate-950 font-bold uppercase tracking-wider cursor-pointer">Registrar Cuenta</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. TEAM MEMBER MODAL */}
      <AnimatePresence>
        {isTeamModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsTeamModalOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 rounded-3xl border border-white/10 bg-slate-900 text-white relative z-10 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold">{editingTeamMember ? 'Editar Miembro' : 'Nuevo Miembro'}</h3>
                <button onClick={() => setIsTeamModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleTeamSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Nombre completo</label>
                  <input type="text" value={teamFormData.name} onChange={(e) => setTeamFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Cargo (ES)</label>
                    <input type="text" value={teamFormData.roleEs} onChange={(e) => setTeamFormData(p => ({ ...p, roleEs: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Cargo (EN)</label>
                    <input type="text" value={teamFormData.roleEn} onChange={(e) => setTeamFormData(p => ({ ...p, roleEn: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Biografía (ES)</label>
                  <textarea rows={3} value={teamFormData.bioEs} onChange={(e) => setTeamFormData(p => ({ ...p, bioEs: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Foto del miembro</label>
                  {(teamFormData.image || teamImageFile) && (
                    <img src={teamImageFile ? URL.createObjectURL(teamImageFile) : teamFormData.image} alt="" className="h-20 w-20 rounded-xl object-cover border border-white/10 mb-2" />
                  )}
                  <input type="file" accept="image/*" onChange={(e) => setTeamImageFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Estado</label>
                    <select value={teamFormData.status} onChange={(e) => setTeamFormData(p => ({ ...p, status: e.target.value as CMSTeamMember['status'] }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none">
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Orden</label>
                    <input type="number" value={teamFormData.order} onChange={(e) => setTeamFormData(p => ({ ...p, order: parseInt(e.target.value) }))} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 outline-none" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-brand-cyan text-slate-950 font-bold uppercase tracking-wider cursor-pointer">Guardar Miembro</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
