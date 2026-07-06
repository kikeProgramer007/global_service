/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ActivePage {
  Home = 'home',
  Nosotros = 'nosotros',
  Servicios = 'servicios',
  ServicioTecnico = 'servicio-tecnico',
  DesarrolloSoftware = 'desarrollo-software',
  SolucionesIA = 'soluciones-ia',
  Portafolio = 'portafolio',
  Blog = 'blog',
  Contacto = 'contacto',
  Cotizacion = 'cotizacion',
  NotFound = '404',
  Mantenimiento = 'mantenimiento',
  Admin = 'admin'
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'software' | 'mobile' | 'ia' | 'website';
  image: string;
  description: string;
  client: string;
  tech: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  summary: string;
}
