import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, ApiError, DashboardStats } from '../services/api';
import {
  mapServiceToCMS,
  mapServiceToBackend,
  mapProjectToCMS,
  mapProjectToBackend,
  mapBlogToCMS,
  mapBlogToBackend,
  mapTestimonialToCMS,
  mapTestimonialToBackend,
  mapMessageToCMS,
  mapMessageStatusToBackend,
  mapQuoteToCMS,
  mapQuoteStatusToBackend,
  mapUserToCMS,
  mapMediaToCMS,
  mapPageContentsFromSettings,
  mapCategoryPagesFromSettings,
  mapTeamToCMS,
  mapTeamToBackend,
  DEFAULT_PAGE_CONTENTS,
  DEFAULT_CATEGORY_PAGES,
  getCategoryIdBySlug,
  parseBlogContent,
} from '../services/mappers';
import { setAuthToken, getAuthToken } from '../config/api';

// Role Types
export type UserRole = 'admin' | 'editor';

export interface User {
  id?: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface CMSService {
  id: string;
  titleEs: string;
  titleEn: string;
  category: 'servicio-tecnico' | 'desarrollo-software' | 'soluciones-ia';
  descShortEs: string;
  descShortEn: string;
  descLongEs: string;
  descLongEn: string;
  iconName: string;
  image: string;
  gallery: string[];
  benefitsEs: string[];
  benefitsEn: string[];
  processEs: string[];
  processEn: string[];
  status: 'active' | 'inactive';
  order: number;
}

export interface CMSProject {
  id: string;
  titleEs: string;
  titleEn: string;
  category: 'software' | 'mobile' | 'ia' | 'website';
  client: string;
  descriptionEs: string;
  descriptionEn: string;
  image: string;
  gallery: string[];
  tech: string[];
  demoUrl?: string;
  videoUrl?: string;
  status: 'publicado' | 'borrador';
}

export interface CMSBlogPost {
  id: string;
  titleEs: string;
  titleEn: string;
  slug: string;
  categoryEs: string;
  categoryEn: string;
  image: string;
  summaryEs: string;
  summaryEn: string;
  contentEs: string;
  contentEn: string;
  author: string;
  dateEs: string;
  dateEn: string;
  readTimeEs: string;
  readTimeEn: string;
  status: 'publicado' | 'borrador';
}

export interface CMSMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  serviceRequested?: string;
  status: 'nuevo' | 'contactado' | 'cerrado';
  date: string;
}

export interface CMSQuote {
  id: string;
  name: string;
  phone: string;
  email: string;
  solutionType: string;
  features: string[];
  approxCost: number;
  status: 'nuevo' | 'contactado' | 'cerrado';
  date: string;
  notes?: string;
}

export interface CMSTestimonial {
  id: string;
  name: string;
  roleEs: string;
  roleEn: string;
  rating: number;
  textEs: string;
  textEn: string;
  avatar: string;
}

export interface CMSMediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'pdf' | 'icon';
  url: string;
  size: string;
  uploadedAt: string;
  useCase: string;
}

export interface PageContents {
  home: {
    heroBadgeEs: string;
    heroBadgeEn: string;
    heroTitleEs: string;
    heroTitleEn: string;
    heroSubtitleEs: string;
    heroSubtitleEn: string;
    statsExperience: string;
    statsProjects: string;
    statsRating: string;
    statsReparations: string;
  };
  nosotros: {
    titleEs: string;
    titleEn: string;
    subtitleEs: string;
    subtitleEn: string;
    storyTitleEs: string;
    storyTitleEn: string;
    storyTextEs: string;
    storyTextEn: string;
    missionTitleEs: string;
    missionTitleEn: string;
    missionTextEs: string;
    missionTextEn: string;
    visionTitleEs: string;
    visionTitleEn: string;
    visionTextEs: string;
    visionTextEn: string;
  };
  contacto: {
    titleEs: string;
    titleEn: string;
    subtitleEs: string;
    subtitleEn: string;
    phone: string;
    whatsapp: string;
    email: string;
    addressEs: string;
    addressEn: string;
    hoursEs: string;
    hoursEn: string;
  };
}

