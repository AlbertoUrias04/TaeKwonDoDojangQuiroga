# Propuesta: Portal Público para Alumnos y Padres

## Objetivo
Crear un portal público donde los alumnos y padres puedan ver anuncios, noticias, horarios, eventos y su información personal, mientras el sistema actual permanece como backoffice para empleados.

---

## Arquitectura Propuesta

### Opción 1: Aplicación Web Separada (Recomendada)
```
ControlFitnessGym/
├── Api/                          # Backend (actual) - sirve a ambos frontends
├── admin/                        # Sistema actual (empleados)
│   ├── src/
│   ├── package.json
│   └── ...
├── portal/                       # NUEVO - Portal público (clientes)
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js          # Landing page
│   │   │   ├── Noticias.js      # Lista de publicaciones
│   │   │   ├── NoticiaDetalle.js
│   │   │   ├── Horarios.js      # Horarios de clases
│   │   │   ├── Eventos.js       # Eventos próximos
│   │   │   ├── Contacto.js
│   │   │   └── MiPerfil.js      # Login para padres/alumnos
│   │   ├── components/
│   │   └── services/
│   ├── package.json
│   └── ...
└── README.md
```

### Opción 2: Rutas Públicas en la Misma App
- Agregar rutas públicas al React actual: `/publico/noticias`, `/publico/horarios`, etc.
- Menos recomendado porque mezcla dos audiencias diferentes

---

## Funcionalidades del Portal Público

### 1. Página de Inicio (Landing Page)
- **Descripción del gimnasio/academia**
- **Galería de fotos** de clases y eventos
- **Información de contacto**
- **Llamado a la acción**: "Inscríbete ahora"
- **Últimas noticias** destacadas

### 2. Módulo de Noticias/Publicaciones
**Para Administradores (Backoffice)**:
- Crear, editar, eliminar publicaciones
- Subir imágenes
- Programar publicaciones futuras
- Destacar publicaciones importantes
- Categorías: Eventos, Noticias, Logros, Recordatorios

**Para Visitantes/Padres (Portal)**:
- Ver lista de publicaciones
- Filtrar por categoría
- Buscar por palabra clave
- Ver detalle completo con imágenes

### 3. Horarios de Clases Públicos
- Ver horarios de todas las clases activas
- Filtrar por día de la semana
- Ver instructor, nivel (cinta), cupo disponible

### 4. Calendario de Eventos
- Exámenes de cinta
- Torneos
- Demostraciones
- Días festivos/Cierres

### 5. Área de Padres (Requiere Login)
**Portal Padres/Tutores**:
- Ver información de sus hijos
- Ver historial de pagos
- Ver próximos vencimientos
- Ver asistencias del mes
- Recibir notificaciones

### 6. Galería de Fotos/Videos
- Fotos de eventos
- Videos de competencias
- Logros de alumnos

### 7. Información de Contacto
- Formulario de contacto
- Mapa de ubicación
- Redes sociales
- WhatsApp directo

---

## Modelo de Datos (Backend)

### Nueva Entidad: Publicacion
```csharp
public class Publicacion
{
    public int Id { get; set; }
    public string Slug { get; set; }
    public string Titulo { get; set; }
    public string Resumen { get; set; }        // Texto corto para preview
    public string Contenido { get; set; }       // Contenido completo (HTML o Markdown)
    public string? ImagenPortada { get; set; }  // URL de imagen principal
    public CategoriaPublicacion Categoria { get; set; }
    public bool Destacada { get; set; }         // Aparece en home
    public bool Activa { get; set; }
    public DateTime FechaPublicacion { get; set; }
    public DateTime? FechaProgramada { get; set; }  // Para publicar en el futuro
    public int UsuarioAutorId { get; set; }
    public Usuario Autor { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime? FechaModificacion { get; set; }

    // SEO
    public string? MetaDescripcion { get; set; }
    public string? MetaKeywords { get; set; }
}

public enum CategoriaPublicacion
{
    Noticia,
    Evento,
    Logro,
    Recordatorio,
    Anuncio
}
```

