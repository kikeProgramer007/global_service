import {
  BackendBlogPost,
  BackendContactMessage,
  BackendMediaFile,
  BackendProject,
  BackendQuote,
  BackendService,
  BackendTestimonial,
  BackendUser,
} from './api';
import {
  CMSBlogPost,
  CMSMessage,
  CMSProject,
  CMSQuote,
  CMSService,
  CMSTestimonial,
  CMSMediaItem,
  CMSTeamMember,
  PageContents,
  CategoryPages,
  User,
  UserRole,
} from '../context/CMSContext';
import { IMAGES } from '../assets';
import { BackendTeamMember } from './api';

type I18nMeta = {
  titleEn?: string;
  descShortEn?: string;
  descLongEn?: string;
  benefitsEn?: string[];
  processEn?: string[];
  descriptionEn?: string;
  categoryEn?: string;
  summaryEn?: string;
  contentEn?: string;
  roleEn?: string;
  textEn?: string;
  readTimeEn?: string;
};

export function extractI18n(data: unknown): I18nMeta {
  if (!data || typeof data !== 'object') return {};
  const obj = data as Record<string, unknown>;
  if (obj._i18n && typeof obj._i18n === 'object') {
    return obj._i18n as I18nMeta;
  }
  return {};
}

export function buildI18nPayload(i18n: I18nMeta): { _i18n: I18nMeta } {
  return { _i18n: i18n };
}

const CATEGORY_SLUG_MAP: Record<CMSService['category'], string> = {
  'servicio-tecnico': 'servicio-tecnico',
  'desarrollo-software': 'desarrollo-software',
  'soluciones-ia': 'soluciones-ia',
};

export function getCategoryIdBySlug(
  slug: CMSService['category'],
  categories: Array<{ id: number; slug: string }>
): number | null {
  const targetSlug = CATEGORY_SLUG_MAP[slug];
  const found = categories.find((c) => c.slug === targetSlug);
  return found?.id ?? categories[0]?.id ?? null;
}

export function mapCategorySlug(category?: { slug?: string }): CMSService['category'] {
  const slug = category?.slug || '';
  if (slug === 'desarrollo-software') return 'desarrollo-software';
  if (slug === 'soluciones-ia') return 'soluciones-ia';
  return 'servicio-tecnico';
}

export function mapProjectCategory(category: string): CMSProject['category'] {
  const lower = category.toLowerCase();
  if (lower.includes('mobile') || lower.includes('app') || lower.includes('móvil')) return 'mobile';
  if (lower.includes('ia') || lower.includes('ai')) return 'ia';
  if (lower.includes('web') || lower.includes('sitio')) return 'website';
  return 'software';
}

export function mapProjectCategoryToBackend(category: CMSProject['category']): string {
  const map: Record<CMSProject['category'], string> = {
    software: 'Software',
    mobile: 'Mobile',
    ia: 'IA',
    website: 'Website',
  };
  return map[category];
}

export function mapServiceToCMS(service: BackendService): CMSService {
  const i18n = extractI18n(service.faq);
  const benefits = Array.isArray(service.benefits) ? (service.benefits as string[]) : [];
  const process = Array.isArray(service.process) ? (service.process as string[]) : [];
  const gallery = Array.isArray(service.gallery) ? (service.gallery as string[]) : [];

  return {
    id: String(service.id),
    titleEs: service.title,
    titleEn: i18n.titleEn || service.title,
    category: mapCategorySlug(service.category),
    descShortEs: service.shortDesc || '',
    descShortEn: i18n.descShortEn || service.shortDesc || '',
    descLongEs: service.description || '',
    descLongEn: i18n.descLongEn || service.description || '',
    iconName: service.icon || 'Laptop',
    image: service.imageUrl || IMAGES.techRepair,
    gallery,
    benefitsEs: benefits,
    benefitsEn: i18n.benefitsEn || benefits,
    processEs: process,
    processEn: i18n.processEn || process,
    status: service.active ? 'active' : 'inactive',
    order: service.order,
  };
}

