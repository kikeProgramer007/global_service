# Global Service CMS Backend

Este es el backend CMS Headless desarrollado en **Node.js + Express** para el sitio web de **GLOBAL SERVICE**. Utiliza **Prisma ORM** para interactuar de forma segura con una base de datos **PostgreSQL** y maneja autenticación por **JWT** y almacenamiento local de archivos con **Multer**.

---

## 🛠️ Tecnologías y Características

- **Runtime:** Node.js v18+
- **Framework:** Express.js (REST API, CORS habilitado)
- **Base de datos:** PostgreSQL en la nube
- **ORM:** Prisma Client
- **Seguridad:** Bcrypt para encriptación de claves, JWT para validación de sesiones
- **Subida de Archivos:** Guardado local subdividido por tipo (`/uploads/images`, `/uploads/documents`, `/uploads/videos`) mediante Multer con validación de extensiones y tamaños máximos
- **Generación de Slugs:** `slugify` automático con sufijo incremental ante colisiones de nombre

---

## 🚀 Requisitos e Instalación

### 1. Clonar e Instalar Dependencias

Desde la carpeta del backend (`c:\xampp\htdocs\globalservice\backend`):

```bash
npm install
```

### 2. Configuración del Archivo `.env`

El archivo `.env` ya se encuentra configurado en la raíz del proyecto con la conexión directa a la base de datos PostgreSQL:

```env
PORT=4000
APP_URL=http://localhost:4000
DATABASE_URL=postgresql://globalservice_user:globalservice123.@167.86.125.221:5432/globalservice_cms?schema=public&sslmode=disable
JWT_SECRET=CAMBIA_ESTA_CLAVE_SEGURA
JWT_EXPIRES_IN=7d
UPLOAD_DIR=uploads
```

### 3. Sincronización y Generación de la Base de Datos

Para sincronizar la base de datos sin necesidad de shadow database (por restricciones de permisos de creación del host PostgreSQL):

```bash
npx prisma db push
npx prisma generate
```

### 4. Poblar la Base de Datos (Seeding)

Para registrar las configuraciones globales, páginas iniciales (`home`, `nosotros`, `servicios`, etc.), categorías de servicios, servicios demo y el usuario administrador:

```bash
npm run seed
```

- **Administrador Creado:**
  - **Email:** `admin@globalservice.bo`
  - **Password:** `admin123.`
  - **Rol:** `ADMIN`

### 5. Iniciar el Servidor

**Modo Desarrollo (con recarga automática de Nodemon):**
```bash
npm run dev
```

**Modo Producción:**
```bash
npm start
```

El backend se iniciará en `http://localhost:4000`.

---

## 📂 Estructura del Directorio

```text
backend/
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.js
├─ uploads/
│  ├─ images/
│  ├─ documents/
│  └─ videos/
├─ src/
│  ├─ config/
│  │  └─ prisma.js
│  ├─ controllers/
│  │  ├─ auth.controller.js
│  │  ├─ dashboard.controller.js
│  │  ├─ page.controller.js
│  │  ├─ ...
│  ├─ middlewares/
│  │  ├─ auth.middleware.js
│  │  ├─ role.middleware.js
│  │  ├─ error.middleware.js
│  │  └─ upload.middleware.js
│  ├─ routes/
│  │  ├─ auth.routes.js
│  │  ├─ public.routes.js
│  │  ├─ ...
│  ├─ utils/
│  │  ├─ slug.js
│  │  ├─ response.js
│  │  └─ deleteFile.js
│  ├─ app.js
│  └─ server.js
├─ .env
├─ package.json
└─ README.md
```

---

## 📡 Endpoints de la API

### 🔓 Públicos (`http://localhost:4000/api/public`)

| Endpoint | Método | Descripción |
|---|---|---|
| `/home` | `GET` | Devuelve información de inicio (page, sections, featured services/projects, testimonials, clients, settings). |
| `/pages/:slug` | `GET` | Devuelve una página activa por su slug, junto con sus secciones. |
| `/services` | `GET` | Lista servicios activos. Filtros: `?category=`, `?featured=`, `?search=`. |
| `/services/:slug` | `GET` | Detalle de servicio por slug. |
| `/service-categories` | `GET` | Lista categorías de servicio activas. |
| `/projects` | `GET` | Lista proyectos de portafolio activos. Filtros: `?category=`, `?featured=`, `?search=`. |
| `/projects/:slug` | `GET` | Detalle del proyecto. |
| `/blog` | `GET` | Lista artículos publicados. Filtros: `?category=`, `?search=`, `?page=`, `?limit=`. |
| `/blog/:slug` | `GET` | Detalle de artículo (incrementa contador de visitas en +1). |
| `/blog-categories` | `GET` | Lista categorías del blog activas. |
| `/testimonials` | `GET` | Lista testimonios de clientes activos. |
| `/clients` | `GET` | Lista logotipos de clientes activos. |
| `/gallery` | `GET` | Lista elementos de la galería de fotos. Filtro: `?category=`. |
| `/settings` | `GET` | Mapa clave-valor de configuración global del sitio. |
| `/contact` | `POST` | Registra un mensaje del formulario de contacto público. |
| `/quote` | `POST` | Registra una solicitud del formulario de cotizaciones. |

---

### 🔒 Privados Panel Administrativo (`http://localhost:4000/api/admin`)
*Requiere cabecera `Authorization: Bearer <TOKEN>`*

#### 👤 Autenticación
- `POST /api/auth/login` - Inicia sesión del usuario CMS.
- `GET /api/auth/me` - Retorna datos del usuario activo por token.

