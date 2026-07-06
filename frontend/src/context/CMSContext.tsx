import React, { createContext, useContext, useState, useEffect } from 'react';
import { IMAGES } from '../assets';
import { Project, BlogPost } from '../types';

// Role Types
export type UserRole = 'admin' | 'editor';

export interface User {
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
  iconName: string; // lucide icon name
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
  
  // Auth actions
  login: (username: string, role: UserRole) => boolean;
  logout: () => void;
  addUser: (user: User) => void;
  deleteUser: (username: string) => void;

  // Page Edit Action
  updatePageContents: (page: keyof PageContents, contents: any) => void;

  // Services CRUD
  addService: (service: Omit<CMSService, 'id'>) => void;
  updateService: (id: string, service: Partial<CMSService>) => void;
  deleteService: (id: string) => void;

  // Projects CRUD
  addProject: (project: Omit<CMSProject, 'id'>) => void;
  updateProject: (id: string, project: Partial<CMSProject>) => void;
  deleteProject: (id: string) => void;

  // Blog CRUD
  addBlog: (blog: Omit<CMSBlogPost, 'id'>) => void;
  updateBlog: (id: string, blog: Partial<CMSBlogPost>) => void;
  deleteBlog: (id: string) => void;

  // Form submission actions
  submitMessage: (message: Omit<CMSMessage, 'id' | 'status' | 'date'>) => void;
  submitQuote: (quote: Omit<CMSQuote, 'id' | 'status' | 'date'>) => void;
  updateMessageStatus: (id: string, status: CMSMessage['status']) => void;
  updateQuoteStatus: (id: string, status: CMSQuote['status']) => void;