export function mapServiceToBackend(
  service: Omit<CMSService, 'id'> | Partial<CMSService>,
  categoryId: number
) {
  return {
    categoryId,
    title: service.titleEs || '',
    shortDesc: service.descShortEs || '',
    description: service.descLongEs || '',
    icon: service.iconName || 'Laptop',
    imageUrl: service.image || '',
    gallery: service.gallery || [],
    benefits: service.benefitsEs || [],
    process: service.processEs || [],
    faq: buildI18nPayload({
      titleEn: service.titleEn,
      descShortEn: service.descShortEn,
      descLongEn: service.descLongEn,
      benefitsEn: service.benefitsEn,
      processEn: service.processEn,
    }),
    active: service.status !== 'inactive',
    order: service.order ?? 0,
  };
}

export function mapProjectToCMS(project: BackendProject): CMSProject {
  const i18n = extractI18n(project.gallery);
  const tech = Array.isArray(project.techStack) ? (project.techStack as string[]) : [];
  const gallery = Array.isArray(project.gallery)
    ? (project.gallery as string[]).filter((g) => typeof g === 'string')
    : [];

  return {
    id: String(project.id),
    titleEs: project.title,
    titleEn: i18n.titleEn || project.title,
    category: mapProjectCategory(project.category),
    client: project.client || '',
    descriptionEs: project.description || project.shortDesc || '',
    descriptionEn: i18n.descriptionEn || project.description || project.shortDesc || '',
    image: project.imageUrl || IMAGES.project1,
    gallery,
    tech,
    demoUrl: project.demoUrl || undefined,
    videoUrl: project.videoUrl || undefined,
    status: project.active ? 'publicado' : 'borrador',
  };
}

export function mapProjectToBackend(project: Omit<CMSProject, 'id'> | Partial<CMSProject>) {
  const galleryItems = [...(project.gallery || [])];
  const i18nPayload = buildI18nPayload({
    titleEn: project.titleEn,
    descriptionEn: project.descriptionEn,
  });

  return {
    title: project.titleEs || '',
    category: mapProjectCategoryToBackend(project.category || 'software'),
    client: project.client || '',
    shortDesc: project.descriptionEs || '',
    description: project.descriptionEs || '',
    imageUrl: project.image || '',
    gallery: galleryItems.length > 0 ? galleryItems : [i18nPayload],
    techStack: project.tech || [],
    demoUrl: project.demoUrl || '',
    videoUrl: project.videoUrl || '',
    active: project.status !== 'borrador',
  };
}

export function mapBlogToCMS(post: BackendBlogPost): CMSBlogPost {
  const i18n = extractI18n(post.content);
  const date = post.publishedAt || post.createdAt;
  const dateObj = new Date(date);

  return {
    id: String(post.id),
    titleEs: post.title,
    titleEn: i18n.titleEn || post.title,
    slug: post.slug,
    categoryEs: post.category?.name || 'General',
    categoryEn: i18n.categoryEn || post.category?.name || 'General',
    image: post.imageUrl || IMAGES.blog1,
    summaryEs: post.excerpt || '',
    summaryEn: i18n.summaryEn || post.excerpt || '',
    contentEs: typeof post.content === 'string' ? post.content : '',
    contentEn: i18n.contentEn || (typeof post.content === 'string' ? post.content : ''),
    author: post.author || 'Global Service',
    dateEs: dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
    dateEn: dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
    readTimeEs: '5 min de lectura',
    readTimeEn: i18n.readTimeEn || '5 min read',
    status: post.status === 'published' ? 'publicado' : 'borrador',
  };
}

export function mapBlogToBackend(
  blog: Omit<CMSBlogPost, 'id'> | Partial<CMSBlogPost>,
  categoryId: number
) {
  const i18n = buildI18nPayload({
    titleEn: blog.titleEn,
    categoryEn: blog.categoryEn,
    summaryEn: blog.summaryEn,
    contentEn: blog.contentEn,
    readTimeEn: blog.readTimeEn,
  });

  return {
    categoryId,
    title: blog.titleEs || '',
    slug: blog.slug,
    excerpt: blog.summaryEs || '',
    content: JSON.stringify({ text: blog.contentEs || '', ...i18n }),
    imageUrl: blog.image || '',
    author: blog.author || 'Global Service',
    status: blog.status === 'publicado' ? 'published' : 'draft',
    publishedAt: blog.status === 'publicado' ? new Date().toISOString() : null,
  };
}

export function parseBlogContent(content: string | null | undefined): string {
  if (!content) return '';
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed.text === 'string') return parsed.text;
  } catch {
    return content;
  }
  return content;
}