#### 📊 Dashboard
- `GET /api/admin/dashboard/stats` - Retorna métricas cuantitativas e historial reciente.

#### 📁 CRUD del Administrador
- **Usuarios (`/users`):** `GET`, `POST`, `GET :id`, `PUT :id`, `DELETE :id`. *(Restringido a administradores)*
- **Páginas (`/pages`):** `GET`, `POST`, `GET :id`, `PUT :id`, `DELETE :id`.
- **Secciones (`/sections`):**
  - `GET /api/admin/pages/:pageId/sections` - Secciones de una página.
  - `POST /api/admin/sections` - Crear sección.
  - `GET /api/admin/sections/:id` - Detalle de sección.
  - `PUT /api/admin/sections/:id` - Actualizar sección.
  - `DELETE /api/admin/sections/:id` - Eliminar sección.
  - `PUT /api/admin/sections/:id/order` - Reordenar sección (`body: { order: 2 }`).
- **Servicios (`/services`):** `GET`, `POST`, `GET :id`, `PUT :id`, `DELETE :id` (Filtros: `?page=1&limit=10&search=&category=`).
- **Categorías Servicios (`/service-categories`):** `GET`, `POST`, `GET :id`, `PUT :id`, `DELETE :id`.
- **Proyectos (`/projects`):** `GET`, `POST`, `GET :id`, `PUT :id`, `DELETE :id`.
- **Categorías Blog (`/blog-categories`):** `GET`, `POST`, `PUT :id`, `DELETE :id`.
- **Artículos Blog (`/blog`):** `GET`, `POST`, `GET :id`, `PUT :id`, `DELETE :id`.
- **Testimonios (`/testimonials`):** `GET`, `POST`, `GET :id`, `PUT :id`, `DELETE :id`.
- **Clientes (`/clients`):** `GET`, `POST`, `GET :id`, `PUT :id`, `DELETE :id`.
- **Galería (`/gallery`):** `GET`, `POST`, `GET :id`, `PUT :id`, `DELETE :id`.
- **Media (`/media`):**
  - `GET /api/admin/media` - Lista archivos multimedia registrados.
  - `POST /api/admin/media/upload` - Sube un archivo a local y lo registra en DB.
  - `DELETE /api/admin/media/:id` - Elimina el registro y remueve físicamente el archivo del disco.
- **Mensajes de Contacto (`/contact-messages`):**
  - `GET /` - Listar mensajes de contacto.
  - `GET /:id` - Detalle (lo marca automáticamente como leído).
  - `PUT /:id/status` - Cambiar estado (`body: { status: 'contacted' }`).
  - `DELETE /:id` - Eliminar mensaje.
- **Solicitudes de Cotización (`/quotes`):**
  - `GET /` - Listar cotizaciones recibidas.
  - `GET /:id` - Detalle (lo marca como revisado).
  - `PUT /:id/status` - Cambiar estado (`body: { status: 'closed' }`).
  - `DELETE /:id` - Eliminar cotización.
- **Configuraciones (`/settings`):**
  - `GET /` - Listar todas.
  - `GET /:group` - Obtener por grupo (`company`, `social`, `seo`).
  - `PUT /:key` - Actualizar valor por clave (`body: { value: 'Nuevo Valor' }`).

---

## 💻 Ejemplos de Consumo desde el Frontend

### 1. Obtener Servicios Públicos

```javascript
const API_URL = 'http://localhost:4000';

async function fetchServices(categorySlug = '') {
  try {
    const res = await fetch(`${API_URL}/api/public/services?category=${categorySlug}`);
    const json = await res.json();
    if (json.ok) {
      console.log('Servicios:', json.data.services);
    }
  } catch (err) {
    console.error(err);
  }
}
```

### 2. Registrar Mensaje de Contacto

```javascript
async function sendContact(name, email, message, phone = '', service = '') {
  const res = await fetch(`${API_URL}/api/public/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message, phone, service })
  });
  const json = await res.json();
  if (json.ok) {
    alert('Mensaje enviado con éxito');
  } else {
    alert('Error: ' + json.message);
  }
}
```

### 3. Login de Administrador

```javascript
async function loginAdmin(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const json = await res.json();
  if (json.ok) {
    localStorage.setItem('cms_token', json.data.token);
    console.log('Usuario:', json.data.user);
  }
}
```

### 4. Subir un Archivo (Media)

Para subir imágenes o archivos multimedia desde el dashboard de administración:

```javascript
async function uploadMedia(fileInput) {
  const token = localStorage.getItem('cms_token');
  const formData = new FormData();
  formData.append('file', fileInput.files[0]); // El campo del archivo DEBE llamarse 'file'

  const res = await fetch(`${API_URL}/api/admin/media/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const json = await res.json();
  if (json.ok) {
    console.log('URL de archivo subido:', json.data.url);
  } else {
    console.error('Error al subir:', json.message);
  }
}
```

---

## 💾 Políticas de Carga de Archivos

Las subidas locales están validadas mediante Multer para evitar almacenamiento no controlado:

| Categoría | Formatos Permitidos | Tamaño Máximo | Carpeta de Destino |
|---|---|---|---|
| **Imágenes** | `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg` | **10 MB** | `/uploads/images` |
| **Documentos** | `.pdf`, `.doc`, `.docx` | **20 MB** | `/uploads/documents` |
| **Videos** | `.mp4`, `.webm` | **50 MB** | `/uploads/videos` |
