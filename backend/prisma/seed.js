const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed script...');

  // 1. Create Admin User
  const adminEmail = 'admin@globalservice.bo';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123.', 10);
    await prisma.user.create({
      data: {
        name: 'Enrique Condori',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        active: true,
        avatarUrl: ''
      }
    });
    console.log('Created admin user: admin@globalservice.bo / admin123.');
  } else {
    console.log('Admin user already exists.');
  }

  // 2. Create Initial Pages
  const pagesData = [
    { title: 'Inicio', slug: 'home', description: 'Página de inicio de Global Service', metaTitle: 'Global Service - Inicio', metaDescription: 'Servicios tecnológicos integrales', status: 'published', order: 1 },
    { title: 'Nosotros', slug: 'nosotros', description: 'Sobre nuestra empresa', metaTitle: 'Global Service - Nosotros', metaDescription: 'Quiénes somos y qué hacemos', status: 'published', order: 2 },
    { title: 'Servicios', slug: 'servicios', description: 'Nuestros servicios principales', metaTitle: 'Global Service - Servicios', metaDescription: 'Catálogo de servicios tecnológicos', status: 'published', order: 3 },
    { title: 'Servicio Técnico', slug: 'servicio-tecnico', description: 'Servicio técnico especializado', metaTitle: 'Global Service - Servicio Técnico', metaDescription: 'Soporte y reparación de computadoras, celulares y más', status: 'published', order: 4 },
    { title: 'Desarrollo de Software', slug: 'desarrollo-software', description: 'Desarrollo de software a medida', metaTitle: 'Global Service - Desarrollo de Software', metaDescription: 'Sistemas ERP, CRM, aplicaciones móviles y web', status: 'published', order: 5 },
    { title: 'Soluciones con IA', slug: 'soluciones-ia', description: 'Implementaciones de inteligencia artificial', metaTitle: 'Global Service - Soluciones IA', metaDescription: 'Chatbots, automatización y agentes autónomos con IA', status: 'published', order: 6 },
    { title: 'Portafolio', slug: 'portafolio', description: 'Nuestros proyectos realizados', metaTitle: 'Global Service - Portafolio', metaDescription: 'Casos de éxito y portafolio de proyectos', status: 'published', order: 7 },
    { title: 'Blog', slug: 'blog', description: 'Artículos de tecnología e interés', metaTitle: 'Global Service - Blog', metaDescription: 'Noticias y tutoriales sobre tecnología', status: 'published', order: 8 },
    { title: 'Contacto', slug: 'contacto', description: 'Página de contacto', metaTitle: 'Global Service - Contacto', metaDescription: 'Ponte en contacto con nuestro equipo', status: 'published', order: 9 },
    { title: 'Cotización', slug: 'cotizacion', description: 'Solicitud de cotización', metaTitle: 'Global Service - Cotizar', metaDescription: 'Cotiza tus proyectos y requerimientos', status: 'published', order: 10 }
  ];

  for (const page of pagesData) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: {
        title: page.title,
        slug: page.slug,
        description: page.description,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        status: page.status,
        order: page.order,
        active: true
      }
    });
  }
  console.log('Seeded pages.');

  // Helper to get home page
  const homePage = await prisma.page.findUnique({ where: { slug: 'home' } });
  if (homePage) {
    // Add default Section
    const existingSection = await prisma.section.findFirst({
      where: { pageId: homePage.id, type: 'hero' }
    });
    if (!existingSection) {
      await prisma.section.create({
        data: {
          pageId: homePage.id,
          type: 'hero',
          title: 'Soluciones Tecnológicas Integrales',
          subtitle: 'Llevamos tu negocio al siguiente nivel con software, soporte y soluciones avanzadas de Inteligencia Artificial.',
          content: { buttonText: 'Conocer más', buttonUrl: '/servicios' },
          order: 1,
          active: true
        }
      });
      console.log('Seeded home hero section.');
    }
  }

  // 3. Create Service Categories and Services
  const categories = [
    {
      name: 'Servicio Técnico',
      slug: 'servicio-tecnico',
      description: 'Soporte y reparación experta de equipos tecnológicos.',
      icon: 'settings',
      order: 1,
      services: [
        'Laptops y Computadoras',
        'Celulares y Tablets',
        'Impresoras',
        'Televisores',
        'Consolas de Videojuegos',
        'Cámaras de Seguridad CCTV',
        'Reparación Electrónica',
        'Mantenimiento Preventivo',
        'Recuperación de Información',
        'Instalación de Software',
        'Redes y Conectividad',
        'Accesorios y Repuestos'
      ]
    },
    {
      name: 'Desarrollo de Software',
      slug: 'desarrollo-software',
      description: 'Diseño e implementación de sistemas informáticos y aplicaciones a medida.',
      icon: 'code',
      order: 2,
      services: [
        'Sistemas ERP',
        'Sistemas CRM',
        'Sistemas de Ventas',
        'Sistemas de Inventario',
        'Sistemas Contables',
        'Sistemas para Hoteles',
        'Aplicaciones Móviles',
        'Sitios Web Corporativos',
        'E-commerce',
        'Software a Medida'
      ]
    },
    {
      name: 'Soluciones con IA',
      slug: 'soluciones-ia',
      description: 'Integraciones inteligentes para automatizar procesos y mejorar la experiencia del cliente.',
      icon: 'psychology',
      order: 3,
      services: [
        'Chatbots Inteligentes',
        'Agentes IA',
        'Automatización con IA',
        'WhatsApp Chatbots',
        'Integración CRM',
        'Bases de Conocimiento'
      ]
    },
    {
      name: 'Seguridad',
      slug: 'seguridad',
      description: 'Protección de activos digitales y físicos corporativos.',
      icon: 'security',
      order: 4,
      services: []
    },
    {
      name: 'Soporte Empresarial',
      slug: 'soporte-empresarial',
      description: 'Contratos de soporte técnico mensual (Outsourcing IT) para empresas.',
      icon: 'business',
      order: 5,
      services: []
    },
    {
      name: 'Venta de Equipos',
      slug: 'venta-de-equipos',
      description: 'Venta de componentes, servidores y repuestos informáticos homologados.',
      icon: 'shopping_cart',
      order: 6,
      services: []
    }
  ];

  for (const cat of categories) {
    const createdCat = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        order: cat.order,
        active: true
      }
    });

    let serviceOrder = 1;
    for (const servTitle of cat.services) {
      const servSlug = servTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await prisma.service.upsert({
        where: { slug: servSlug },
        update: {},
        create: {
          categoryId: createdCat.id,
          title: servTitle,
          slug: servSlug,
          shortDesc: `Servicio especializado de ${servTitle} con estándares de alta calidad.`,
          description: `Ofrecemos soluciones avanzadas para ${servTitle}, garantizando confiabilidad, respaldo y un servicio profesional adaptado a sus necesidades específicas.`,
          icon: cat.icon,
          priceFrom: 150.00,
          active: true,
          featured: serviceOrder <= 3,
          order: serviceOrder++
        }
      });
    }
  }
  console.log('Seeded Service Categories and Services.');

  // 4. Create Settings
  const settingsData = [
    { key: 'company.name', value: 'GLOBAL SERVICE', group: 'company' },
    { key: 'company.slogan', value: 'Soluciones Tecnológicas Integrales', group: 'company' },
    { key: 'company.phone', value: '78459261', group: 'company' },
    { key: 'company.email', value: 'globalservice.bo@gmail.com', group: 'company' },
    { key: 'company.location', value: 'Santa Cruz - Bolivia', group: 'company' },
    { key: 'company.schedule', value: 'Lun - Sáb: 8:00 AM - 8:00 PM', group: 'company' },
    { key: 'social.facebook', value: 'https://facebook.com/globalservice', group: 'social' },
    { key: 'social.instagram', value: 'https://instagram.com/globalservice', group: 'social' },
    { key: 'social.whatsapp', value: 'https://wa.me/59178459261', group: 'social' },
    { key: 'seo.defaultTitle', value: 'GLOBAL SERVICE - Soporte y Software', group: 'seo' },
    { key: 'seo.defaultDescription', value: 'Servicios de soporte técnico, desarrollo de software a medida y soluciones avanzadas con Inteligencia Artificial.', group: 'seo' }
  ];

  for (const set of settingsData) {
    await prisma.setting.upsert({
      where: { key: set.key },
      update: {},
      create: {
        key: set.key,
        value: set.value, // will be saved as JSON automatically
        group: set.group
      }
    });
  }
  console.log('Seeded Settings.');

  // 4b. Page content settings for frontend CMS
  const pageContentSettings = [
    {
      key: 'page.home',
      group: 'pages',
      value: {
        heroBadgeEs: 'Ingeniería, Microelectrónica e Inteligencia Artificial',
        heroBadgeEn: 'Engineering, Microelectronics & Artificial Intelligence',
        heroTitleEs: 'Transformamos Tecnología en Soluciones Extraordinarias',
        heroTitleEn: 'We Transform Technology Into Extraordinary Solutions',
        heroSubtitleEs: 'Soporte de alta precisión para laptops, desarrollo de software modular robusto e integración de Agentes de Inteligencia Artificial.',
        heroSubtitleEn: 'High-precision laptop support, robust modular software development, and AI Agent integration.',
        statsExperience: '6+',
        statsProjects: '150+',
        statsRating: '4.9/5',
        statsReparations: '2400+'
      }
    },
    {
      key: 'page.nosotros',
      group: 'pages',
      value: {
        titleEs: 'Quiénes Somos',
        titleEn: 'About Us',
        subtitleEs: 'Innovación, precisión y compromiso tecnológico desde Santa Cruz, Bolivia.',
        subtitleEn: 'Innovation, precision, and technological commitment from Santa Cruz, Bolivia.',
        storyTitleEs: 'Nuestra Historia',
        storyTitleEn: 'Our Story',
        storyTextEs: 'Global Service nació con el propósito de elevar los estándares de servicio tecnológico e ingeniería en la región.',
        storyTextEn: 'Global Service was born to raise technology service and engineering standards in the region.',
        missionTitleEs: 'Misión',
        missionTitleEn: 'Mission',
        missionTextEs: 'Proveer soluciones tecnológicas de la más alta calidad y precisión.',
        missionTextEn: 'Provide technological solutions of the highest quality and precision.',
        visionTitleEs: 'Visión',
        visionTitleEn: 'Vision',
        visionTextEs: 'Ser el referente regional en microelectrónica, software e IA.',
        visionTextEn: 'To be the regional benchmark in microelectronics, software and AI.'
      }
    },
    {
      key: 'page.contacto',
      group: 'pages',
      value: {
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
    }
  ];

  for (const set of pageContentSettings) {
    await prisma.setting.upsert({
      where: { key: set.key },
      update: { value: set.value },
      create: { key: set.key, value: set.value, group: set.group }
    });
  }
  console.log('Seeded page content settings.');

  // 4c. Team members
  const teamMembers = [
    { name: 'Enrique Condori', roleEs: 'CEO & Fundador', roleEn: 'CEO & Founder', bioEs: 'Ingeniero de Sistemas especialista en microelectrónica, cloud e IA aplicada.', bioEs_en: 'Systems Engineer specializing in microelectronics, cloud and applied AI.', order: 1 },
    { name: 'Lucía Méndez', roleEs: 'Gerente de Proyectos', roleEn: 'Project Manager', bioEs: 'Scrum Master responsable de entregas ágiles y comunicación con clientes.', bioEs_en: 'Scrum Master ensuring agile deliveries and client communication.', order: 2 },
    { name: 'Rodrigo Paz', roleEs: 'Líder de Desarrollo', roleEn: 'Development Lead', bioEs: 'Full-Stack Developer experto en arquitecturas modernas e integración de IA.', bioEs_en: 'Full-Stack Developer expert in modern architectures and AI integration.', order: 3 }
  ];

  for (const tm of teamMembers) {
    const existing = await prisma.teamMember.findFirst({ where: { name: tm.name } });
    if (!existing) {
      await prisma.teamMember.create({
        data: {
          name: tm.name,
          roleEs: tm.roleEs,
          roleEn: tm.roleEn,
          bioEs: tm.bioEs,
          bioEn: tm.bioEs_en,
          active: true,
          order: tm.order
        }
      });
    }
  }
  console.log('Seeded team members.');

  // 5. Create Testimonials
  const testimonials = [
    { name: 'Juan Carlos Pérez', role: 'Gerente General', city: 'Santa Cruz', comment: 'El soporte técnico es impecable. Repararon nuestras computadoras corporativas en tiempo récord y el mantenimiento preventivo nos ha ahorrado muchos dolores de cabeza.', rating: 5, active: true, order: 1 },
    { name: 'María Fernanda Gómez', role: 'Directora de Operaciones', city: 'La Paz', comment: 'Implementamos el sistema ERP desarrollado por Global Service y la optimización en nuestros inventarios fue inmediata. 100% recomendados.', rating: 5, active: true, order: 2 },
    { name: 'Ricardo Suárez', role: 'Propietario', city: 'Cochabamba', comment: 'Su chatbot con Inteligencia Artificial ha atendido a más del 70% de nuestros clientes fuera de horario de oficina. Una gran inversión tecnológica.', rating: 5, active: true, order: 3 }
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: t
    });
  }
  console.log('Seeded Testimonials.');

  // 6. Create Projects (Demo)
  const projects = [
    {
      title: 'ERP Constructoras Bolivia',
      slug: 'erp-constructoras-bolivia',
      category: 'Sistemas',
      client: 'Constructora Urubó S.A.',
      shortDesc: 'Sistema de gestión de inventarios y flujo de caja especializado para construcción.',
      description: 'Un sistema robusto que integra almacén, personal y facturación, permitiendo reportes en tiempo real para optimizar costos de obra.',
      techStack: ['Node.js', 'React.js', 'PostgreSQL', 'Prisma'],
      demoUrl: 'https://erp-demo.globalservice.bo',
      videoUrl: '',
      active: true,
      featured: true,
      order: 1
    },
    {
      title: 'Agente IA de Soporte Whatsapp',
      slug: 'agente-ia-soporte-whatsapp',
      category: 'IA',
      client: 'Automotriz del Oriente',
      shortDesc: 'Asistente inteligente con RAG para reserva de turnos mecánicos.',
      description: 'Integración de Whatsapp Cloud API con OpenAI para consultar base de datos de talleres y agendar citas automáticamente.',
      techStack: ['Python', 'Express', 'OpenAI API', 'VectorDB'],
      demoUrl: '',
      videoUrl: 'https://youtube.com/watch?v=demo',
      active: true,
      featured: true,
      order: 2
    }
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: p
    });
  }
  console.log('Seeded Projects.');

  // 7. Create Blog Categories and Posts
  const blogCats = [
    { name: 'Tecnología', slug: 'tecnologia', description: 'Artículos de tecnología general' },
    { name: 'Ciberseguridad', slug: 'ciberseguridad', description: 'Protección de datos y redes' },
    { name: 'Inteligencia Artificial', slug: 'inteligencia-artificial', description: 'Últimos avances de IA' }
  ];

  for (const bc of blogCats) {
    const createdBc = await prisma.blogCategory.upsert({
      where: { slug: bc.slug },
      update: {},
      create: {
        name: bc.name,
        slug: bc.slug,
        description: bc.description,
        active: true
      }
    });

    if (bc.slug === 'tecnologia') {
      await prisma.blogPost.upsert({
        where: { slug: 'como-mantener-tu-laptop-en-estado-optimo' },
        update: {},
        create: {
          categoryId: createdBc.id,
          title: 'Cómo mantener tu Laptop en estado óptimo',
          slug: 'como-mantener-tu-laptop-en-estado-optimo',
          excerpt: 'Consejos esenciales de limpieza y software para alargar la vida de tu laptop.',
          content: 'El mantenimiento de una laptop es crucial para evitar el sobrecalentamiento. En este artículo te explicamos la importancia del cambio de pasta térmica, limpieza física de ventiladores e instalación de actualizaciones oficiales de sistema operativo...',
          imageUrl: '',
          author: 'Enrique Condori',
          status: 'published',
          views: 120,
          publishedAt: new Date()
        }
      });
    }
  }
  console.log('Seeded Blog Categories and Posts.');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