### Nueva Entidad: Evento
```csharp
public class Evento
{
    public int Id { get; set; }
    public string Titulo { get; set; }
    public string Descripcion { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public string? Ubicacion { get; set; }
    public TipoEvento Tipo { get; set; }
    public bool Activo { get; set; }
    public string? ImagenPortada { get; set; }
}

public enum TipoEvento
{
    Examen,
    Torneo,
    Demostracion,
    Seminario,
    Cierre,
    Otro
}
```

### Modificación: Alumno (para portal padres)
```csharp
// Agregar a la entidad Alumno existente
public class Alumno
{
    // ... campos actuales ...

    // NUEVO: Para acceso de padres
    public string? CodigoAccesoPadres { get; set; }  // Código único para login
    public bool AccesoPadresHabilitado { get; set; }
}
```

---

## Endpoints API Necesarios

### Publicaciones (Público + Admin)
```
// Público (sin autenticación)
GET    /api/publicaciones                    # Listar publicaciones activas
GET    /api/publicaciones/destacadas         # Publicaciones destacadas
GET    /api/publicaciones/{slug}             # Detalle de publicación
GET    /api/publicaciones/categoria/{cat}    # Por categoría

// Admin (requiere autenticación)
POST   /api/publicaciones                    # Crear publicación
PUT    /api/publicaciones/{slug}             # Editar publicación
DELETE /api/publicaciones/{slug}             # Eliminar publicación
POST   /api/publicaciones/{slug}/imagen      # Subir imagen
```

### Eventos (Público + Admin)
```
// Público
GET    /api/eventos                          # Listar eventos activos
GET    /api/eventos/proximos                 # Próximos 30 días
GET    /api/eventos/{id}                     # Detalle evento

// Admin
POST   /api/eventos                          # Crear evento
PUT    /api/eventos/{id}                     # Editar evento
DELETE /api/eventos/{id}                     # Eliminar evento
```

### Horarios Públicos
```
GET    /api/clases/publico                   # Horarios públicos (sin info sensible)
GET    /api/clases/publico/{dia}             # Por día de la semana
```

### Portal Padres (Autenticación especial)
```
POST   /api/padres/login                     # Login con email + código
GET    /api/padres/mis-hijos                 # Información de alumnos
GET    /api/padres/pagos/{alumnoSlug}        # Historial de pagos
GET    /api/padres/asistencias/{alumnoSlug}  # Historial de asistencias
```

### Contacto
```
POST   /api/contacto                         # Enviar mensaje de contacto
```

---

## Stack Tecnológico Sugerido

### Frontend Portal Público
**Opción 1: React (Consistente con el admin)**
- React 18
- React Router 6
- Material-UI (tema público diferente)
- Axios
- React Query (para caché y optimización)

**Opción 2: Next.js (Mejor para SEO)**
- Next.js 14 (React framework)
- Server-Side Rendering (SSR)
- Mejor posicionamiento en Google
- Optimización automática de imágenes
- Rutas estáticas para mejor performance

### Backend (Actual - agregar endpoints)
- .NET 7/8
- Entity Framework Core
- Agregar controladores públicos (sin JWT)
- JWT separado para portal padres

### Almacenamiento de Imágenes
**Opción 1: Azure Blob Storage** (Recomendado para producción)
- Escalable
- CDN integrado
- Gestión de permisos

**Opción 2: Sistema de archivos local** (Desarrollo)
- Carpeta `wwwroot/imagenes/publicaciones`
- Servir estáticamente desde API

**Opción 3: Cloudinary** (SaaS)
- Fácil integración
- Transformaciones automáticas
- Plan gratuito disponible

---

## Autenticación

### Sistema Actual (Empleados)
- **Ya implementado**: JWT con usuario/contraseña
- **Roles**: Admin, Empleado
- **Acceso**: Backoffice completo