export function mapTestimonialToCMS(t: BackendTestimonial): CMSTestimonial {
  let commentText = t.comment || '';
  let i18n: I18nMeta = {};

  try {
    const parsed = JSON.parse(t.comment);
    if (parsed.text) commentText = parsed.text;
    i18n = extractI18n(parsed);
  } catch {
    i18n = extractI18n(t.comment);
  }

  return {
    id: String(t.id),
    name: t.name,
    roleEs: t.role || '',
    roleEn: i18n.roleEn || t.role || '',
    rating: t.rating,
    textEs: commentText,
    textEn: i18n.textEn || commentText,
    avatar: t.imageUrl || IMAGES.client1,
  };
}

export function mapTestimonialToBackend(t: Omit<CMSTestimonial, 'id'> | Partial<CMSTestimonial>) {
  return {
    name: t.name || '',
    role: t.roleEs || '',
    comment: JSON.stringify({ text: t.textEs || '', ...buildI18nPayload({ roleEn: t.roleEn, textEn: t.textEn }) }),
    rating: t.rating ?? 5,
    imageUrl: t.avatar || '',
    active: true,
    order: 0,
  };
}

export function mapMessageToCMS(m: BackendContactMessage): CMSMessage {
  return {
    id: String(m.id),
    name: m.name,
    email: m.email,
    phone: m.phone || '',
    subject: m.service || 'Consulta general',
    message: m.message,
    serviceRequested: m.service || undefined,
    status: mapMessageStatusFromBackend(m.status),
    date: m.createdAt,
  };
}

export function mapMessageStatusFromBackend(status: BackendContactMessage['status']): CMSMessage['status'] {
  const map: Record<BackendContactMessage['status'], CMSMessage['status']> = {
    new: 'nuevo',
    read: 'nuevo',
    contacted: 'contactado',
    closed: 'cerrado',
  };
  return map[status] || 'nuevo';
}

export function mapMessageStatusToBackend(status: CMSMessage['status']): BackendContactMessage['status'] {
  const map: Record<CMSMessage['status'], BackendContactMessage['status']> = {
    nuevo: 'new',
    contactado: 'contacted',
    cerrado: 'closed',
  };
  return map[status];
}

export function mapQuoteToCMS(q: BackendQuote): CMSQuote {
  let features: string[] = [];
  let approxCost = 0;
  let solutionType = q.serviceType || 'custom';

  try {
    const parsed = JSON.parse(q.description);
    if (parsed.features) features = parsed.features;
    if (parsed.approxCost) approxCost = parsed.approxCost;
    if (parsed.solutionType) solutionType = parsed.solutionType;
  } catch {
    // plain text description
  }

  return {
    id: String(q.id),
    name: q.name,
    phone: q.phone || '',
    email: q.email,
    solutionType,
    features,
    approxCost,
    status: mapQuoteStatusFromBackend(q.status),
    date: q.createdAt,
    notes: q.description,
  };
}

export function mapQuoteStatusFromBackend(status: BackendQuote['status']): CMSQuote['status'] {
  const map: Record<BackendQuote['status'], CMSQuote['status']> = {
    new: 'nuevo',
    reviewed: 'nuevo',
    contacted: 'contactado',
    closed: 'cerrado',
  };
  return map[status];
}

export function mapQuoteStatusToBackend(status: CMSQuote['status']): BackendQuote['status'] {
  const map: Record<CMSQuote['status'], BackendQuote['status']> = {
    nuevo: 'new',
    contactado: 'contacted',
    cerrado: 'closed',
  };
  return map[status];
}

export function mapUserToCMS(user: BackendUser): User {
  return {
    id: user.id,
    username: user.email.split('@')[0],
    name: user.name,
    email: user.email,
    role: user.role === 'ADMIN' ? 'admin' : 'editor',
    avatar:
      user.avatarUrl ||
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
  };
}

export function mapMediaToCMS(m: BackendMediaFile): CMSMediaItem {
  const typeMap: Record<string, CMSMediaItem['type']> = {
    image: 'image',
    video: 'video',
    document: 'pdf',
  };

  return {
    id: String(m.id),
    name: m.originalName || m.filename,
    type: typeMap[m.type] || 'image',
    url: m.url,
    size: `${(m.size / 1024 / 1024).toFixed(1)} MB`,
    uploadedAt: m.createdAt.split('T')[0],
    useCase: m.type,
  };
}

