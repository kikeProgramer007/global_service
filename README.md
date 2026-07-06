# GLOBAL SERVICE — CMS Web

Sitio web corporativo con panel de administración (CMS) para **GLOBAL SERVICE**. El proyecto está dividido en dos aplicaciones independientes:

| Carpeta | Descripción | Puerto por defecto |
|---|---|---|
| `backend/` | API REST (Node.js + Express + Prisma + PostgreSQL) | `4000` |
| `frontend/` | Sitio web y panel CMS (React + Vite + TypeScript) | `5000` |

---

## Requisitos generales

| Requisito | Backend | Frontend |
|---|---|---|
| **Node.js** | v18 o superior (recomendado v20 LTS) | v18 o superior |
| **npm** | v9+ | v9+ |
| **PostgreSQL** | v14+ (local o remoto) | — |
| **Git** | Opcional | Opcional |

Herramientas recomendadas para pruebas de API: [Postman](https://www.postman.com/) (colección incluida en `backend/global-service-cms.postman_collection.json`).

---

## Backend

### Tecnologías

- Express.js, Prisma ORM, PostgreSQL
- Autenticación JWT + bcrypt
- Subida de archivos con Multer (`/uploads/images`, `/uploads/documents`, `/uploads/videos`)

### Instalación paso a paso

```bash
cd backend
npm install
```

Crea el archivo `.env` en la carpeta `backend/`:

```env
PORT=4000
APP_URL=http://localhost:4000
DATABASE_URL=postgresql://USUARIO:CONTRASEÑA@HOST:5432/globalservice_cms?schema=public
JWT_SECRET=CAMBIA_ESTA_CLAVE_SEGURA
JWT_EXPIRES_IN=7d
UPLOAD_DIR=uploads
```

Sincroniza el esquema de la base de datos y genera el cliente Prisma:

```bash
npx prisma db push
npx prisma generate
```

> **Nota:** En servidores PostgreSQL remotos, `npx prisma migrate dev` puede fallar con error **P3014** (sin permiso para crear shadow database). Usa `db push` en esos entornos.

Pobla datos iniciales (páginas, servicios, configuraciones, usuario admin):

```bash
npm run seed
```

Credenciales del administrador creado por el seed:

- **Email:** `admin@globalservice.bo`
- **Password:** `admin123.`

Inicia el servidor:

```bash
# Desarrollo (recarga automática)
npm run dev

# Producción
npm start
```

La API quedará disponible en `http://localhost:4000`.

Documentación detallada de endpoints: ver `backend/README.md`.

---

## Frontend

### Tecnologías

- React 19, TypeScript, Vite 6, Tailwind CSS 4
- Consume la API del backend vía proxy en desarrollo

### Instalación paso a paso

```bash
cd frontend
npm install
```

Copia el archivo de entorno de ejemplo:

```bash
cp .env.example .env
```

En **desarrollo local**, deja `VITE_API_URL` vacío. Vite redirige `/api` y `/uploads` al backend en `http://localhost:4000` (configurado en `vite.config.ts`).

Inicia el servidor de desarrollo:

```bash
npm run dev
```

El sitio quedará en `http://localhost:5000`.

### Compilar para producción

```bash
npm run build
```

Los archivos estáticos se generan en `frontend/dist/`. Para previsualizar el build:

```bash
npm run preview
```

En producción, define la URL del backend antes de compilar:

```env
VITE_API_URL=https://api.tudominio.com
```

---

## Desarrollo local (ambos servicios)

Abre dos terminales:

```bash
# Terminal 1 — Backend
cd backend
npm start

# Terminal 2 — Frontend
cd frontend
npm run dev
```

| Servicio | URL |
|---|---|
| Frontend | http://localhost:5000 |
| Backend API | http://localhost:4000 |
| Panel admin | http://localhost:5000 → acceso desde el menú o login directo |

---

## Colección Postman

Importa el archivo:

```
backend/global-service-cms.postman_collection.json
```

Variables de la colección:

| Variable | Valor por defecto |
|---|---|
| `base_url` | `http://localhost:4000` |
| `token` | Se guarda automáticamente al hacer login |

Ejecuta primero **Iniciar Sesión (Login)** para autorizar las rutas del panel administrativo.

---

## Despliegue en VPS Ubuntu

Guía para desplegar backend y frontend en un servidor Ubuntu 22.04/24.04, accesible por **subdominio** o **IP pública**.

### 1. Preparar el servidor

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git nginx certbot python3-certbot-nginx
```

Instalar Node.js 20 LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2. Clonar el proyecto

```bash
cd /var/www
sudo git clone https://github.com/TU_USUARIO/globalservice.git
sudo chown -R $USER:$USER globalservice
cd globalservice
```

### 3. Desplegar el backend

```bash
cd backend
npm install --production
```

Crear `.env` de producción (ajusta valores reales):

```env
PORT=4000
APP_URL=https://api.tudominio.com
DATABASE_URL=postgresql://USUARIO:CONTRASEÑA@localhost:5432/globalservice_cms?schema=public
JWT_SECRET=CLAVE_LARGA_Y_ALEATORIA
JWT_EXPIRES_IN=7d
UPLOAD_DIR=uploads
```

Sincronizar base de datos y seed:

```bash
npx prisma db push
npx prisma generate
npm run seed
```

Iniciar con PM2:

```bash
pm2 start src/server.js --name globalservice-api
pm2 save
pm2 startup
```

Crear carpetas de uploads con permisos de escritura:

```bash
mkdir -p uploads/images uploads/documents uploads/videos
chmod -R 755 uploads
```

### 4. Compilar y desplegar el frontend

```bash
cd /var/www/globalservice/frontend
npm install
```

Crear `.env` de producción apuntando a la API:

```env
# Con subdominio
VITE_API_URL=https://api.tudominio.com

# Con IP pública (sin dominio)
# VITE_API_URL=http://TU_IP_PUBLICA:4000
```

Compilar:

```bash
npm run build
```

Los archivos quedan en `frontend/dist/`.

### 5. Configurar Nginx

#### Opción A — Subdominios (recomendado)

- `tudominio.com` → frontend
- `api.tudominio.com` → backend

Apunta los registros DNS **A** de ambos subdominios a la IP del VPS.

**Frontend** — `/etc/nginx/sites-available/globalservice-web`:

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    root /var/www/globalservice/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Backend** — `/etc/nginx/sites-available/globalservice-api`:

```nginx
server {
    listen 80;
    server_name api.tudominio.com;

    client_max_body_size 55M;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activar sitios:

```bash
sudo ln -s /etc/nginx/sites-available/globalservice-web /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/globalservice-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Certificados SSL gratuitos:

```bash
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
sudo certbot --nginx -d api.tudominio.com
```

#### Opción B — IP pública (sin dominio)

Si solo tienes la IP del VPS (ejemplo: `203.0.113.50`):

**Frontend** en puerto 80:

```nginx
server {
    listen 80;
    server_name 203.0.113.50;

    root /var/www/globalservice/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Backend** en puerto 4000 expuesto directamente o en otro puerto de Nginx:

```nginx
server {
    listen 4000;
    server_name 203.0.113.50;

    client_max_body_size 55M;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Compila el frontend con:

```env
VITE_API_URL=http://203.0.113.50:4000
```

> Abrir el puerto 4000 en el firewall si se expone directamente: `sudo ufw allow 4000/tcp`

### 6. PostgreSQL en el VPS (opcional)

Si la base de datos corre en el mismo servidor:

```bash
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres psql
```

```sql
CREATE USER globalservice_user WITH PASSWORD 'CONTRASEÑA_SEGURA';
CREATE DATABASE globalservice_cms OWNER globalservice_user;
GRANT ALL PRIVILEGES ON DATABASE globalservice_cms TO globalservice_user;
```

Actualiza `DATABASE_URL` en el `.env` del backend con `localhost`.

### 7. Verificación final

| Comprobación | URL esperada |
|---|---|
| API responde | `https://api.tudominio.com/` o `http://IP:4000/` |
| Sitio web carga | `https://tudominio.com` o `http://IP` |
| Login CMS | Credenciales del seed |
| Archivos subidos | `https://api.tudominio.com/uploads/images/...` |

Logs del backend en producción:

```bash
pm2 logs globalservice-api
pm2 restart globalservice-api
```

---

## Estructura del repositorio

```
globalservice/
├── backend/          # API REST + Prisma + uploads
│   ├── prisma/       # Esquema y seed
│   ├── src/          # Controllers, routes, middlewares
│   └── global-service-cms.postman_collection.json
├── frontend/         # SPA React + panel CMS
│   ├── src/
│   └── dist/         # Build de producción (generado)
└── README.md
```

---

## Licencia

Proyecto privado de GLOBAL SERVICE.