export interface CategoryPageContent {
  badgeEs: string;
  badgeEn: string;
  titleEs: string;
  titleEn: string;
  titleHighlightEs: string;
  titleHighlightEn: string;
  subtitleEs: string;
  subtitleEn: string;
  heroImage: string;
  gridTitleEs: string;
  gridTitleEn: string;
  gridSubtitleEs: string;
  gridSubtitleEn: string;
}

export type CategoryPages = Record<CMSService['category'], CategoryPageContent>;

export interface CMSTeamMember {
  id: string;
  name: string;
  roleEs: string;
  roleEn: string;
  bioEs: string;
  bioEn: string;
  image: string;
  status: 'active' | 'inactive';
  order: number;
}

interface CMSContextType {
  currentUser: User | null;
  users: User[];
  services: CMSService[];
  projects: CMSProject[];
  blogs: CMSBlogPost[];
  messages: CMSMessage[];
  quotes: CMSQuote[];
  testimonials: CMSTestimonial[];
  mediaItems: CMSMediaItem[];
  pageContents: PageContents;
  categoryPages: CategoryPages;
  teamMembers: CMSTeamMember[];
  isLoading: boolean;
  isConnected: boolean;
  apiError: string | null;
  dashboardStats: DashboardStats | null;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: { name: string; email: string; password: string; role: UserRole }) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  refreshPublicData: () => Promise<void>;
  refreshAdminData: () => Promise<void>;

  updatePageContents: (page: keyof PageContents, contents: Partial<PageContents[keyof PageContents]>) => Promise<void>;
  updateCategoryPage: (slug: keyof CategoryPages, contents: Partial<CategoryPageContent>) => Promise<void>;

  uploadImage: (file: File) => Promise<string>;

  addTeamMember: (member: Omit<CMSTeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (id: string, member: Partial<CMSTeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;

  addService: (service: Omit<CMSService, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<CMSService>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  addProject: (project: Omit<CMSProject, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<CMSProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  addBlog: (blog: Omit<CMSBlogPost, 'id'>) => Promise<void>;
  updateBlog: (id: string, blog: Partial<CMSBlogPost>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;

  submitMessage: (message: Omit<CMSMessage, 'id' | 'status' | 'date'>) => Promise<void>;
  submitQuote: (quote: Omit<CMSQuote, 'id' | 'status' | 'date'>) => Promise<void>;
  updateMessageStatus: (id: string, status: CMSMessage['status']) => Promise<void>;
  updateQuoteStatus: (id: string, status: CMSQuote['status']) => Promise<void>;

  addTestimonial: (testimonial: Omit<CMSTestimonial, 'id'>) => Promise<void>;
  updateTestimonial: (id: string, testimonial: Partial<CMSTestimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  addMediaItem: (file: File, useCase?: string) => Promise<void>;
  deleteMediaItem: (id: string) => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<CMSService[]>([]);
  const [projects, setProjects] = useState<CMSProject[]>([]);
  const [blogs, setBlogs] = useState<CMSBlogPost[]>([]);
  const [messages, setMessages] = useState<CMSMessage[]>([]);
  const [quotes, setQuotes] = useState<CMSQuote[]>([]);
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [mediaItems, setMediaItems] = useState<CMSMediaItem[]>([]);
  const [pageContents, setPageContents] = useState<PageContents>(DEFAULT_PAGE_CONTENTS);
  const [categoryPages, setCategoryPages] = useState<CategoryPages>(DEFAULT_CATEGORY_PAGES);
  const [teamMembers, setTeamMembers] = useState<CMSTeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const [serviceCategories, setServiceCategories] = useState<Array<{ id: number; slug: string; name: string }>>([]);
  const [blogCategories, setBlogCategories] = useState<Array<{ id: number; slug: string; name: string }>>([]);

  const refreshPublicData = useCallback(async () => {
    try {
      const [homeData, settingsData, servicesData, projectsData, blogData, testimonialsData, teamData] =
        await Promise.all([
          api.getPublicHome(),
          api.getPublicSettings(),
          api.getPublicServices({ limit: '100' }),
          api.getPublicProjects(),
          api.getPublicBlog({ limit: '50' }),
          api.getPublicTestimonials(),
          api.getPublicTeam().catch(() => ({ members: [] })),
        ]);

      if (homeData.featuredServices?.length) {
        setServices(homeData.featuredServices.map(mapServiceToCMS));
      }
      if (servicesData.services?.length) {
        setServices(servicesData.services.map(mapServiceToCMS));
      }

      if (homeData.featuredProjects?.length) {
        setProjects(homeData.featuredProjects.map(mapProjectToCMS));
      }
      if (projectsData.projects?.length) {
        setProjects(projectsData.projects.map(mapProjectToCMS));
      }

      if (blogData.posts?.length) {
        setBlogs(
          blogData.posts.map((p) => {
            const mapped = mapBlogToCMS(p);
            mapped.contentEs = parseBlogContent(p.content);
            mapped.contentEn = parseBlogContent(p.content);
            return mapped;
          })
        );
      }

      if (homeData.testimonials?.length) {
        setTestimonials(homeData.testimonials.map(mapTestimonialToCMS));
      } else if (testimonialsData.testimonials?.length) {
        setTestimonials(testimonialsData.testimonials.map(mapTestimonialToCMS));
      }

      const settings = settingsData.settings || homeData.settings || {};
      setPageContents(mapPageContentsFromSettings(settings));
      setCategoryPages(mapCategoryPagesFromSettings(settings));
      if (teamData.members?.length) {
        setTeamMembers(teamData.members.map(mapTeamToCMS));
      }
      setIsConnected(true);
      setApiError(null);
    } catch (err) {
      setIsConnected(false);
      setApiError(err instanceof ApiError ? err.message : 'No se pudo conectar con el servidor.');
      console.error('Error loading public data:', err);
    }
  }, []);

  const refreshAdminData = useCallback(async () => {
    if (!getAuthToken()) return;

    try {
      const [
        statsData,
        usersData,
        servicesData,
        projectsData,
        blogData,
        messagesData,
        quotesData,
        testimonialsData,
        mediaData,
        settingsData,
        svcCats,
        blogCats,
        teamData,
      ] = await Promise.all([
        api.getDashboardStats(),
        api.getUsers({ limit: '100' }),
        api.getServices({ limit: '100' }),
        api.getProjects({ limit: '100' }),
        api.getBlogPosts({ limit: '100' }),
        api.getContactMessages({ limit: '100' }),
        api.getQuotes({ limit: '100' }),
        api.getTestimonials({ limit: '100' }),
        api.getMedia({ limit: '100' }),
        api.getSettings(),
        api.getServiceCategories(),
        api.getBlogCategories(),
        api.getTeam({ limit: '100' }),
      ]);

      setDashboardStats(statsData);
      setUsers(usersData.users.map(mapUserToCMS));
      setServices(servicesData.services.map(mapServiceToCMS));
      setProjects(projectsData.projects.map(mapProjectToCMS));
      setBlogs(
        blogData.posts.map((p) => {
          const mapped = mapBlogToCMS(p);
          mapped.contentEs = parseBlogContent(p.content);
          mapped.contentEn = parseBlogContent(p.content);
          return mapped;
        })
      );
      setMessages(messagesData.messages.map(mapMessageToCMS));
      setQuotes(quotesData.quotes.map(mapQuoteToCMS));
      setTestimonials(testimonialsData.testimonials.map(mapTestimonialToCMS));
      setMediaItems(mediaData.mediaFiles.map(mapMediaToCMS));
      setServiceCategories(svcCats.categories);
      setBlogCategories(blogCats.categories);

      const settingsMap: Record<string, unknown> = {};
      settingsData.settings.forEach((s) => {
        settingsMap[s.key] = s.value;
      });
      setPageContents(mapPageContentsFromSettings(settingsMap));
      setCategoryPages(mapCategoryPagesFromSettings(settingsMap));
      setTeamMembers(teamData.members.map(mapTeamToCMS));
      setIsConnected(true);
      setApiError(null);
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : 'Error al cargar datos del panel.');
      console.error('Error loading admin data:', err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await refreshPublicData();

      const token = getAuthToken();
      if (token) {
        try {
          const { user } = await api.getMe();
          setCurrentUser(mapUserToCMS(user));
          await refreshAdminData();
        } catch {
          setAuthToken(null);
        }
      }

      setIsLoading(false);
    };
    init();
  }, [refreshPublicData, refreshAdminData]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { token, user } = await api.login(email, password);
      setAuthToken(token);
      setCurrentUser(mapUserToCMS(user));
      await refreshAdminData();
      setApiError(null);
      return true;
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : 'Error de autenticación.');
      return false;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setDashboardStats(null);
    setUsers([]);
    setMessages([]);
    setQuotes([]);
    refreshPublicData();
  };

  const addUser = async (user: { name: string; email: string; password: string; role: UserRole }) => {
    await api.createUser({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role === 'admin' ? 'ADMIN' : 'EDITOR',
    });
    await refreshAdminData();
  };

  const deleteUser = async (id: number) => {
    await api.deleteUser(id);
    if (currentUser?.id === id) logout();
    await refreshAdminData();
  };

  const updatePageContents = async (
    page: keyof PageContents,
    contents: Partial<PageContents[keyof PageContents]>
  ) => {
    const updated = { ...pageContents[page], ...contents };
    setPageContents((prev) => ({ ...prev, [page]: updated }));
    await api.upsertSetting(`page.${page}`, updated, 'pages');
  };

  const updateCategoryPage = async (
    slug: keyof CategoryPages,
    contents: Partial<CategoryPageContent>
  ) => {
    const updated = { ...categoryPages[slug], ...contents };
    setCategoryPages((prev) => ({ ...prev, [slug]: updated }));
    await api.upsertSetting(`page.${slug}`, updated, 'pages');
  };

  const uploadImage = async (file: File): Promise<string> => {
    const uploaded = await api.uploadMedia(file);
    return uploaded.url;
  };

  const addTeamMember = async (member: Omit<CMSTeamMember, 'id'>) => {
    const { member: created } = await api.createTeamMember(mapTeamToBackend(member));
    setTeamMembers((prev) => [...prev, mapTeamToCMS(created)]);
  };

  const updateTeamMember = async (id: string, member: Partial<CMSTeamMember>) => {
    const existing = teamMembers.find((m) => m.id === id);
    const merged = { ...existing, ...member } as CMSTeamMember;
    const { member: updated } = await api.updateTeamMember(parseInt(id), mapTeamToBackend(merged));
    setTeamMembers((prev) => prev.map((m) => (m.id === id ? mapTeamToCMS(updated) : m)));
  };

  const deleteTeamMember = async (id: string) => {
    await api.deleteTeamMember(parseInt(id));
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const addService = async (newS: Omit<CMSService, 'id'>) => {
    const categoryId = getCategoryIdBySlug(newS.category, serviceCategories);
    if (!categoryId) throw new Error('Categoría de servicio no encontrada.');
    const { service } = await api.createService(mapServiceToBackend(newS, categoryId));
    setServices((prev) => [...prev, mapServiceToCMS(service)]);
  };

  const updateService = async (id: string, s: Partial<CMSService>) => {
    const existing = services.find((item) => item.id === id);
    const merged = { ...existing, ...s } as CMSService;
    const categoryId = getCategoryIdBySlug(merged.category, serviceCategories);
    if (!categoryId) throw new Error('Categoría de servicio no encontrada.');
    const { service } = await api.updateService(parseInt(id), mapServiceToBackend(merged, categoryId));
    setServices((prev) => prev.map((item) => (item.id === id ? mapServiceToCMS(service) : item)));
  };

  const deleteService = async (id: string) => {
    await api.deleteService(parseInt(id));
    setServices((prev) => prev.filter((item) => item.id !== id));
  };

  const addProject = async (newP: Omit<CMSProject, 'id'>) => {
    const { project } = await api.createProject(mapProjectToBackend(newP));
    setProjects((prev) => [...prev, mapProjectToCMS(project)]);
  };

  const updateProject = async (id: string, p: Partial<CMSProject>) => {
    const existing = projects.find((item) => item.id === id);
    const merged = { ...existing, ...p } as CMSProject;
    const { project } = await api.updateProject(parseInt(id), mapProjectToBackend(merged));
    setProjects((prev) => prev.map((item) => (item.id === id ? mapProjectToCMS(project) : item)));
  };

  const deleteProject = async (id: string) => {
    await api.deleteProject(parseInt(id));
    setProjects((prev) => prev.filter((item) => item.id !== id));
  };

  const findOrCreateBlogCategory = async (name: string): Promise<number> => {
    const found = blogCategories.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (found) return found.id;
    const { category } = await api.createBlogCategory({ name });
    setBlogCategories((prev) => [...prev, category]);
    return category.id;
  };

  const addBlog = async (newB: Omit<CMSBlogPost, 'id'>) => {
    const categoryId = await findOrCreateBlogCategory(newB.categoryEs);
    const { post } = await api.createBlogPost(mapBlogToBackend(newB, categoryId));
    const mapped = mapBlogToCMS(post);
    mapped.contentEs = parseBlogContent(post.content);
    mapped.contentEn = parseBlogContent(post.content);
    setBlogs((prev) => [mapped, ...prev]);
  };

  const updateBlog = async (id: string, b: Partial<CMSBlogPost>) => {
    const existing = blogs.find((item) => item.id === id);
    const merged = { ...existing, ...b } as CMSBlogPost;
    const categoryId = await findOrCreateBlogCategory(merged.categoryEs);
    const { post } = await api.updateBlogPost(parseInt(id), mapBlogToBackend(merged, categoryId));
    const mapped = mapBlogToCMS(post);
    mapped.contentEs = parseBlogContent(post.content);
    mapped.contentEn = parseBlogContent(post.content);
    setBlogs((prev) => prev.map((item) => (item.id === id ? mapped : item)));
  };

  const deleteBlog = async (id: string) => {
    await api.deleteBlogPost(parseInt(id));
    setBlogs((prev) => prev.filter((item) => item.id !== id));
  };

  const submitMessage = async (msg: Omit<CMSMessage, 'id' | 'status' | 'date'>) => {
    await api.submitContact({
      name: msg.name,
      email: msg.email,
      message: msg.message,
      phone: msg.phone,
      service: msg.serviceRequested || msg.subject,
    });
  };

  const submitQuote = async (q: Omit<CMSQuote, 'id' | 'status' | 'date'>) => {
    await api.submitQuote({
      name: q.name,
      email: q.email,
      phone: q.phone,
      serviceType: q.solutionType,
      budget: String(q.approxCost),
      description: JSON.stringify({
        solutionType: q.solutionType,
        features: q.features,
        approxCost: q.approxCost,
        notes: q.notes,
      }),
    });
  };

  const updateMessageStatus = async (id: string, status: CMSMessage['status']) => {
    await api.updateMessageStatus(parseInt(id), mapMessageStatusToBackend(status));
    setMessages((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const updateQuoteStatus = async (id: string, status: CMSQuote['status']) => {
    await api.updateQuoteStatus(parseInt(id), mapQuoteStatusToBackend(status));
    setQuotes((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const addTestimonial = async (newT: Omit<CMSTestimonial, 'id'>) => {
    const { testimonial } = await api.createTestimonial(mapTestimonialToBackend(newT));
    setTestimonials((prev) => [...prev, mapTestimonialToCMS(testimonial)]);
  };

  const updateTestimonial = async (id: string, t: Partial<CMSTestimonial>) => {
    const existing = testimonials.find((item) => item.id === id);
    const merged = { ...existing, ...t } as CMSTestimonial;
    const { testimonial } = await api.updateTestimonial(parseInt(id), mapTestimonialToBackend(merged));
    setTestimonials((prev) => prev.map((item) => (item.id === id ? mapTestimonialToCMS(testimonial) : item)));
  };

  const deleteTestimonial = async (id: string) => {
    await api.deleteTestimonial(parseInt(id));
    setTestimonials((prev) => prev.filter((item) => item.id !== id));
  };

  const addMediaItem = async (file: File, useCase = 'General') => {
    const uploaded = await api.uploadMedia(file);
    const item: CMSMediaItem = {
      id: String(uploaded.id),
      name: uploaded.filename,
      type: uploaded.type === 'video' ? 'video' : uploaded.type === 'document' ? 'pdf' : 'image',
      url: uploaded.url,
      size: `${(uploaded.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0],
      useCase,
    };
    setMediaItems((prev) => [item, ...prev]);
  };

  const deleteMediaItem = async (id: string) => {
    await api.deleteMedia(parseInt(id));
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CMSContext.Provider
      value={{
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
        refreshPublicData,
        refreshAdminData,
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
        submitMessage,
        submitQuote,
        updateMessageStatus,
        updateQuoteStatus,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addMediaItem,
        deleteMediaItem,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