### Portal Padres (Nuevo)
**Opción A: Email + Código de Acceso**
```
Email: tutor@example.com
Código: ABC123XYZ (generado por el sistema)
```

**Opción B: Email + Contraseña**
- Permitir que padres creen contraseña propia
- Recuperación por email

**Opción C: Sin Login (Solo Consulta Pública)**
- Solo publicaciones y horarios públicos
- Sin acceso a datos personales

---

## Diseño Visual

### Portal Público
- **Paleta de colores**: Rojo (#d32f2f) + Negro/Blanco/Gris
- **Tipografía**: Moderna, legible, profesional
- **Responsive**: Mobile-first
- **Secciones**:
  - Hero section con imagen de fondo
  - Grid de noticias con cards
  - Calendario visual de eventos
  - Galería de fotos
  - Testimonios
  - Footer con redes sociales

### Portal Padres
- Diseño más funcional
- Dashboard con widgets:
  - Estado de pagos
  - Próximas clases
  - Asistencias del mes
  - Noticias importantes

---

## Plan de Implementación

### Fase 1: Backend - Publicaciones y Eventos (2-3 días)
1. Crear entidades `Publicacion` y `Evento`
2. Configurar Entity Framework
3. Crear migraciones
4. Implementar controladores públicos
5. Implementar subida de imágenes

### Fase 2: Portal Público - Noticias (3-4 días)
1. Setup de proyecto React/Next.js
2. Landing page básica
3. Lista de publicaciones
4. Detalle de publicación
5. Integración con API

### Fase 3: Portal Público - Horarios y Eventos (2-3 días)
1. Página de horarios públicos
2. Calendario de eventos
3. Filtros y búsqueda

### Fase 4: Backoffice - Gestión de Contenido (3-4 días)
1. CRUD de publicaciones en admin
2. Subida de imágenes
3. Preview de publicaciones
4. Gestión de eventos

### Fase 5: Portal Padres (4-5 días)
1. Sistema de autenticación especial
2. Generación de códigos de acceso
3. Dashboard de padres
4. Vista de pagos y asistencias

### Fase 6: Mejoras y Optimización (3-4 días)
1. SEO optimization
2. Performance (lazy loading, caché)
3. Responsive design
4. Testing
5. Deploy

**Total Estimado: 17-23 días de desarrollo**

---

## Hosting y Deploy

### Desarrollo
```
API:     https://localhost:5230
Admin:   http://localhost:3000
Portal:  http://localhost:3001
```

### Producción
**Opción 1: Todo en Azure**
- API: Azure App Service
- Admin: Azure Static Web Apps
- Portal: Azure Static Web Apps
- DB: Azure SQL Database
- Imágenes: Azure Blob Storage

**Opción 2: Mixto**
- API: Azure/AWS
- Frontends: Vercel/Netlify (más fácil)
- DB: SQL Server local/cloud
- Imágenes: Cloudinary

**Opción 3: VPS**
- Todo en un VPS (DigitalOcean, Linode)
- Nginx como reverse proxy
- Más control, más configuración

---

## Seguridad

### Portal Público
- Rate limiting en endpoints públicos
- CAPTCHA en formulario de contacto
- Validación de inputs
- Sanitización de HTML en publicaciones

### Portal Padres
- JWT con expiración corta (30 min)
- Refresh tokens
- 2FA opcional (SMS/Email)
- Logs de acceso
- Protección contra fuerza bruta

### Subida de Imágenes
- Validar tipo de archivo (solo imágenes)
- Limitar tamaño (max 5MB)
- Sanitizar nombres de archivo
- Antivirus scan opcional

---

## SEO y Marketing

### Optimizaciones SEO
- Meta tags dinámicos por página
- Open Graph para redes sociales
- Sitemap.xml
- Robots.txt
- Schema.org markup (LocalBusiness)
- URLs amigables

### Integraciones
- Google Analytics
- Facebook Pixel
- WhatsApp Business API
- Formularios de contacto → Email
- Newsletter (Mailchimp/SendGrid)

---

## Ejemplo de Flujos de Usuario

### Flujo 1: Padre busca información
1. Entra a www.tugimnasio.com
2. Ve últimas noticias en home
3. Navega a "Horarios" para ver clases disponibles
4. Ve un anuncio sobre próximo examen de cintas
5. Llama por teléfono o envía formulario de contacto

### Flujo 2: Padre registrado revisa pagos
1. Entra a www.tugimnasio.com/padres
2. Login con email + código
3. Ve dashboard con estado de pago (¡Vencido!)
4. Ve historial de asistencias de su hijo
5. Contacta al gimnasio para regularizar pago

### Flujo 3: Empleado publica noticia
1. Login en admin.tugimnasio.com
2. Va a "Publicaciones" → "Nueva publicación"
3. Escribe título, contenido, sube foto
4. Selecciona categoría "Evento"
5. Publica inmediatamente o programa para mañana
6. La publicación aparece automáticamente en el portal público

---

## Ventajas de Implementar el Portal

### Para el Negocio
- **Mayor visibilidad online** (SEO, redes sociales)
- **Reducción de llamadas** (info disponible 24/7)
- **Marketing gratuito** (contenido propio)
- **Mejor comunicación** con padres
- **Imagen profesional**

### Para los Padres
- **Acceso a información** sin llamar
- **Transparencia** en pagos y asistencias
- **Mantenerse informados** de eventos
- **Confianza** en la institución

### Para los Empleados
- **Menos llamadas repetitivas** ("¿Cuál es el horario?")
- **Canal oficial** de comunicación
- **Fácil gestión** de contenido
- **Historial** de publicaciones

---

## Alternativa Rápida: CMS + Portal Mínimo

Si no tienes tiempo para desarrollar todo, puedes:

1. **Usar WordPress** para noticias/blog (rápido, sin programar)
2. **Integrar API** de tu sistema con WordPress via REST
3. **Portal minimalista** en React solo para:
   - Login de padres
   - Ver pagos/asistencias
4. **WordPress** maneja:
   - Noticias
   - Eventos
   - Horarios (páginas estáticas)
   - Contacto

**Ventaja**: Lanzar en 1-2 semanas
**Desventaja**: Menos integración, dos sistemas separados

---

## Próximos Pasos Recomendados

1. **Definir prioridades**: ¿Qué es más importante primero?
   - ¿Portal público con noticias?
   - ¿Portal de padres?
   - ¿Ambos?

2. **Decidir stack tecnológico**:
   - ¿React o Next.js para el portal?
   - ¿Dónde hospedar?
   - ¿Cómo manejar imágenes?

3. **Diseñar mockups**: Crear diseño visual antes de programar

4. **Empezar con MVP**:
   - Backend: Publicaciones + Eventos
   - Frontend: Landing page + Noticias
   - Luego iterar y agregar más funcionalidades

---

## Tecnologías Alternativas

### Si quieres algo más rápido
- **Webflow**: No-code, diseño visual, hosting incluido
- **WordPress + Plugin**: Rápido, muchos temas disponibles
- **Wix/Squarespace**: Muy fácil, menos personalización

### Si quieres más control
- **Next.js + Strapi (CMS)**: Headless CMS, muy flexible
- **Gatsby + Contentful**: Static site, ultra-rápido
- **Nuxt.js (Vue)**: Si prefieres Vue en lugar de React

---

## Conclusión

Implementar un portal público es una **excelente inversión** para el negocio. Te permite:
- Atraer nuevos clientes
- Mejorar comunicación con padres
- Reducir carga operativa
- Proyectar imagen profesional

**Recomendación**: Empezar con un **MVP simple**:
1. Portal público con noticias y horarios (Fase 1-3)
2. Backoffice para gestionar contenido (Fase 4)
3. Luego agregar portal de padres (Fase 5)

¿Te gustaría que empiece a implementar alguna de estas fases?
