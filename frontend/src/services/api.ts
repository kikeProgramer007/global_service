import { API_BASE_URL, getAuthToken } from '../config/api';

export interface ApiResponse<T = unknown> {
  ok: boolean;
  message: string;
  data?: T;
  error?: unknown;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  isFormData?: boolean;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false, isFormData = false } = options;

  const headers: Record<string, string> = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body
      ? isFormData
        ? (body as FormData)
        : JSON.stringify(body)
      : undefined,
  });

  const payload: ApiResponse<T> = await response.json().catch(() => ({
    ok: false,
    message: 'Error de conexión con el servidor.',
  }));

  if (!response.ok || !payload.ok) {
    throw new ApiError(payload.message || 'Error en la solicitud.', response.status);
  }

  return payload.data as T;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: BackendUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  getMe: () =>
    request<{ user: BackendUser }>('/api/auth/me', { auth: true }),

  // Public
  getPublicHome: () => request<PublicHomeData>('/api/public/home'),

  getPublicSettings: () =>
    request<{ settings: Record<string, unknown> }>('/api/public/settings'),

  getPublicServices: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ services: BackendService[]; total: number; page: number; limit: number; totalPages: number }>(
      `/api/public/services${query}`
    );
  },

  getPublicProjects: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ projects: BackendProject[] }>(`/api/public/projects${query}`);
  },

  getPublicBlog: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ posts: BackendBlogPost[]; total: number }>(`/api/public/blog${query}`);
  },

  getPublicTestimonials: () =>
    request<{ testimonials: BackendTestimonial[] }>('/api/public/testimonials'),

  submitContact: (data: {
    name: string;
    email: string;
    message: string;
    phone?: string;
    service?: string;
  }) =>
    request('/api/public/contact', { method: 'POST', body: data }),

  submitQuote: (data: {
    name: string;
    email: string;
    description: string;
    phone?: string;
    company?: string;
    serviceType?: string;
    budget?: string;
    attachmentUrl?: string;
  }) =>
    request('/api/public/quote', { method: 'POST', body: data }),

  // Admin - Dashboard
  getDashboardStats: () => request<DashboardStats>('/api/admin/dashboard/stats', { auth: true }),

  // Admin - Users
  getUsers: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ users: BackendUser[] }>(`/api/admin/users${query}`, { auth: true });
  },

  createUser: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    active?: boolean;
    avatarUrl?: string;
  }) =>
    request<{ user: BackendUser }>('/api/admin/users', { method: 'POST', body: data, auth: true }),

  deleteUser: (id: number) =>
    request(`/api/admin/users/${id}`, { method: 'DELETE', auth: true }),

  // Admin - Services
  getServiceCategories: () =>
    request<{ categories: BackendServiceCategory[] }>('/api/admin/service-categories', { auth: true }),

  getServices: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '?limit=100';
    return request<{ services: BackendService[] }>(`/api/admin/services${query}`, { auth: true });
  },

  createService: (data: Record<string, unknown>) =>
    request<{ service: BackendService }>('/api/admin/services', { method: 'POST', body: data, auth: true }),

  updateService: (id: number, data: Record<string, unknown>) =>
    request<{ service: BackendService }>(`/api/admin/services/${id}`, { method: 'PUT', body: data, auth: true }),

  deleteService: (id: number) =>
    request(`/api/admin/services/${id}`, { method: 'DELETE', auth: true }),

  // Admin - Projects
  getProjects: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '?limit=100';
    return request<{ projects: BackendProject[] }>(`/api/admin/projects${query}`, { auth: true });
  },

  createProject: (data: Record<string, unknown>) =>
    request<{ project: BackendProject }>('/api/admin/projects', { method: 'POST', body: data, auth: true }),

  updateProject: (id: number, data: Record<string, unknown>) =>
    request<{ project: BackendProject }>(`/api/admin/projects/${id}`, { method: 'PUT', body: data, auth: true }),

  deleteProject: (id: number) =>
    request(`/api/admin/projects/${id}`, { method: 'DELETE', auth: true }),

  // Admin - Blog
  getBlogCategories: () =>
    request<{ categories: BackendBlogCategory[] }>('/api/admin/blog-categories', { auth: true }),

  createBlogCategory: (data: { name: string; description?: string; active?: boolean }) =>
    request<{ category: BackendBlogCategory }>('/api/admin/blog-categories', { method: 'POST', body: data, auth: true }),

  getBlogPosts: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '?limit=100';
    return request<{ posts: BackendBlogPost[] }>(`/api/admin/blog${query}`, { auth: true });
  },

  createBlogPost: (data: Record<string, unknown>) =>
    request<{ post: BackendBlogPost }>('/api/admin/blog', { method: 'POST', body: data, auth: true }),

  updateBlogPost: (id: number, data: Record<string, unknown>) =>
    request<{ post: BackendBlogPost }>(`/api/admin/blog/${id}`, { method: 'PUT', body: data, auth: true }),

  deleteBlogPost: (id: number) =>
    request(`/api/admin/blog/${id}`, { method: 'DELETE', auth: true }),

  // Admin - Testimonials
  getTestimonials: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '?limit=100';
    return request<{ testimonials: BackendTestimonial[] }>(`/api/admin/testimonials${query}`, { auth: true });
  },

  createTestimonial: (data: Record<string, unknown>) =>
    request<{ testimonial: BackendTestimonial }>('/api/admin/testimonials', { method: 'POST', body: data, auth: true }),

  updateTestimonial: (id: number, data: Record<string, unknown>) =>
    request<{ testimonial: BackendTestimonial }>(`/api/admin/testimonials/${id}`, { method: 'PUT', body: data, auth: true }),

  deleteTestimonial: (id: number) =>
    request(`/api/admin/testimonials/${id}`, { method: 'DELETE', auth: true }),

  // Admin - Messages & Quotes
  getContactMessages: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '?limit=100';
    return request<{ messages: BackendContactMessage[] }>(`/api/admin/contact-messages${query}`, { auth: true });
  },

  updateMessageStatus: (id: number, status: string) =>
    request(`/api/admin/contact-messages/${id}/status`, { method: 'PUT', body: { status }, auth: true }),

  getQuotes: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '?limit=100';
    return request<{ quotes: BackendQuote[] }>(`/api/admin/quotes${query}`, { auth: true });
  },

  updateQuoteStatus: (id: number, status: string) =>
    request(`/api/admin/quotes/${id}/status`, { method: 'PUT', body: { status }, auth: true }),

  // Admin - Media
  getMedia: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '?limit=100';
    return request<{ mediaFiles: BackendMediaFile[] }>(`/api/admin/media${query}`, { auth: true });
  },

  uploadMedia: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ id: number; url: string; filename: string; type: string; size: number }>(
      '/api/admin/media/upload',
      { method: 'POST', body: formData, auth: true, isFormData: true }
    );
  },

  deleteMedia: (id: number) =>
    request(`/api/admin/media/${id}`, { method: 'DELETE', auth: true }),

  // Admin - Gallery
  getGallery: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '?limit=100';
    return request<{ galleryItems: BackendGalleryItem[] }>(`/api/admin/gallery${query}`, { auth: true });
  },

  createGalleryItem: (data: Record<string, unknown>) =>
    request<{ galleryItem: BackendGalleryItem }>('/api/admin/gallery', { method: 'POST', body: data, auth: true }),

  deleteGalleryItem: (id: number) =>
    request(`/api/admin/gallery/${id}`, { method: 'DELETE', auth: true }),

  // Admin - Settings
  getSettings: () =>
    request<{ settings: BackendSetting[] }>('/api/admin/settings', { auth: true }),

  upsertSetting: (key: string, value: unknown, group?: string) =>
    request<{ setting: BackendSetting }>('/api/admin/settings/upsert', {
      method: 'POST',
      body: { key, value, group },
      auth: true,
    }),

  // Admin - Team
  getTeam: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ members: BackendTeamMember[]; total: number; page: number; totalPages: number }>(
      `/api/admin/team${query}`,
      { auth: true }
    );
  },

  createTeamMember: (data: Record<string, unknown>) =>
    request<{ member: BackendTeamMember }>('/api/admin/team', { method: 'POST', body: data, auth: true }),

  updateTeamMember: (id: number, data: Record<string, unknown>) =>
    request<{ member: BackendTeamMember }>(`/api/admin/team/${id}`, { method: 'PUT', body: data, auth: true }),

  deleteTeamMember: (id: number) =>
    request(`/api/admin/team/${id}`, { method: 'DELETE', auth: true }),

  getPublicTeam: () =>
    request<{ members: BackendTeamMember[] }>('/api/public/team'),
};