export const DEFAULT_PAGE_CONTENTS: PageContents = {
  home: {
    heroBadgeEs: 'Ingeniería, Microelectrónica e Inteligencia Artificial',
    heroBadgeEn: 'Engineering, Microelectronics & Artificial Intelligence',
    heroTitleEs: 'Transformamos Tecnología en Soluciones Extraordinarias',
    heroTitleEn: 'We Transform Technology Into Extraordinary Solutions',
    heroSubtitleEs:
      'Soporte de alta precisión para laptops, desarrollo de software modular robusto e integración de Agentes de Inteligencia Artificial para automatizar tu negocio.',
    heroSubtitleEn:
      'High-precision support for laptops, robust modular software development, and integration of Artificial Intelligence Agents to automate your business.',
    statsExperience: '6+',
    statsProjects: '150+',
    statsRating: '4.9/5',
    statsReparations: '2400+',
  },
  nosotros: {
    titleEs: 'Quiénes Somos',
    titleEn: 'About Us',
    subtitleEs: 'Innovación, precisión y compromiso tecnológico desde Santa Cruz, Bolivia.',
    subtitleEn: 'Innovation, precision, and technological commitment from Santa Cruz, Bolivia.',
    storyTitleEs: 'Nuestra Historia',
    storyTitleEn: 'Our Story',
    storyTextEs:
      'Global Service nació con el propósito de elevar los estándares de servicio tecnológico e ingeniería en la región.',
    storyTextEn:
      'Global Service was born with the purpose of raising technology service and engineering standards in the region.',
    missionTitleEs: 'Misión',
    missionTitleEn: 'Mission',
    missionTextEs:
      'Proveer soluciones tecnológicas e ingenieriles de la más alta calidad y precisión.',
    missionTextEn:
      'Provide engineering and technological solutions of the highest quality and precision.',
    visionTitleEs: 'Visión',
    visionTitleEn: 'Vision',
    visionTextEs: 'Ser el referente regional indiscutible en microelectrónica, software e IA.',
    visionTextEn: 'To be the indisputable regional benchmark in microelectronics, software and AI.',
  },
  contacto: {
    titleEs: 'Contáctanos',
    titleEn: 'Contact Us',
    subtitleEs: 'Estamos listos para atenderte en nuestro laboratorio o de forma remota.',
    subtitleEn: 'We are ready to assist you in our laboratory or remotely.',
    phone: '+591 78459001',
    whatsapp: '+591 78459001',
    email: 'contacto@globalservice.bo',
    addressEs: 'Barrio Equipetrol, Calle 8 Este #15, Santa Cruz de la Sierra, Bolivia',
    addressEn: 'Barrio Equipetrol, Calle 8 Este #15, Santa Cruz de la Sierra, Bolivia',
    hoursEs: 'Lunes a Viernes: 08:30 - 18:30 | Sábados: 09:00 - 13:00',
    hoursEn: 'Monday to Friday: 08:30 - 18:30 | Saturdays: 09:00 - 13:00',
  },
};

export function mapPageContentsFromSettings(
  settings: Record<string, unknown>
): PageContents {
  const result = { ...DEFAULT_PAGE_CONTENTS };

  if (settings['page.home'] && typeof settings['page.home'] === 'object') {
    result.home = { ...result.home, ...(settings['page.home'] as PageContents['home']) };
  }
  if (settings['page.nosotros'] && typeof settings['page.nosotros'] === 'object') {
    result.nosotros = { ...result.nosotros, ...(settings['page.nosotros'] as PageContents['nosotros']) };
  }
  if (settings['page.contacto'] && typeof settings['page.contacto'] === 'object') {
    result.contacto = { ...result.contacto, ...(settings['page.contacto'] as PageContents['contacto']) };
  }

  if (settings['company.phone']) result.contacto.phone = String(settings['company.phone']);
  if (settings['company.email']) result.contacto.email = String(settings['company.email']);
  if (settings['company.location']) result.contacto.addressEs = String(settings['company.location']);
  if (settings['company.schedule']) result.contacto.hoursEs = String(settings['company.schedule']);

  return result;
}