  // Testimonials CRUD
  addTestimonial: (testimonial: Omit<CMSTestimonial, 'id'>) => void;
  updateTestimonial: (id: string, testimonial: Partial<CMSTestimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // Multimedia actions
  addMediaItem: (item: Omit<CMSMediaItem, 'id' | 'uploadedAt'>) => void;
  deleteMediaItem: (id: string) => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

// Helper to generate UUID
const generateId = () => Math.random().toString(36).substring(2, 9);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Users Initialization
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('cms_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error parsing cms_current_user from localStorage', e);
      return null;
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('cms_users');
    if (saved) return JSON.parse(saved);
    return [
      {
        username: 'enrique',
        name: 'Enrique Condori',
        email: 'enrique.condori@globalservice.bo',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150'
      },
      {
        username: 'lucia',
        name: 'Lucía Méndez',
        email: 'lucia.mendez@globalservice.bo',
        role: 'editor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
      }
    ];
  });

  // 2. Services Initialization
  const [services, setServices] = useState<CMSService[]>(() => {
    const saved = localStorage.getItem('cms_services');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 's1',
        titleEs: 'Reparación de Laptops y Computadoras',
        titleEn: 'Laptop & Computer Repair',
        category: 'servicio-tecnico',
        descShortEs: 'Reparaciones microelectrónicas complejas a nivel de placa base, reballing, cambio de conectores y pantallas.',
        descShortEn: 'Complex microelectronic motherboard level repairs, reballing, port replacements, and screen swaps.',
        descLongEs: 'Nuestro laboratorio especializado cuenta con estaciones de soldado infrarrojo de última generación, permitiéndonos realizar diagnósticos milimétricos y soldaduras microscópicas para revivir placas madre dadas por muertas.',
        descLongEn: 'Our specialized laboratory is equipped with state-of-the-art infrared soldering stations, allowing us to perform millimetric diagnostics and microscopic soldering to revive dead motherboards.',
        iconName: 'Laptop',
        image: IMAGES.techRepair,
        gallery: [IMAGES.techRepair, IMAGES.heroLaptop],
        benefitsEs: ['Diagnóstico gratuito sin compromiso', 'Garantía real escrita por 3 meses', 'Repuestos originales certificados', 'Tiempos de entrega express'],
        benefitsEn: ['Free estimate with no obligation', 'Real 3-month written warranty', 'Certified original replacement parts', 'Express turnaround times'],
        processEs: ['Recepción y etiquetado con número de orden', 'Diagnóstico microelectrónico en laboratorio', 'Aprobación de cotización por el cliente', 'Reparación, pruebas térmicas de estrés y entrega'],
        processEn: ['Device intake and order numbering', 'Microelectronics lab diagnostic', 'Client budget approval', 'Repair, thermal stress testing, and delivery'],
        status: 'active',
        order: 1
      },
      {
        id: 's2',
        titleEs: 'Mantenimiento Preventivo y Térmico',
        titleEn: 'Preventive & Thermal Maintenance',
        category: 'servicio-tecnico',
        descShortEs: 'Limpieza física profunda interna, cambio de pasta térmica de alto rendimiento y optimización de ventilación.',
        descShortEn: 'Deep internal physical cleaning, high-performance thermal paste replacement, and cooling optimization.',
        descLongEs: 'Evita costosas quemaduras de procesador. Realizamos un soplado de polvo microscópico, lubricamos ventiladores ruidosos y aplicamos compuesto térmico premium para bajar la temperatura de tu laptop hasta 15°C.',
        descLongEn: 'Avoid costly CPU burnouts. We perform microscopic dust blowing, lubricate noisy fans, and apply premium thermal compound to lower your laptop temperature by up to 15°C.',
        iconName: 'Wrench',
        image: IMAGES.heroLaptop,
        gallery: [IMAGES.heroLaptop],
        benefitsEs: ['Aumenta la vida útil del equipo', 'Mejora el rendimiento FPS y renderizado', 'Elimina reinicios inesperados', 'Limpieza externa de pantalla y teclado gratis'],
        benefitsEn: ['Extends device life span', 'Improves FPS and rendering performance', 'Eliminates unexpected reboots', 'Free screen and keyboard external cleaning'],
        processEs: ['Desensamble minucioso del chasis', 'Soplado antiestático y limpieza de conductos', 'Remoción de pasta térmica seca y aplicación de nueva', 'Monitoreo de curvas de temperatura post-mantenimiento'],
        processEn: ['Thorough chassis disassembly', 'Antistatic blowing and air vent cleaning', 'Dry thermal paste removal and fresh application', 'Post-maintenance temperature monitoring'],
        status: 'active',
        order: 2
      },
      {
        id: 's3',
        titleEs: 'Desarrollo de Sistemas ERP y CRM a Medida',
        titleEn: 'Custom ERP & CRM Development',
        category: 'desarrollo-software',
        descShortEs: 'Sistemas corporativos para control de inventarios, ventas, facturación electrónica y gestión de clientes.',
        descShortEn: 'Corporate systems for inventory control, sales, electronic invoicing, and customer management.',
        descLongEs: 'Desarrollamos plataformas empresariales Web robustas, de carga instantánea y optimizadas para celulares, integrando facturación electrónica computarizada según normativas vigentes en Bolivia.',
        descLongEn: 'We develop robust web corporate platforms, optimized for mobile devices, integrating electronic invoicing according to active Bolivian regulations.',
        iconName: 'Code',
        image: IMAGES.project1,
        gallery: [IMAGES.project1, IMAGES.project4],
        benefitsEs: ['Modularidad total para expandir en el futuro', 'Cero costos de licencia por usuario', 'Código fuente entregado al finalizar', 'Seguridad de datos con encriptación militar'],
        benefitsEn: ['Full modularity for future expansion', 'Zero per-user licensing costs', 'Source code delivered on project completion', 'Military-grade data encryption security'],
        processEs: ['Análisis y mapeo de procesos internos', 'Diseño de maquetas e interfaz de usuario (UX/UI)', 'Desarrollo de base de datos e integración de APIs', 'Capacitación al personal y despliegue en la nube'],
        processEn: ['Internal workflow mapping and analysis', 'UI/UX layout design mockups', 'Database development and API integration', 'Staff training and cloud deployment'],
        status: 'active',
        order: 3
      },
      {
        id: 's4',
        titleEs: 'Agentes Inteligentes de IA para WhatsApp',
        titleEn: 'Smart AI Agents for WhatsApp',
        category: 'soluciones-ia',
        descShortEs: 'Chatbots entrenados con Inteligencia Artificial autónoma para responder dudas, agendar citas y cerrar ventas 24/7.',
        descShortEn: 'Chatbots trained with autonomous Artificial Intelligence to answer questions, book appointments, and close sales 24/7.',
        descLongEs: 'Olvídate de las plantillas fijas de respuestas cuadradas. Integramos modelos de lenguaje avanzados que entienden el contexto del cliente boliviano, responden amablemente de inmediato y agendan prospectos en tu CRM de forma directa.',
        descLongEn: 'Forget about rigid response templates. We integrate advanced language models that understand local conversational context, answer immediately, and book prospects directly into your CRM.',
        iconName: 'Brain',
        image: IMAGES.project3,
        gallery: [IMAGES.project3, IMAGES.project6],
        benefitsEs: ['Atención masiva simultánea sin colas', 'Entrenamiento con tus propios PDFs y catálogos', 'Traspaso inteligente a agente humano', 'Incremento del 40% en retención de prospectos'],
        benefitsEn: ['Massive simultaneous support with zero wait', 'Trained with your own PDFs and catalogs', 'Intelligent handoff to human agents', '40% increase in lead retention'],
        processEs: ['Reunión de estructuración de base de conocimientos', 'Entrenamiento de agente y calibración de tono conversacional', 'Integración técnica con API oficial de Meta', 'Fase de prueba controlada y lanzamiento definitivo'],
        processEn: ['Knowledge base structuring meeting', 'Agent training and conversational tone calibration', 'Technical integration with Meta Cloud API', 'Controlled sandbox testing and live release'],
        status: 'active',
        order: 4
      }
    ];
  });

  // 3. Projects Initialization
  const [projects, setProjects] = useState<CMSProject[]>(() => {
    const saved = localStorage.getItem('cms_projects');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'p1',
        titleEs: 'Sistema de Ventas y Facturación Electrónica',
        titleEn: 'Sales & Electronic Invoicing System',
        category: 'software',
        client: 'Distribuidora Norte Bolivia',
        descriptionEs: 'Plataforma web integral de administración comercial, control de cajas chicas, impresión de facturas electrónicas computarizadas nacionales y control de comisiones de repartidores.',
        descriptionEn: 'Comprehensive web commerce administration platform, petty cash control, national electronic invoice printing, and delivery driver commissions.',
        image: IMAGES.project1,
        gallery: [IMAGES.project1],
        tech: ['React.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
        demoUrl: 'https://demo-facturacion.globalservice.com',
        status: 'publicado'
      },
      {
        id: 'p2',
        titleEs: 'App Móvil de Logística y Delivery Rápido',
        titleEn: 'Logistics & Fast Delivery Mobile App',
        category: 'mobile',
        client: 'FastFood Express Bolivia',
        descriptionEs: 'Aplicación móvil híbrida de alta velocidad con localización en tiempo real vía satélite para repartidores, panel administrativo de despacho de pedidos y pasarela de pago QR integrada.',
        descriptionEn: 'High-speed hybrid mobile application with real-time satellite GPS tracking for couriers, dispatch panels, and integrated instant QR payment gates.',
        image: IMAGES.project2,
        gallery: [IMAGES.project2],
        tech: ['React Native', 'Firebase Firestore', 'Google Maps API'],
        demoUrl: 'https://play.google.com/store',
        status: 'publicado'
      },
      {
        id: 'p3',
        titleEs: 'Chatbot Inmobiliario Autónomo Inteligente',
        titleEn: 'Autonomous Real Estate Smart Chatbot',
        category: 'ia',
        client: 'Inmobiliaria Santa Cruz Corp',
        descriptionEs: 'Soporte conversacional automatizado 24/7 entrenado con la base de conocimientos de condominios y terrenos de la empresa para captar, calificar y registrar prospectos de manera fluida.',
        descriptionEn: 'Automated 24/7 conversational support agent trained with the company\'s catalog of condominiums and lots to capture, pre-qualify, and log sales leads.',
        image: IMAGES.project3,
        gallery: [IMAGES.project3],
        tech: ['Python', 'OpenAI GPT-4o API', 'Meta WhatsApp API', 'Node.js'],
        status: 'publicado'
      },
      {
        id: 'p4',
        titleEs: 'Plataforma ERP Metalúrgica Industrial',
        titleEn: 'Industrial Metallurgical ERP Platform',
        category: 'software',
        client: 'Metalúrgica Oriente S.A.',
        descriptionEs: 'Sistema integral empresarial para el seguimiento de compras de mineral crudo, planificación de producción en hornos industriales, liquidación de planillas de sueldos y reportes contables.',
        descriptionEn: 'Comprehensive ERP for tracking raw mineral acquisitions, industrial furnace production scheduling, salary processing, and financial income logs.',
        image: IMAGES.project4,
        gallery: [IMAGES.project4],
        tech: ['Laravel PHP', 'MySQL', 'Bootstrap', 'AWS Serverless'],
        status: 'publicado'
      },
      {
        id: 'p5',
        titleEs: 'Sitio Web Corporativo Autogestionable SEO',
        titleEn: 'Self-Managed SEO Corporate Website',
        category: 'website',
        client: 'Clínica Dental DentalSano',
        descriptionEs: 'Portal corporativo responsive de alto rendimiento con optimización SEO interna avanzada, blog corporativo integrado, módulo de agendamiento de citas médicas y panel administrativo intuitivo.',
        descriptionEn: 'High-performance responsive corporate portal with advanced internal SEO, integrated tech blog, doctor appointment booking, and intuitive management panel.',
        image: IMAGES.project5,
        gallery: [IMAGES.project5],
        tech: ['React.js', 'Vite', 'Tailwind CSS', 'Sanity.io'],
        demoUrl: 'https://dentalsano.com',
        status: 'publicado'
      }
    ];
  });

  // 4. Blog Posts Initialization
  const [blogs, setBlogs] = useState<CMSBlogPost[]>(() => {
    const saved = localStorage.getItem('cms_blogs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'post1',
        titleEs: 'Cómo proteger tu empresa de ciberataques de ransomware',
        titleEn: 'How to Protect Your Company from Ransomware Cyberattacks',
        slug: 'proteger-empresa-ciberataques-ransomware',
        categoryEs: 'Seguridad',
        categoryEn: 'Security',
        image: IMAGES.blog1,
        summaryEs: 'El alarmante aumento de secuestros de información y hackeos en Bolivia exige medidas inmediatas. Conoce las 5 políticas básicas de seguridad digital corporativa.',
        summaryEn: 'The alarming rise in information hijacking and hacking in Bolivia demands immediate measures. Learn the 5 basic corporate digital security policies.',
        contentEs: 'El ransomware es un tipo de software malicioso que cifra los archivos de tu sistema y exige el pago de un rescate para recuperarlos. Para proteger a tu empresa, debes implementar copias de seguridad aisladas diarias, capacitar al personal sobre correos electrónicos sospechosos (phishing), mantener parches de seguridad actualizados, instalar firewalls de alta gama y limitar los privilegios de acceso de los usuarios.',
        contentEn: 'Ransomware is malicious software that encrypts system files and demands a ransom for decryption. To protect your business, deploy isolated daily backups, train staff on phishing, update system security patches, install high-grade firewalls, and limit user access privileges.',
        author: 'Enrique Condori',
        dateEs: '18 de Mayo, 2026',
        dateEn: 'May 18, 2026',
        readTimeEs: '5 min de lectura',
        readTimeEn: '5 min read',
        status: 'publicado'
      },
      {
        id: 'post2',
        titleEs: 'Ventajas de implementar un sistema ERP corporativo centralizado',
        titleEn: 'Advantages of Implementing a Centralized Corporate ERP System',
        slug: 'ventajas-sistema-erp-corporativo-centralizado',
        categoryEs: 'Desarrollo',
        categoryEn: 'Development',
        image: IMAGES.blog2,
        summaryEs: 'Centralizar tu facturación, inventario y cuentas por cobrar en un solo software agiliza la toma de decisiones empresariales. Conoce los retornos de inversión reales.',
        summaryEn: 'Centralizing your invoicing, inventory, and accounts receivable in a single software streamlines business decision-making. Learn about real ROI rates.',
        contentEs: 'Un ERP centralizado unifica todas las áreas de una organización, permitiendo que la información de inventarios alimente la facturación de forma instantánea y que tesorería visualice las cuentas por cobrar en tiempo real sin planillas duplicadas.',
        contentEn: 'A centralized ERP unifies all organizational divisions, allowing real-time inventory updates to fuel invoicing and giving accounting instant views of cash flows without spreadsheets.',
        author: 'Ing. Rodrigo Paz',
        dateEs: '05 de Junio, 2026',
        dateEn: 'June 5, 2026',
        readTimeEs: '7 min de lectura',
        readTimeEn: '7 min read',
        status: 'publicado'
      },
      {
        id: 'post3',
        titleEs: 'La revolución de los Agentes de IA en atención al cliente',
        titleEn: 'The Revolution of AI Agents in Customer Service',
        slug: 'revolucion-agentes-ia-atencion-cliente',
        categoryEs: 'Inteligencia Artificial',
        categoryEn: 'Artificial Intelligence',
        image: IMAGES.blog3,
        summaryEs: 'Los chatbots clásicos de botones están siendo reemplazados por LLMs capaces de comprender el habla natural. Descubre cómo automatizar tus ventas en WhatsApp.',
        summaryEn: 'Classic button-based chatbots are being replaced by LLMs capable of understanding natural speech. Discover how to automate your sales on WhatsApp.',
        contentEs: 'Los agentes inteligentes de Inteligencia Artificial pueden resolver dudas complejas, buscar en catálogos extensos de productos y concretar citas de ventas directamente en la agenda de tu negocio sin necesidad de cansarse o cometer errores.',
        contentEn: 'Smart AI agents can answer complex inquiries, search massive product catalogs, and book appointments directly on your business calendar without getting tired or making mistakes.',
        author: 'Enrique Condori',
        dateEs: '15 de Junio, 2026',
        dateEn: 'June 15, 2026',
        readTimeEs: '6 min de lectura',
        readTimeEn: '6 min read',
        status: 'publicado'
      }
    ];
  });

  // 5. Messages Initialization
  const [messages, setMessages] = useState<CMSMessage[]>(() => {
    const saved = localStorage.getItem('cms_messages');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'msg1',
        name: 'Carlos Mendoza',
        email: 'carlos.m@constructora.com',
        phone: '78459261',
        subject: 'Cotización de Software ERP',
        message: 'Buenas tardes. Requerimos cotizar un sistema ERP a medida para el control de obras y compras de insumos para nuestra constructora en Santa Cruz.',
        serviceRequested: 'Desarrollo de Software',
        status: 'nuevo',
        date: '2026-07-01T10:30:00Z'
      },
      {
        id: 'msg2',
        name: 'Maria René Justiniano',
        email: 'mr.justiniano@clinica.bo',
        phone: '60912448',
        subject: 'Soporte técnico de laptops',
        message: 'Hola, tenemos 5 laptops corporativas HP EliteBook con problemas de calentamiento y reinicios en nuestras oficinas de Equipetrol. Deseamos mantenimiento térmico completo.',
        serviceRequested: 'Servicio Técnico',
        status: 'contactado',
        date: '2026-07-03T15:10:00Z'
      },
      {
        id: 'msg3',
        name: 'Jorge Vaca',
        email: 'jorgevaca@comercializadora.com',
        phone: '71050203',
        subject: 'Chatbot de WhatsApp con IA',
        message: 'Hola, vi sus soluciones con IA. Vendo repuestos de autos y quisiera un chatbot inteligente conectado a mi catálogo en PDF para que los clientes consulten directo precios por WhatsApp.',
        serviceRequested: 'Soluciones IA',
        status: 'cerrado',
        date: '2026-06-28T09:45:00Z'
      }
    ];
  });

  // 6. Quotes (Quotation Step Form) Initialization
  const [quotes, setQuotes] = useState<CMSQuote[]>(() => {
    const saved = localStorage.getItem('cms_quotes');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'q1',
        name: 'Alejandro Rojas',
        phone: '70258129',
        email: 'a.rojas@tiendaonline.bo',
        solutionType: 'e_commerce',
        features: ['payment_gateway', 'user_accounts', 'admin_dashboard', 'inventory'],
        approxCost: 1150,
        status: 'nuevo',
        date: '2026-07-04T16:20:00Z',
        notes: 'Tienda de ropa con pasarela de cobro QR y panel autogestionable para inventario.'
      },
      {
        id: 'q2',
        name: 'Gabriela Pinto',
        phone: '65011988',
        email: 'gpinto@restaurante.bo',
        solutionType: 'custom_system',
        features: ['admin_dashboard', 'notifications', 'chat_integration'],
        approxCost: 950,
        status: 'contactado',
        date: '2026-07-02T11:40:00Z',
        notes: 'Sistema interno de reservas y despachos para cadena gastronómica.'
      }
    ];
  });

  // 7. Testimonials Initialization
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>(() => {
    const saved = localStorage.getItem('cms_testimonials');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 't1',
        name: 'Ing. Fernando Roca',
        roleEs: 'Gerente de Tecnología - AgroOriente',
        roleEn: 'IT Manager - AgroOriente',
        rating: 5,
        textEs: 'Llevamos nuestras laptops de diseño a varios lados y nos decían que no tenían arreglo. Global Service reparó las placas en 48 horas a un precio excelente.',
        textEn: 'We took our high-end engineering laptops to several places and they said they couldn\'t be fixed. Global Service repaired the main boards in 48 hours at an excellent rate.',
        avatar: IMAGES.client1
      },
      {
        id: 't2',
        name: 'Lic. Claudia Justiniano',
        roleEs: 'Directora Administrativa - MedGroup Bolivia',
        roleEn: 'Administrative Director - MedGroup Bolivia',
        rating: 5,
        textEs: 'Desarrollaron nuestro sistema CRM de pacientes a medida. Es veloz, intuitivo y su soporte posventa es de primer nivel. Altamente recomendados.',
        textEn: 'They developed our custom medical patient CRM. It is extremely fast, intuitive, and their after-sales support is top-notch. Highly recommended.',
        avatar: IMAGES.client2
      },
      {
        id: 't3',
        name: 'Dra. Sofía Vaca',
        roleEs: 'Fundadora - Inmuebles Santa Cruz',
        roleEn: 'Founder - Inmuebles Santa Cruz',
        rating: 5,
        textEs: 'El Agente de Inteligencia Artificial en WhatsApp responde el 100% de consultas los domingos y noches. Nos ha ahorrado horas de trabajo captando leads reales.',
        textEn: 'The WhatsApp AI agent handles 100% of property inquiries during weekends and nights. It has saved us countless hours while capturing qualified leads.',
        avatar: IMAGES.client3
      }
    ];
  });

  // 8. Media Items Initialization
  const [mediaItems, setMediaItems] = useState<CMSMediaItem[]>(() => {
    const saved = localStorage.getItem('cms_media_items');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'm1', name: 'equipos-trabajando.jpg', type: 'image', url: IMAGES.techRepair, size: '1.2 MB', uploadedAt: '2026-06-15', useCase: 'Servicio Técnico' },
      { id: 'm2', name: 'desarrollo-software.jpg', type: 'image', url: IMAGES.project1, size: '1.5 MB', uploadedAt: '2026-06-16', useCase: 'Proyectos ERP' },
      { id: 'm3', name: 'ia-inteligencia.jpg', type: 'image', url: IMAGES.project3, size: '1.8 MB', uploadedAt: '2026-06-18', useCase: 'Chatbot IA Portada' },
      { id: 'm4', name: 'servidores.jpg', type: 'image', url: IMAGES.blog2, size: '1.4 MB', uploadedAt: '2026-06-20', useCase: 'Blog Post Servidores' },
      { id: 'm5', name: 'catálogo-servicios-2026.pdf', type: 'pdf', url: '#', size: '3.4 MB', uploadedAt: '2026-06-25', useCase: 'Descargas Clientes' }
    ];
  });

  // 9. Editable Pages Content Configuration
  const [pageContents, setPageContents] = useState<PageContents>(() => {
    const saved = localStorage.getItem('cms_page_contents');
    if (saved) return JSON.parse(saved);
    return {
      home: {
        heroBadgeEs: 'Ingeniería, Microelectrónica e Inteligencia Artificial',
        heroBadgeEn: 'Engineering, Microelectronics & Artificial Intelligence',
        heroTitleEs: 'Transformamos Tecnología en Soluciones Extraordinarias',
        heroTitleEn: 'We Transform Technology Into Extraordinary Solutions',
        heroSubtitleEs: 'Soporte de alta precisión para laptops, desarrollo de software modular robusto e integración de Agentes de Inteligencia Artificial para automatizar tu negocio.',
        heroSubtitleEn: 'High-precision support for laptops, robust modular software development, and integration of Artificial Intelligence Agents to automate your business.',
        statsExperience: '6+',
        statsProjects: '150+',
        statsRating: '4.9/5',
        statsReparations: '2400+'
      },
      nosotros: {
        titleEs: 'Quiénes Somos',
        titleEn: 'About Us',
        subtitleEs: 'Innovación, precisión y compromiso tecnológico desde Santa Cruz, Bolivia.',
        subtitleEn: 'Innovation, precision, and technological commitment from Santa Cruz, Bolivia.',
        storyTitleEs: 'Nuestra Historia',
        storyTitleEn: 'Our Story',
        storyTextEs: 'Global Service nació con el propósito de elevar los estándares de servicio tecnológico e ingeniería en la región. Iniciamos como un laboratorio especializado en reparación de hardware de alta complejidad y, gracias a la confianza de nuestros clientes, evolucionamos hasta convertirnos en un centro integral de desarrollo de software y soluciones basadas en Inteligencia Artificial.',
        storyTextEn: 'Global Service was born with the purpose of raising technology service and engineering standards in the region. We started as a specialized laboratory for highly complex hardware repair, and thanks to our clients\' trust, we evolved into an integrated center for software development and Artificial Intelligence solutions.',
        missionTitleEs: 'Misión',
        missionTitleEn: 'Mission',
        missionTextEs: 'Proveer soluciones tecnológicas e ingenieriles de la más alta calidad y precisión, impulsando el crecimiento, la eficiencia y la seguridad de las empresas y profesionales que confían en nosotros.',
        missionTextEn: 'Provide engineering and technological solutions of the highest quality and precision, driving the growth, efficiency, and safety of the companies and professionals who trust us.',
        visionTitleEs: 'Visión',
        visionTitleEn: 'Vision',
        visionTextEs: 'Ser el referente regional indiscutible en microelectrónica de laptops, desarrollo de software de misión crítica e integración de Inteligencia Artificial aplicada a negocios.',
        visionTextEn: 'To be the indisputable regional benchmark in laptop microelectronics, mission-critical software development, and applied Artificial Intelligence integration.'
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
        hoursEn: 'Monday to Friday: 08:30 - 18:30 | Saturdays: 09:00 - 13:00'
      }
    };
  });

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cms_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cms_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cms_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('cms_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('cms_blogs', JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem('cms_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('cms_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('cms_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('cms_media_items', JSON.stringify(mediaItems));
  }, [mediaItems]);

  useEffect(() => {
    localStorage.setItem('cms_page_contents', JSON.stringify(pageContents));
  }, [pageContents]);


  // Actions
  const login = (username: string, role: UserRole): boolean => {
    const found = users.find(u => u.username === username.toLowerCase() && u.role === role);
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // Auto create if does not exist (flexible simulation)
    const newUser: User = {
      username: username.toLowerCase(),
      name: username.charAt(0).toUpperCase() + username.slice(1),
      email: `${username.toLowerCase()}@globalservice.bo`,
      role: role,
      avatar: role === 'admin' 
        ? 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' 
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (user: User) => {
    setUsers(prev => {
      if (prev.find(u => u.username === user.username)) return prev;
      return [...prev, user];
    });
  };

  const deleteUser = (username: string) => {
    setUsers(prev => prev.filter(u => u.username !== username));
    if (currentUser?.username === username) {
      setCurrentUser(null);
    }
  };

  const updatePageContents = (page: keyof PageContents, contents: any) => {
    setPageContents(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        ...contents
      }
    }));
  };

  // Services CRUD
  const addService = (newS: Omit<CMSService, 'id'>) => {
    const s: CMSService = {
      ...newS,
      id: 's_' + generateId()
    };
    setServices(prev => [...prev, s]);
  };

  const updateService = (id: string, s: Partial<CMSService>) => {
    setServices(prev => prev.map(item => item.id === id ? { ...item, ...s } : item));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(item => item.id !== id));
  };

  // Projects CRUD
  const addProject = (newP: Omit<CMSProject, 'id'>) => {
    const p: CMSProject = {
      ...newP,
      id: 'p_' + generateId()
    };
    setProjects(prev => [...prev, p]);
  };

  const updateProject = (id: string, p: Partial<CMSProject>) => {
    setProjects(prev => prev.map(item => item.id === id ? { ...item, ...p } : item));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(item => item.id !== id));
  };

  // Blog CRUD
  const addBlog = (newB: Omit<CMSBlogPost, 'id'>) => {
    const b: CMSBlogPost = {
      ...newB,
      id: 'blog_' + generateId()
    };
    setBlogs(prev => [b, ...prev]);
  };

  const updateBlog = (id: string, b: Partial<CMSBlogPost>) => {
    setBlogs(prev => prev.map(item => item.id === id ? { ...item, ...b } : item));
  };

  const deleteBlog = (id: string) => {
    setBlogs(prev => prev.filter(item => item.id !== id));
  };

  // Messages CRUD
  const submitMessage = (msg: Omit<CMSMessage, 'id' | 'status' | 'date'>) => {
    const m: CMSMessage = {
      ...msg,
      id: 'msg_' + generateId(),
      status: 'nuevo',
      date: new Date().toISOString()
    };
    setMessages(prev => [m, ...prev]);
  };

  const updateMessageStatus = (id: string, status: CMSMessage['status']) => {
    setMessages(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  // Quotes CRUD
  const submitQuote = (q: Omit<CMSQuote, 'id' | 'status' | 'date'>) => {
    const newQ: CMSQuote = {
      ...q,
      id: 'q_' + generateId(),
      status: 'nuevo',
      date: new Date().toISOString()
    };
    setQuotes(prev => [newQ, ...prev]);
  };

  const updateQuoteStatus = (id: string, status: CMSQuote['status']) => {
    setQuotes(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  // Testimonials CRUD
  const addTestimonial = (newT: Omit<CMSTestimonial, 'id'>) => {
    const t: CMSTestimonial = {
      ...newT,
      id: 't_' + generateId()
    };
    setTestimonials(prev => [...prev, t]);
  };

  const updateTestimonial = (id: string, t: Partial<CMSTestimonial>) => {
    setTestimonials(prev => prev.map(item => item.id === id ? { ...item, ...t } : item));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(item => item.id !== id));
  };

  // Media CRUD
  const addMediaItem = (item: Omit<CMSMediaItem, 'id' | 'uploadedAt'>) => {
    const m: CMSMediaItem = {
      ...item,
      id: 'media_' + generateId(),
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setMediaItems(prev => [m, ...prev]);
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <CMSContext.Provider value={{
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
      
      login,
      logout,
      addUser,
      deleteUser,
      updatePageContents,
      
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
      updateMessageStatus,
      submitQuote,
      updateQuoteStatus,

      addTestimonial,
      updateTestimonial,
      deleteTestimonial,

      addMediaItem,
      deleteMediaItem
    }}>
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