// Backend types
export interface BackendUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
  active: boolean;
  avatarUrl?: string | null;
}

export interface BackendServiceCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BackendService {
  id: number;
  categoryId: number;
  title: string;
  slug: string;
  shortDesc?: string | null;
  description?: string | null;
  icon?: string | null;
  imageUrl?: string | null;
  gallery?: unknown;
  benefits?: unknown;
  process?: unknown;
  faq?: unknown;
  active: boolean;
  featured: boolean;
  order: number;
  category?: BackendServiceCategory;
}

export interface BackendProject {
  id: number;
  title: string;
  slug: string;
  category: string;
  client?: string | null;
  shortDesc?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  gallery?: unknown;
  techStack?: unknown;
  demoUrl?: string | null;
  videoUrl?: string | null;
  active: boolean;
  featured: boolean;
  order: number;
}

export interface BackendBlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BackendBlogPost {
  id: number;
  categoryId: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  author?: string | null;
  status: 'draft' | 'published';
  publishedAt?: string | null;
  createdAt: string;
  category?: BackendBlogCategory;
}

export interface BackendTestimonial {
  id: number;
  name: string;
  role?: string | null;
  city?: string | null;
  comment: string;
  rating: number;
  imageUrl?: string | null;
  active: boolean;
  order: number;
}