export const DEFAULT_CATEGORY_PAGES: CategoryPages = {
  'servicio-tecnico': {
    badgeEs: 'Soporte de Hardware de Alta Gama',
    badgeEn: 'High-End Hardware Support',
    titleEs: 'Soluciones técnicas para que ',
    titleEn: 'Technical solutions so ',
    titleHighlightEs: 'todo funcione perfecto',
    titleHighlightEn: 'everything runs perfectly',
    subtitleEs:
      'Brindamos reparación, mantenimiento y soporte para equipos electrónicos con garantía, repuestos originales y técnicos certificados.',
    subtitleEn:
      'We provide repair, maintenance, and support for electronic equipment with warranty, original parts, and certified technicians.',
    heroImage: IMAGES.heroGamerPcRepair,
    gridTitleEs: '¿Qué equipos reparamos?',
    gridTitleEn: 'What equipment do we repair?',
    gridSubtitleEs:
      'Tenemos herramientas específicas, laboratorio de última generación y personal altamente capacitado.',
    gridSubtitleEn:
      'We have specialized tools, a state-of-the-art laboratory, and highly trained staff.',
  },
  'desarrollo-software': {
    badgeEs: 'Desarrollo de Software a Medida',
    badgeEn: 'Custom Software Development',
    titleEs: 'Sistemas robustos para ',
    titleEn: 'Robust systems for ',
    titleHighlightEs: 'escalar tu negocio',
    titleHighlightEn: 'scaling your business',
    subtitleEs:
      'Diseñamos e implementamos ERP, CRM, e-commerce y aplicaciones móviles adaptadas a tu empresa.',
    subtitleEn:
      'We design and implement ERP, CRM, e-commerce, and mobile apps tailored to your business.',
    heroImage: IMAGES.project1,
    gridTitleEs: '¿Qué soluciones desarrollamos?',
    gridTitleEn: 'What solutions do we build?',
    gridSubtitleEs: 'Plataformas modulares, escalables y optimizadas para el mercado boliviano.',
    gridSubtitleEn: 'Modular, scalable platforms optimized for the Bolivian market.',
  },
  'soluciones-ia': {
    badgeEs: 'Inteligencia Artificial Aplicada',
    badgeEn: 'Applied Artificial Intelligence',
    titleEs: 'Automatiza tu negocio con ',
    titleEn: 'Automate your business with ',
    titleHighlightEs: 'agentes inteligentes',
    titleHighlightEn: 'smart AI agents',
    subtitleEs:
      'Chatbots, agentes autónomos y automatización con IA integrada a WhatsApp y CRM.',
    subtitleEn:
      'Chatbots, autonomous agents, and AI automation integrated with WhatsApp and CRM.',
    heroImage: IMAGES.project3,
    gridTitleEs: '¿Qué soluciones de IA ofrecemos?',
    gridTitleEn: 'What AI solutions do we offer?',
    gridSubtitleEs: 'Implementaciones listas para producción con modelos avanzados.',
    gridSubtitleEn: 'Production-ready implementations with advanced models.',
  },
};

export function mapCategoryPagesFromSettings(settings: Record<string, unknown>): CategoryPages {
  const result = { ...DEFAULT_CATEGORY_PAGES };
  const slugs: Array<keyof CategoryPages> = ['servicio-tecnico', 'desarrollo-software', 'soluciones-ia'];
  for (const slug of slugs) {
    const key = `page.${slug}`;
    if (settings[key] && typeof settings[key] === 'object') {
      result[slug] = { ...result[slug], ...(settings[key] as CategoryPages[typeof slug]) };
    }
  }
  return result;
}

export function mapTeamToCMS(m: BackendTeamMember): CMSTeamMember {
  return {
    id: String(m.id),
    name: m.name,
    roleEs: m.roleEs || '',
    roleEn: m.roleEn || m.roleEs || '',
    bioEs: m.bioEs || '',
    bioEn: m.bioEn || m.bioEs || '',
    image: m.imageUrl || IMAGES.teamLeader,
    status: m.active ? 'active' : 'inactive',
    order: m.order,
  };
}

export function mapTeamToBackend(m: Omit<CMSTeamMember, 'id'> | Partial<CMSTeamMember>) {
  return {
    name: m.name || '',
    roleEs: m.roleEs || '',
    roleEn: m.roleEn || '',
    bioEs: m.bioEs || '',
    bioEn: m.bioEn || '',
    imageUrl: m.image || '',
    active: m.status !== 'inactive',
    order: m.order ?? 0,
  };
}