export interface BackendContactMessage {
  id: number;
  name: string;
  phone?: string | null;
  email: string;
  service?: string | null;
  message: string;
  status: 'new' | 'read' | 'contacted' | 'closed';
  createdAt: string;
}

export interface BackendQuote {
  id: number;
  name: string;
  phone?: string | null;
  email: string;
  company?: string | null;
  serviceType?: string | null;
  budget?: string | null;
  description: string;
  status: 'new' | 'reviewed' | 'contacted' | 'closed';
  createdAt: string;
}

export interface BackendMediaFile {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  type: string;
  createdAt: string;
}

export interface BackendGalleryItem {
  id: number;
  title?: string | null;
  description?: string | null;
  imageUrl: string;
  category?: string | null;
  active: boolean;
  order: number;
}

export interface BackendSetting {
  id: number;
  key: string;
  value: unknown;
  group?: string | null;
}

export interface BackendTeamMember {
  id: number;
  name: string;
  roleEs?: string | null;
  roleEn?: string | null;
  bioEs?: string | null;
  bioEn?: string | null;
  imageUrl?: string | null;
  active: boolean;
  order: number;
}

export interface PublicHomeData {
  page?: { sections?: Array<{ type: string; title?: string; subtitle?: string; content?: unknown }> } | null;
  featuredServices?: BackendService[];
  featuredProjects?: BackendProject[];
  testimonials?: BackendTestimonial[];
  settings?: Record<string, unknown>;
}

export interface DashboardStats {
  totalPages: number;
  totalServices: number;
  totalProjects: number;
  totalBlogs: number;
  totalMessages: number;
  totalQuotes: number;
  recentMessages: BackendContactMessage[];
  recentContent: BackendBlogPost[];
}
