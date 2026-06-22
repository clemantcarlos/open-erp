# open-erp Master To-Do List

## Ecosistema B2B de Gestión Empresarial

### Estrategia de Sprints

```
Sprint 0 (1 semana):  Setup + Infraestructura
Sprint 1 (2 semanas): Base de Datos + Backend Core
Sprint 2 (2 semanas): REST API Completa
Sprint 3 (1 semana):  GraphQL + BI Resolvers
Sprint 4 (2 semanas): Frontend ERP
Sprint 5 (2 semanas): BI Dashboard
Sprint 6 (2 semanas): App Móvil Offline-First
Sprint 7 (1 semana):  Testing + Quality
Sprint 8 (1 semana):  Deployment + CI/CD
Sprint 9 (3 días):    Documentación + Portafolio
```

**Total estimado: 12-14 semanas**

---

## SPRINT 0: Setup del Proyecto (1 semana)

### Objetivo del Sprint
Configurar la infraestructura base del monorepo, herramientas de desarrollo, y entorno de base de datos.

### Historias de Usuario

---

#### SU-0.1: Configurar monorepo con npm workspaces

**Como** desarrollador del proyecto,
**Quiero** un monorepo estructurado con npm workspaces,
**Para** mantener todas las aplicaciones y librerías compartidas en un solo repositorio.

**Criterios de Aceptación:**
1. `package.json` raíz configurado con workspaces
2. Estructura de directorios creada
3. Scripts de development funcionando

**Tareas:**

```bash
# 1. Inicializar proyecto raíz
npm init -y
npm pkg set name="open-erp"
npm pkg set version="1.0.0"
npm pkg set private=true

# 2. Configurar workspaces
npm pkg set workspaces='["apps/*", "libs/*"]'

# 3. Crear estructura de directorios
mkdir -p apps/{erp-api,erp-frontend,bi-dashboard,field-app}
mkdir -p libs/{database,shared,types}
mkdir -p packages/{ui,utils}

# 4. Verificar estructura
ls -la apps/
ls -la libs/
```

**Archivos a crear:**
- [ ] `/package.json` (raíz)
- [ ] `/apps/.gitkeep`
- [ ] `/libs/.gitkeep`

---

#### SU-0.2: Configurar herramientas de code quality

**Como** desarrollador,
**Quiero** ESLint, Prettier y EditorConfig configurados,
**Para** mantener consistencia de código en todo el proyecto.

**Criterios de Aceptación:**
1. ESLint configurado con reglas TypeScript
2. Prettier formatea al guardar
3. EditorConfig respetado por editores

**Tareas:**

```bash
# 1. Instalar dependencias de desarrollo
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier
npm install -D @commitlint/cli @commitlint/config-conventional
npm install -D husky lint-staged

# 2. Configurar husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg 'npx commitlint --edit "$1"'
```

**Archivos a crear:**

- [ ] `/.eslintrc.js`
```javascript
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
```

- [ ] `/.prettierrc`
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

- [ ] `/.editorconfig`
```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
```

- [ ] `/.lintstagedrc`
```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

---

#### SU-0.3: Configurar Node.js version

**Como** desarrollador,
**Quiero** un archivo `.nvmrc` con la versión de Node.js,
**Para** que todos los desarrolladores usen la misma versión.

**Criterios de Aceptación:**
1. Archivo `.nvmrc` creado
2. Versión especificada: 20.x LTS

**Tareas:**

```bash
# 1. Crear .nvmrc
echo "20" > .nvmrc

# 2. Usar la versión
nvm use
```

- [ ] `/.nvmrc`

---

#### SU-0.4: Configurar variables de entorno

**Como** desarrollador,
**Quiero** un archivo `.env.example` con todas las variables necesarias,
**Para** saber qué configuración necesita cada aplicación.

**Criterios de Aceptación:**
1. Archivo `.env.example` creado
2. Variables documentadas con comentarios

**Tareas:**

- [ ] `/.env.example`
```bash
# ============================================
# Base de Datos
# ============================================
DATABASE_URL=postgresql://admin:changeme@localhost:5432/open_erp
DATABASE_SSL=false

# ============================================
# JWT / Autenticación
# ============================================
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h

# ============================================
# APIs
# ============================================
API_PORT=3000
API_PREFIX=api/v1

# ============================================
# Frontend URLs
# ============================================
CORS_ORIGIN=http://localhost:5173
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/graphql

# ============================================
# Development
# ============================================
NODE_ENV=development
LOG_LEVEL=debug
```

---

#### SU-0.5: Configurar Docker para PostgreSQL

**Como** desarrollador,
**Quiero** un `docker-compose.yml` para levantar PostgreSQL localmente,
**Para** tener una base de datos de desarrollo rápida y consistente.

**Criterios de Aceptación:**
1. PostgreSQL 16 corriendo en Docker
2. Datos persistentes en volumen
3. Puerto 5432 expuesto

**Tareas:**

- [ ] `/docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: open-erp-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: open_erp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: changeme
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d open_erp"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Opcional: pgAdmin para管理 la DB
  pgadmin:
    image: dpage/pgadmin4
    container_name: open-erp-pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@open-erp.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

**Comandos de verificación:**
```bash
docker-compose up -d
docker-compose ps
docker-compose logs postgres
```

---

#### SU-0.6: Configurar gitignore

**Como** desarrollador,
**Quiero** un `.gitignore` completo,
**Para** no subir archivos sensibles o innecesarios al repositorio.

**Criterios de Aceptación:**
1. Archivos de Node ignorados
2. Archivos sensibles ignorados
3. Directorios de build ignorados

**Tareas:**

- [ ] `/.gitignore`
```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Build
dist/
build/
.next/
out/

# Testing
coverage/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDEs
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Docker
docker-compose.override.yml

# Prisma
prisma/migrations/**/migration_lock.toml

# Logs
*.log
logs/

# Temp
tmp/
temp/
```

---

### Definition of Done (Sprint 0)

- [ ] Monorepo estructurado con npm workspaces
- [ ] ESLint + Prettier configurados
- [ ] .nvmrc con Node 20
- [ ] .env.example completo
- [ ] docker-compose.yml funcional
- [ ] PostgreSQL corriendo en Docker
- [ ] pgAdmin accesible en localhost:5050
- [ ] Todos los archivos en git (sin secrets)

---

## SPRINT 1: Base de Datos (2 semanas)

### Objetivo del Sprint
Diseñar e implementar el esquema de base de datos con Prisma, incluyendo todos los modelos necesarios para el dominio ERP.

### Historias de Usuario

---

#### SU-1.1: Configurar Prisma en el monorepo

**Como** desarrollador,
**Quiero** Prisma configurado como librería compartida,
**Para** que todas las aplicaciones puedan acceder a la base de datos.

**Criterios de Aceptación:**
1. Prisma inicializado en `libs/database`
2. Schema base configurado
3. Cliente Prisma generado

**Tareas:**

```bash
# 1. Inicializar Prisma
cd libs/database
npx prisma init

# 2. Configurar schema.prisma
# Ver SU-1.2 para el schema completo

# 3. Generar cliente
npx prisma generate
```

- [ ] `/libs/database/prisma/schema.prisma` (schema base)
- [ ] `/libs/database/package.json`
- [ ] `/libs/database/tsconfig.json`

---

#### SU-1.2: Crear modelo de Usuarios

**Como** administrador del sistema,
**Quiero** un modelo de usuario con roles,
**Para** controlar el acceso al sistema.

**Criterios de Aceptación:**
1. Modelo User con campos: id, email, nombre, rol, activo
2. Email único
3. Roles: ADMIN, MANAGER, USER

**Tareas:**

```prisma
// Agregar a libs/database/prisma/schema.prisma

enum UserRole {
  ADMIN
  MANAGER
  USER
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  role      UserRole @default(USER)
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  purchaseOrders PurchaseOrder[]
}
```

- [ ] Modelo User en schema.prisma

---

#### SU-1.3: Crear modelo de Proveedores

**Como** gerente de compras,
**Quiero** registrar proveedores con su información fiscal,
**Para** gestionar las relaciones comerciales.

**Criterios de Aceptación:**
1. Modelo Supplier con campos: razonSocial, nit, contacto, email, telefono
2. NIT único
3. Dirección opcional

**Tareas:**

```prisma
model Supplier {
  id           Int      @id @default(autoincrement())
  razonSocial  String
  nit          String   @unique
  contacto     String?
  email        String?
  telefono     String?
  direccion    String?
  activo       Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relaciones
  purchaseOrders PurchaseOrder[]
}
```

- [ ] Modelo Supplier en schema.prisma

---

#### SU-1.4: Crear modelo de Productos

**Como** gerente de almacén,
**Quiero** registrar productos con su información de peso y unidades,
**Para** gestionar el inventario correctamente.

**Criterios de Aceptación:**
1. Modelo Product con campos: sku, nombre, descripcion, unidadMedida, pesoUnitario
2. SKU único
3. Unidades: KG, UNIDAD, LITRO, METRO

**Tareas:**

```prisma
enum UnitMeasure {
  KG
  UNIDAD
  LITRO
  METRO
}

model Product {
  id            Int         @id @default(autoincrement())
  sku           String      @unique
  nombre        String
  descripcion   String?
  unidadMedida  UnitMeasure
  pesoUnitario  Decimal     @db.Decimal(10, 4)
  precioBase    Decimal     @db.Decimal(10, 2)
  activo        Boolean     @default(true)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  // Relaciones
  purchaseOrderLines PurchaseOrderLine[]
  inventory          Inventory[]
}
```

- [ ] Modelo Product en schema.prisma

---

#### SU-1.5: Crear modelo de Almacenes

**Como** gerente de almacén,
**Quiero** registrar múltiples almacenes,
**Para** gestionar el inventario por ubicación.

**Criterios de Aceptación:**
1. Modelo Warehouse con campos: nombre, direccion, capacidad
2. Nombre único
3. Almacén principal por defecto

**Tareas:**

```prisma
model Warehouse {
  id          Int      @id @default(autoincrement())
  nombre      String   @unique
  direccion   String?
  capacidad   Int?
  esPrincipal Boolean  @default(false)
  activo      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relaciones
  inventory Inventory[]
}
```

- [ ] Modelo Warehouse en schema.prisma

---

#### SU-1.6: Crear modelo de Órdenes de Compra

**Como** gerente de compras,
**Quiero** crear órdenes de compra con múltiples líneas,
**Para** gestionar las adquisiciones a proveedores.

**Criterios de Aceptación:**
1. Modelo PurchaseOrder con campos: numero, proveedorId, estado, fechaEmision, fechaEntregaEstimada
2. Número auto-generado (PO-YYYYMMDD-XXX)
3. Estados: PENDIENTE, APROBADA, RECIBIDA, CANCELADA

**Tareas:**

```prisma
enum PurchaseOrderStatus {
  PENDIENTE
  APROBADA
  RECIBIDA
  CANCELADA
}

model PurchaseOrder {
  id                     Int                  @id @default(autoincrement())
  numero                 String               @unique
  proveedorId            Int
  estado                 PurchaseOrderStatus  @default(PENDIENTE)
  fechaEmision           DateTime             @default(now())
  fechaEntregaEstimada   DateTime?
  fechaEntregaReal       DateTime?
  observaciones          String?
  montoSubtotal          Decimal              @db.Decimal(12, 2) @default(0)
  montoImpuestos         Decimal              @db.Decimal(12, 2) @default(0)
  montoTotal             Decimal              @db.Decimal(12, 2) @default(0)
  pesoNetoTotal          Decimal              @db.Decimal(12, 4) @default(0)  // Campo calculado
  createdAt              DateTime             @default(now())
  updatedAt              DateTime             @updatedAt

  // Relaciones
  proveedor  Supplier        @relation(fields: [proveedorId], references: [id])
  lineas     PurchaseOrderLine[]
  usuario    User?           @relation(fields: [usuarioId], references: [id])
  usuarioId  Int?
}
```

- [ ] Modelo PurchaseOrder en schema.prisma

---

#### SU-1.7: Crear modelo de Líneas de Orden de Compra

**Como** sistema,
**Quiero** almacenar cada línea de una orden de compra,
**Para** calcular consolidaciones como peso_neto.

**Criterios de Aceptación:**
1. Modelo PurchaseOrderLine con campos: productoId, cantidad, precioUnitario
2. Relación con PurchaseOrder y Product
3. Campo virtual calculado: pesoNeto

**Tareas:**

```prisma
model PurchaseOrderLine {
  id                Int           @id @default(autoincrement())
  ordenCompraId     Int
  productoId        Int
  cantidad          Decimal       @db.Decimal(10, 4)
  precioUnitario    Decimal       @db.Decimal(10, 2)
  precioTotal       Decimal       @db.Decimal(12, 2) @default(0)
  pesoNeto          Decimal       @db.Decimal(12, 4) @default(0)  // Calculado
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  // Relaciones
  ordenCompra PurchaseOrder    @relation(fields: [ordenCompraId], references: [id], onDelete: Cascade)
  producto    Product          @relation(fields: [productoId], references: [id])

  @@unique([ordenCompraId, productoId])
}
```

- [ ] Modelo PurchaseOrderLine en schema.prisma

---

#### SU-1.8: Crear modelo de Inventario

**Como** gerente de almacén,
**Quiero** rastrear el inventario por producto y almacén,
**Para** conocer las existencias en tiempo real.

**Criterios de Aceptación:**
1. Modelo Inventory con campos: productoId, almacenId, cantidad, costoPromedio
2. Relación única por producto + almacén
3. Valorización calculada (cantidad × costoPromedio)

**Tareas:**

```prisma
model Inventory {
  id            Int      @id @default(autoincrement())
  productoId    Int
  almacenId     Int
  cantidad      Decimal  @db.Decimal(12, 4)
  costoPromedio Decimal  @db.Decimal(10, 4)  // Costo promedio ponderado
  stockMinimo   Decimal? @db.Decimal(10, 4)
  stockMaximo   Decimal? @db.Decimal(10, 4)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relaciones
  producto Product   @relation(fields: [productoId], references: [id])
  almacen  Warehouse @relation(fields: [almacenId], references: [id])

  @@unique([productoId, almacenId])
}
```

- [ ] Modelo Inventory en schema.prisma

---

#### SU-1.9: Crear seed data inicial

**Como** desarrollador,
**Quiero** datos de prueba en la base de datos,
**Para** poder desarrollar y probar las funcionalidades.

**Criterios de Aceptación:**
1. 10 proveedores de ejemplo
2. 50 productos con diferentes unidades
3. 3 almacenes (1 principal)
4. Inventario base por producto/almacen

**Tareas:**

```typescript
// libs/database/prisma/seed.ts
import { PrismaClient, UnitMeasure, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Crear usuarios
  const admin = await prisma.user.upsert({
    where: { email: 'admin@open-erp.com' },
    update: {},
    create: {
      email: 'admin@open-erp.com',
      name: 'Administrador',
      password: '$2b$10$hashed_password_here', // hash de 'admin123'
      role: UserRole.ADMIN,
    },
  })

  // 2. Crear proveedores
  const suppliers = []
  for (let i = 1; i <= 10; i++) {
    const supplier = await prisma.supplier.upsert({
      where: { nit: `900${String(i).padStart(7, '0')}` },
      update: {},
      create: {
        razonSocial: `Proveedor ${i} S.A.`,
        nit: `900${String(i).padStart(7, '0')}`,
        contacto: `Contacto ${i}`,
        email: `proveedor${i}@example.com`,
        telefono: `+57 601 ${String(i).padStart(3, '0')}-${String(i).padStart(4, '0')}`,
      },
    })
    suppliers.push(supplier)
  }

  // 3. Crear productos
  const products = []
  const units: UnitMeasure[] = [UnitMeasure.KG, UnitMeasure.UNIDAD, UnitMeasure.LITRO, UnitMeasure.METRO]
  for (let i = 1; i <= 50; i++) {
    const product = await prisma.product.upsert({
      where: { sku: `PRD-${String(i).padStart(4, '0')}` },
      update: {},
      create: {
        sku: `PRD-${String(i).padStart(4, '0')}`,
        nombre: `Producto ${i}`,
        descripcion: `Descripción del producto ${i}`,
        unidadMedida: units[i % 4],
        pesoUnitario: Math.random() * 10 + 0.5,
        precioBase: Math.random() * 100000 + 1000,
      },
    })
    products.push(product)
  }

  // 4. Crear almacenes
  const warehouses = []
  const warehouseData = [
    { nombre: 'Almacén Principal', esPrincipal: true },
    { nombre: 'Almacén Secundario', esPrincipal: false },
    { nombre: 'Almacén Temporal', esPrincipal: false },
  ]
  for (const data of warehouseData) {
    const warehouse = await prisma.warehouse.upsert({
      where: { nombre: data.nombre },
      update: {},
      create: data,
    })
    warehouses.push(warehouse)
  }

  // 5. Crear inventario inicial
  for (const product of products) {
    for (const warehouse of warehouses) {
      await prisma.inventory.create({
        data: {
          productoId: product.id,
          almacenId: warehouse.id,
          cantidad: Math.random() * 1000 + 100,
          costoPromedio: Math.random() * 50000 + 5000,
          stockMinimo: 50,
          stockMaximo: 2000,
        },
      })
    }
  }

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

**Configurar script de seed:**

```json
// libs/database/package.json
{
  "name": "@open-erp/database",
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

**Archivos a crear:**
- [ ] `/libs/database/prisma/seed.ts`
- [ ] Configurar script de seed en package.json

---

#### SU-1.10: Ejecutar migración inicial

**Como** desarrollador,
**Quiero** que Prisma genere la migración inicial,
**Para** crear todas las tablas en la base de datos.

**Criterios de Aceptación:**
1. Migración ejecutada exitosamente
2. Todas las tablas creadas
3. Cliente Prisma regenerado

**Tareas:**

```bash
# 1. Ejecutar migración
cd libs/database
npx prisma migrate dev --name init_schema

# 2. Verificar tablas
npx prisma db push

# 3. Regenerar cliente
npx prisma generate
```

- [ ] Migración ejecutada
- [ ] Verificar tablas en pgAdmin

---

### Definition of Done (Sprint 1)

- [ ] Schema Prisma completo con todos los modelos
- [ ] Relaciones configuradas correctamente
- [ ] Seed data ejecutado
- [ ] Migración aplicada
- [ ] Cliente Prisma generado
- [ ] Datos visibles en pgAdmin
- [ ] Documentación de modelos actualizada

---

## SPRINT 2: Backend REST API (2 semanas)

### Objetivo del Sprint
Implementar el backend completo con NestJS, incluyendo autenticación, CRUD completo para todos los módulos, y la lógica de negocio para cálculos consolidados.

### Historias de Usuario

---

#### SU-2.1: Inicializar proyecto NestJS

**Como** desarrollador,
**Quiero** un proyecto NestJS configurado,
**Para** construir la API REST del ERP.

**Criterios de Aceptación:**
1. NestJS inicializado
2. Prisma integrado
3. Configuración base lista

**Tareas:**

```bash
# 1. Crear proyecto NestJS
cd apps
nest new erp-api --package-manager npm

# 2. Instalar dependencias
cd erp-api
npm install @nestjs/config @nestjs/mapped-types
npm install @nestjs/swagger swagger-ui-express
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install class-validator class-transformer
npm install bcrypt
npm install -D @types/passport-jwt @types/bcrypt

# 3. Configurar Prisma
npm install prisma @prisma/client
npx prisma init
```

**Archivos a crear:**
- [ ] `/apps/erp-api/` (estructura base NestJS)
- [ ] `/apps/erp-api/src/prisma/prisma.service.ts`
- [ ] `/apps/erp-api/src/prisma/prisma.module.ts`

---

#### SU-2.2: Configurar PrismaService

**Como** desarrollador,
**Quiero** un PrismaService reutilizable,
**Para** manejar la conexión a la base de datos.

**Criterios de Aceptación:**
1. PrismaService extiende PrismaClient
2. OnModuleInit y OnModuleDestroy implementados
3. Módulo configurado

**Tareas:**

```typescript
// apps/erp-api/src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
```

```typescript
// apps/erp-api/src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

- [ ] `/apps/erp-api/src/prisma/prisma.service.ts`
- [ ] `/apps/erp-api/src/prisma/prisma.module.ts`

---

#### SU-2.3: Configurar validación global

**Como** desarrollador,
**Quiero** validación global en la API,
**Para** rechazar requests con datos inválidos.

**Criterios de Aceptación:**
1. ValidationPipe configurado globalmente
2. Whitelist habilitado
3. DTOs validados automáticamente

**Tareas:**

```typescript
// apps/erp-api/src/main.ts
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Global prefix
  app.setGlobalPrefix('api/v1')

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('open-erp API')
    .setDescription('API REST para el sistema ERP')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(process.env.API_PORT || 3000)
  console.log(`🚀 API running on http://localhost:${process.env.API_PORT || 3000}`)
  console.log(`📚 Swagger docs: http://localhost:${process.env.API_PORT || 3000}/api/docs`)
}
bootstrap()
```

- [ ] `/apps/erp-api/src/main.ts` actualizado

---

#### SU-2.4: Crear módulo de Auth

**Como** usuario del sistema,
**Quiero** autenticarme con JWT,
**Para** acceder a los endpoints protegidos.

**Criterios de Aceptación:**
1. Login retorna JWT
2. Guard JWT protege endpoints
3. Token expira en 24h

**Tareas:**

```typescript
// apps/erp-api/src/auth/auth.module.ts
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '24h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

```typescript
// apps/erp-api/src/auth/dto/login.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'admin@open-erp.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'admin123' })
  @IsString()
  @MinLength(6)
  password: string
}
```

```typescript
// apps/erp-api/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    const payload = { sub: user.id, email: user.email, role: user.role }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  }
}
```

```typescript
// apps/erp-api/src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    })
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    })

    if (!user || !user.active) {
      throw new UnauthorizedException()
    }

    return { id: user.id, email: user.email, role: user.role }
  }
}
```

```typescript
// apps/erp-api/src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

```typescript
// apps/erp-api/src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './jwt-auth.guard'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario' })
  async getProfile(@Request() req) {
    return req.user
  }
}
```

**Archivos a crear:**
- [ ] `/apps/erp-api/src/auth/auth.module.ts`
- [ ] `/apps/erp-api/src/auth/auth.service.ts`
- [ ] `/apps/erp-api/src/auth/auth.controller.ts`
- [ ] `/apps/erp-api/src/auth/dto/login.dto.ts`
- [ ] `/apps/erp-api/src/auth/jwt.strategy.ts`
- [ ] `/apps/erp-api/src/auth/jwt-auth.guard.ts`

---

#### SU-2.5: Crear módulo de Products

**Como** gerente de inventario,
**Quiero** gestionar productos (CRUD),
**Para** mantener el catálogo actualizado.

**Criterios de Aceptación:**
1. CRUD completo: Create, Read, Update, Delete
2. Paginación en listado
3. Búsqueda por nombre o SKU
4. Validación de datos

**Tareas:**

```typescript
// apps/erp-api/src/products/dto/create-product.dto.ts
import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UnitMeasure } from '@prisma/client'

export class CreateProductDto {
  @ApiProperty({ example: 'PRD-0001' })
  @IsString()
  sku: string

  @ApiProperty({ example: 'Producto de ejemplo' })
  @IsString()
  nombre: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descripcion?: string

  @ApiProperty({ enum: UnitMeasure })
  @IsEnum(UnitMeasure)
  unidadMedida: UnitMeasure

  @ApiProperty({ example: 2.5 })
  @IsNumber()
  @Min(0)
  pesoUnitario: number

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0)
  precioBase: number
}
```

```typescript
// apps/erp-api/src/products/products.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { skip?: number; take?: number; search?: string }) {
    const { skip = 0, take = 10, search } = params
    const where = search
      ? {
          OR: [
            { nombre: { contains: search, mode: 'insensitive' as const } },
            { sku: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ])

    return { items, total, page: Math.floor(skip / take) + 1, pageSize: take }
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) throw new NotFoundException(`Producto #${id} no encontrado`)
    return product
  }

  async create(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { sku: dto.sku } })
    if (existing) throw new ConflictException(`SKU ${dto.sku} ya existe`)
    return this.prisma.product.create({ data: dto })
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id)
    return this.prisma.product.update({ where: { id }, data: dto })
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.product.delete({ where: { id } })
  }
}
```

```typescript
// apps/erp-api/src/products/products.controller.ts
import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar productos' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll({ skip, take, search })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear producto' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar producto' })
  update(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar producto' })
  remove(@Param('id') id: number) {
    return this.productsService.remove(id)
  }
}
```

**Archivos a crear:**
- [ ] `/apps/erp-api/src/products/products.module.ts`
- [ ] `/apps/erp-api/src/products/products.service.ts`
- [ ] `/apps/erp-api/src/products/products.controller.ts`
- [ ] `/apps/erp-api/src/products/dto/create-product.dto.ts`
- [ ] `/apps/erp-api/src/products/dto/update-product.dto.ts`
- [ ] `/apps/erp-api/src/products/entities/product.entity.ts`

---

#### SU-2.6: Crear módulo de Suppliers

**Como** gerente de compras,
**Quiero** gestionar proveedores (CRUD),
**Para** mantener el directorio de proveedores actualizado.

**Criterios de Aceptación:**
1. CRUD completo
2. Búsqueda por NIT o razón social
3. Validación de NIT único

**Tareas:**

**Archivos a crear:**
- [ ] `/apps/erp-api/src/suppliers/suppliers.module.ts`
- [ ] `/apps/erp-api/src/suppliers/suppliers.service.ts`
- [ ] `/apps/erp-api/src/suppliers/suppliers.controller.ts`
- [ ] `/apps/erp-api/src/suppliers/dto/create-supplier.dto.ts`
- [ ] `/apps/erp-api/src/suppliers/dto/update-supplier.dto.ts`

**Lógica similar a Products:**
```typescript
// Crear, actualizar, eliminar, buscar por NIT
// Paginación con skip/take
// Búsqueda fuzzy por razonSocial
```

---

#### SU-2.7: Crear módulo de Purchase Orders con lógica de negocio

**Como** gerente de compras,
**Quiero** crear órdenes de compra con cálculo automático de consolidaciones,
**Para** conocer el peso total y monto de cada orden.

**Criterios de Aceptación:**
1. CRUD completo de órdenes de compra
2. Creación de líneas asociadas
3. Cálculo automático de peso_neto por línea
4. Cálculo de peso_neto_total por orden
5. Número auto-generado (PO-YYYYMMDD-XXX)

**Tareas:**

```typescript
// apps/erp-api/src/purchase-orders/purchase-orders.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto'

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePurchaseOrderDto) {
    // Generar número de orden
    const numero = await this.generateOrderNumber()

    // Crear orden con líneas
    const order = await this.prisma.purchaseOrder.create({
      data: {
        numero,
        proveedorId: dto.proveedorId,
        fechaEntregaEstimada: dto.fechaEntregaEstimada,
        observaciones: dto.observaciones,
        lineas: {
          create: dto.lineas.map((linea) => ({
            productoId: linea.productoId,
            cantidad: linea.cantidad,
            precioUnitario: linea.precioUnitario,
            precioTotal: linea.cantidad * linea.precioUnitario,
            pesoNeto: 0, // Se calcula después
          })),
        },
      },
      include: { lineas: { include: { producto: true } } },
    })

    // Calcular consolidaciones
    await this.calculateConsolidations(order.id)

    return this.findOne(order.id)
  }

  async calculateConsolidations(orderId: number) {
    const order = await this.prisma.purchaseOrder.findUnique({
      where: { id: orderId },
      include: {
        lineas: { include: { producto: true } },
      },
    })

    if (!order) throw new NotFoundException(`Orden #${orderId} no encontrada`)

    let pesoNetoTotal = 0
    let montoSubtotal = 0

    for (const linea of order.lineas) {
      // peso_neto = cantidad × pesoUnitarioProducto
      const pesoNeto = Number(linea.cantidad) * Number(linea.producto.pesoUnitario)
      const precioTotal = Number(linea.cantidad) * Number(linea.precioUnitario)

      await this.prisma.purchaseOrderLine.update({
        where: { id: linea.id },
        data: {
          pesoNeto: pesoNeto,
          precioTotal: precioTotal,
        },
      })

      pesoNetoTotal += pesoNeto
      montoSubtotal += precioTotal
    }

    // Actualizar consolidación en la orden
    await this.prisma.purchaseOrder.update({
      where: { id: orderId },
      data: {
        pesoNetoTotal: pesoNetoTotal,
        montoSubtotal: montoSubtotal,
        montoImpuestos: montoSubtotal * 0.19, // IVA 19%
        montoTotal: montoSubtotal * 1.19,
      },
    })
  }

  async findOne(id: number) {
    const order = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        proveedor: true,
        lineas: { include: { producto: true } },
      },
    })

    if (!order) throw new NotFoundException(`Orden #${id} no encontrada`)
    return order
  }

  async getConsolidation(id: number) {
    const order = await this.findOne(id)
    return {
      orderId: order.id,
      numero: order.numero,
      pesoNetoTotal: order.pesoNetoTotal,
      montoSubtotal: order.montoSubtotal,
      montoImpuestos: order.montoImpuestos,
      montoTotal: order.montoTotal,
      lineas: order.lineas.map((l) => ({
        producto: l.producto.nombre,
        cantidad: l.cantidad,
        pesoNeto: l.pesoNeto,
        precioTotal: l.precioTotal,
      })),
    }
  }

  private async generateOrderNumber(): Promise<string> {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '')
    const count = await this.prisma.purchaseOrder.count({
      where: {
        numero: { startsWith: `PO-${dateStr}` },
      },
    })
    return `PO-${dateStr}-${String(count + 1).padStart(3, '0')}`
  }
}
```

**Archivos a crear:**
- [ ] `/apps/erp-api/src/purchase-orders/purchase-orders.module.ts`
- [ ] `/apps/erp-api/src/purchase-orders/purchase-orders.service.ts`
- [ ] `/apps/erp-api/src/purchase-orders/purchase-orders.controller.ts`
- [ ] `/apps/erp-api/src/purchase-orders/dto/create-purchase-order.dto.ts`
- [ ] `/apps/erp-api/src/purchase-orders/dto/update-purchase-order.dto.ts`

---

#### SU-2.8: Crear módulo de Inventory

**Como** gerente de almacén,
**Quiero** consultar y ajustar el inventario,
**Para** mantener las existencias actualizadas.

**Criterios de Aceptación:**
1. Consulta de stock por producto/almacén
2. Ajuste de inventario (entrada/salida)
3. Valorización de inventario

**Tareas:**

**Archivos a crear:**
- [ ] `/apps/erp-api/src/inventory/inventory.module.ts`
- [ ] `/apps/erp-api/src/inventory/inventory.service.ts`
- [ ] `/apps/erp-api/src/inventory/inventory.controller.ts`
- [ ] `/apps/erp-api/src/inventory/dto/adjust-inventory.dto.ts`

```typescript
// Endpoints del módulo Inventory
GET    /inventory                    → Listar todo el inventario
GET    /inventory/warehouse/:id      → Inventario por almacén
GET    /inventory/product/:id        → Inventario por producto
POST   /inventory/adjust             → Ajustar inventario
GET    /inventory/valuation          → Valorización total
```

---

#### SU-2.9: Configurar app.module.ts

**Como** desarrollador,
**Quiero** que todos los módulos estén registrados en el módulo raíz,
**Para** que la API funcione correctamente.

**Criterios de Aceptación:**
1. Todos los módulos importados
2. ConfigModule configurado
3. Variable DATABASE_URL funcionando

**Tareas:**

```typescript
// apps/erp-api/src/app.module.ts
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { ProductsModule } from './products/products.module'
import { SuppliersModule } from './suppliers/suppliers.module'
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module'
import { InventoryModule } from './inventory/inventory.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    SuppliersModule,
    PurchaseOrdersModule,
    InventoryModule,
  ],
})
export class AppModule {}
```

- [ ] `/apps/erp-api/src/app.module.ts` actualizado

---

#### SU-2.10: Testing del Backend

**Como** desarrollador,
**Quiero** tests unitarios y E2E para los servicios críticos,
**Para** asegurar que la lógica de negocio funciona correctamente.

**Criterios de Aceptación:**
1. Tests unitarios para servicios
2. Tests E2E para endpoints críticos
3. Coverage mínimo: 70%

**Tareas:**

```bash
# Ejecutar tests
npm run test

# Ejecutar tests E2E
npm run test:e2e
```

**Archivos a crear:**
- [ ] `/apps/erp-api/src/products/products.service.spec.ts`
- [ ] `/apps/erp-api/src/purchase-orders/purchase-orders.service.spec.ts`
- [ ] `/apps/erp-api/test/products.e2e-spec.ts`
- [ ] `/apps/erp-api/test/purchase-orders.e2e-spec.ts`

---

### Definition of Done (Sprint 2)

- [ ] NestJS proyecto configurado con Prisma
- [ ] Auth module con JWT funcionando
- [ ] Products CRUD completo
- [ ] Suppliers CRUD completo
- [ ] Purchase Orders con lógica de consolidación
- [ ] Inventory con ajustes y valorización
- [ ] Swagger documentado
- [ ] Tests unitarios pasando
- [ ] Tests E2E pasando
- [ ] API funcional en localhost:3000

---

## SPRINT 3: GraphQL API (1 semana)

### Objetivo del Sprint
Implementar la capa GraphQL para el dashboard BI, incluyendo resolvers para métricas financieras y cálculo dinámico de EBITDA.

### Historias de Usuario

---

#### SU-3.1: Configurar GraphQL en NestJS

**Como** desarrollador,
**Quiero** GraphQL configurado con Apollo,
**Para** exponer queries para el dashboard BI.

**Criterios de Aceptación:**
1. Apollo Server configurado
2. Code-first approach habilitado
3. Playground accesible

**Tareas:**

```bash
# Instalar dependencias
npm install @nestjs/graphql @nestjs/apollo @apollo/server
npm install graphql
```

```typescript
// apps/erp-api/src/graphql/graphql.module.ts
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
  ],
})
export class GraphQLModule {}
```

- [ ] `/apps/erp-api/src/graphql/graphql.module.ts`
- [ ] Agregar GraphQLModule a app.module.ts

---

#### SU-3.2: Crear tipos GraphQL

**Como** desarrollador,
**Quiero** tipos GraphQL para las entidades principales,
**Para** poder construir queries tipadas.

**Criterios de Aceptación:**
1. Tipos para PurchaseOrder, Product, Supplier
2. Tipos para métricas BI
3. Tipos para EBITDA

**Tareas:**

```typescript
// apps/erp-api/src/graphql/types/purchase-order.type.ts
import { ObjectType, Field, ID, Float } from '@nestjs/graphql'
import { SupplierType } from './supplier.type'
import { ProductType } from './product.type'

@ObjectType()
export class PurchaseOrderLineType {
  @Field(() => ID) id: number
  @Field(() => Float) cantidad: number
  @Field(() => Float) precioUnitario: number
  @Field(() => Float) precioTotal: number
  @Field(() => Float) pesoNeto: number
  @Field(() => ProductType) producto: ProductType
}

@ObjectType()
export class PurchaseOrderType {
  @Field(() => ID) id: number
  @Field() numero: string
  @Field() estado: string
  @Field() fechaEmision: Date
  @Field(() => Float) pesoNetoTotal: number
  @Field(() => Float) montoSubtotal: number
  @Field(() => Float) montoImpuestos: number
  @Field(() => Float) montoTotal: number
  @Field(() => SupplierType) proveedor: SupplierType
  @Field(() => [PurchaseOrderLineType]) lineas: PurchaseOrderLineType[]
}
```

```typescript
// apps/erp-api/src/graphql/types/financial.type.ts
import { ObjectType, Field, Float } from '@nestjs/graphql'

@ObjectType()
export class EBITDAType {
  @Field(() => Float) ingresos: number
  @Field(() => Float) costosOperativos: number
  @Field(() => Float) ebitda: number
  @Field(() => Float) margenEBITDA: number
}

@ObjectType()
export class FinancialSummaryType {
  @Field(() => Float) totalCompras: number
  @Field(() => Float) promedioDiasEntrega: number
  @Field(() => Float) ordenesPendientes: number
  @Field(() => Float) proveedoresActivos: number
}

@ObjectType()
export class TopSupplierType {
  @Field() nombre: string
  @Field() nit: string
  @Field(() => Float) montoTotal: number
  @Field(() => Float) ordenesCount: number
}
```

**Archivos a crear:**
- [ ] `/apps/erp-api/src/graphql/types/purchase-order.type.ts`
- [ ] `/apps/erp-api/src/graphql/types/supplier.type.ts`
- [ ] `/apps/erp-api/src/graphql/types/product.type.ts`
- [ ] `/apps/erp-api/src/graphql/types/financial.type.ts`

---

#### SU-3.3: Crear resolvers de compras

**Como** desarrollador,
**Quiero** queries GraphQL para consultar órdenes de compra,
**Para** que el dashboard pueda mostrar datos de compras.

**Criterios de Aceptación:**
1. Query `purchaseOrders` con filtros
2. Query `purchaseOrder(id)` con detalle
3. Field resolvers para consolidaciones

**Tareas:**

```typescript
// apps/erp-api/src/graphql/resolvers/purchase-orders.resolver.ts
import { Resolver, Query, Args, ID, Int } from '@nestjs/graphql'
import { PurchaseOrderType } from '../types/purchase-order.type'
import { PurchaseOrdersService } from '../../purchase-orders/purchase-orders.service'

@Resolver(() => PurchaseOrderType)
export class PurchaseOrdersResolver {
  constructor(private purchaseOrdersService: PurchaseOrdersService) {}

  @Query(() => [PurchaseOrderType])
  async purchaseOrders(
    @Args('estado', { nullable: true }) estado?: string,
    @Args('proveedorId', { type: () => Int, nullable: true }) proveedorId?: number,
  ) {
    return this.purchaseOrdersService.findAll({ estado, proveedorId })
  }

  @Query(() => PurchaseOrderType)
  async purchaseOrder(@Args('id', { type: () => ID }) id: number) {
    return this.purchaseOrdersService.findOne(id)
  }
}
```

**Archivos a crear:**
- [ ] `/apps/erp-api/src/graphql/resolvers/purchase-orders.resolver.ts`

---

#### SU-3.4: Crear resolver de BI Metrics

**Como** analista de negocio,
**Quiero** queries GraphQL para métricas financieras,
**Para** visualizar KPIs en el dashboard.

**Criterios de Aceptación:**
1. Query `financialSummary` con período
2. Query `topSuppliers` con ranking
3. Datos calculados en tiempo real

**Tareas:**

```typescript
// apps/erp-api/src/graphql/resolvers/bi-metrics.resolver.ts
import { Resolver, Query, Args } from '@nestjs/graphql'
import { FinancialSummaryType, TopSupplierType } from '../types/financial.type'
import { PrismaService } from '../../prisma/prisma.service'

@Resolver()
export class BiMetricsResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => FinancialSummaryType)
  async financialSummary(
    @Args('periodo', { defaultValue: '2024' }) periodo: string,
  ) {
    const inicioPeriodo = new Date(`${periodo}-01-01`)
    const finPeriodo = new Date(`${periodo}-12-31`)

    const [totalCompras, ordenesPendientes, proveedoresActivos] = await Promise.all([
      this.prisma.purchaseOrder.aggregate({
        where: {
          fechaEmision: { gte: inicioPeriodo, lte: finPeriodo },
        },
        _sum: { montoTotal: true },
      }),
      this.prisma.purchaseOrder.count({
        where: { estado: 'PENDIENTE' },
      }),
      this.prisma.supplier.count({
        where: { activo: true },
      }),
    ])

    return {
      totalCompras: Number(totalCompras._sum.montoTotal || 0),
      promedioDiasEntrega: 7.5, // Calcular realemnte
      ordenesPendientes,
      proveedoresActivos,
    }
  }

  @Query(() => [TopSupplierType])
  async topSuppliers(
    @Args('limit', { type: () => Number, defaultValue: 5 }) limit: number,
  ) {
    const result = await this.prisma.purchaseOrder.groupBy({
      by: ['proveedorId'],
      _sum: { montoTotal: true },
      _count: { id: true },
      orderBy: { _sum: { montoTotal: 'desc' } },
      take: limit,
    })

    const supplierIds = result.map((r) => r.proveedorId)
    const suppliers = await this.prisma.supplier.findMany({
      where: { id: { in: supplierIds } },
    })

    return result.map((r) => ({
      nombre: suppliers.find((s) => s.id === r.proveedorId)?.razonSocial || '',
      nit: suppliers.find((s) => s.id === r.proveedorId)?.nit || '',
      montoTotal: Number(r._sum.montoTotal || 0),
      ordenesCount: r._count.id,
    }))
  }
}
```

**Archivos a crear:**
- [ ] `/apps/erp-api/src/graphql/resolvers/bi-metrics.resolver.ts`

---

#### SU-3.5: Crear resolver de EBITDA

**Como** CFO del sistema,
**Quiero** una query GraphQL que calcule el EBITDA dinámicamente,
**Para** visualizar la rentabilidad del negocio.

**Criterios de Aceptación:**
1. Query `ebitda` con período
2. Cálculo: Ingresos - Costos Operativos
3. Margen EBITDA calculado
4. Desglose de componentes

**Tareas:**

```typescript
// apps/erp-api/src/graphql/resolvers/ebitda.resolver.ts
import { Resolver, Query, Args } from '@nestjs/graphql'
import { EBITDAType } from '../types/financial.type'
import { PrismaService } from '../../prisma/prisma.service'

@Resolver()
export class EBITDAResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => EBITDAType)
  async ebitda(
    @Args('periodo', { defaultValue: '2024' }) periodo: string,
  ) {
    const inicioPeriodo = new Date(`${periodo}-01-01`)
    const finPeriodo = new Date(`${periodo}-12-31`)

    // En un ERP real, esto vendría de facturación
    // Para este proyecto, simulamos con datos de inventario
    const [ingresos, costosInventario] = await Promise.all([
      // Ingresos = ventas (simulado como 2x el valor de compras)
      this.prisma.purchaseOrder.aggregate({
        where: {
          fechaEmision: { gte: inicioPeriodo, lte: finPeriodo },
          estado: 'RECIBIDA',
        },
        _sum: { montoTotal: true },
      }),
      // Costos = valorización de inventario movido
      this.prisma.inventory.aggregate({
        _sum: {
          cantidad: true,
        },
      }),
    ])

    const ingresosTotal = Number(ingresos._sum.montoTotal || 0) * 2 // Simular ventas
    const costosOperativos = Number(ingresos._sum.montoTotal || 0) * 0.6 // 60% costos
    const ebitda = ingresosTotal - costosOperativos
    const margenEBITDA = ingresosTotal > 0 ? (ebitda / ingresosTotal) * 100 : 0

    return {
      ingresos: ingresosTotal,
      costosOperativos,
      ebitda,
      margenEBITDA: Math.round(margenEBITDA * 100) / 100,
    }
  }
}
```

**Archivos a crear:**
- [ ] `/apps/erp-api/src/graphql/resolvers/ebitda.resolver.ts`

---

#### SU-3.6: Registrar resolvers en módulo GraphQL

**Como** desarrollador,
**Quiero** todos los resolvers registrados,
**Para** que GraphQL funcione correctamente.

**Criterios de Aceptación:**
1. Todos los resolvers en el módulo
2. Tipos generados correctamente
3. Playground funcional

**Tareas:**

```typescript
// Actualizar apps/erp-api/src/graphql/graphql.module.ts
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
  ],
  providers: [
    PurchaseOrdersResolver,
    BiMetricsResolver,
    EBITDAResolver,
  ],
})
export class GraphQLModule {}
```

- [ ] Actualizar graphql.module.ts con todos los resolvers

---

### Definition of Done (Sprint 3)

- [ ] GraphQL configurado con Apollo
- [ ] Tipos GraphQL creados
- [ ] Resolvers de compras funcionando
- [ ] Resolver de BI Metrics funcionando
- [ ] Resolver de EBITDA funcionando
- [ ] Playground accesible en /graphql
- [ ] Queries probadas desde el playground

---

## SPRINT 4: Frontend ERP (2 semanas)

### Objetivo del Sprint
Desarrollar la interfaz web del ERP con React, incluyendo CRUD completo para productos, proveedores y órdenes de compra.

### Historias de Usuario

---

#### SU-4.1: Configurar proyecto React

**Como** desarrollador frontend,
**Quiero** un proyecto React con Vite configurado,
**Para** construir la interfaz del ERP.

**Criterios de Aceptación:**
1. React + TypeScript + Vite
2. React Router configurado
3. React Query configurado
4. MUI instalado

**Tareas:**

```bash
# 1. Crear proyecto React
cd apps/erp-frontend
npm create vite@latest . -- --template react-ts

# 2. Instalar dependencias
npm install
npm install axios react-router-dom @tanstack/react-query
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install @mui/x-data-grid
npm install react-hot-toast
```

**Archivos a crear:**
- [ ] `/apps/erp-frontend/` (estructura base)

---

#### SU-4.2: Configurar routing y layout

**Como** usuario del ERP,
**Quiero** una navegación intuitiva con sidebar,
**Para** moverme fácilmente entre secciones.

**Criterios de Aceptación:**
1. Sidebar con navegación
2. Rutas configuradas
3. Layout responsivo

**Tareas:**

```typescript
// apps/erp-frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { Toaster } from 'react-hot-toast'
import { theme } from './theme'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { ProductsPage } from './pages/Products/ProductsPage'
import { SuppliersPage } from './pages/Suppliers/SuppliersPage'
import { PurchaseOrdersPage } from './pages/PurchaseOrders/PurchaseOrdersPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="suppliers" element={<SuppliersPage />} />
              <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
```

```typescript
// apps/erp-frontend/src/components/layout/DashboardLayout.tsx
import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, IconButton,
  ListItemButton, ListItemIcon, ListItemText, Avatar, Menu, MenuItem,
} from '@mui/material'
import {
  Menu as MenuIcon, Dashboard as DashboardIcon,
  Inventory as InventoryIcon, Business as BusinessIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material'

const DRAWER_WIDTH = 260

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Productos', icon: <InventoryIcon />, path: '/products' },
  { text: 'Proveedores', icon: <BusinessIcon />, path: '/suppliers' },
  { text: 'Órdenes de Compra', icon: <ShoppingCartIcon />, path: '/purchase-orders' },
]

export function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            open-erp
          </Typography>
          <IconButton color="inherit">
            <Avatar>A</Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
```

**Archivos a crear:**
- [ ] `/apps/erp-frontend/src/App.tsx`
- [ ] `/apps/erp-frontend/src/main.tsx`
- [ ] `/apps/erp-frontend/src/theme.ts`
- [ ] `/apps/erp-frontend/src/components/layout/DashboardLayout.tsx`

---

#### SU-4.3: Crear componente DataTable genérico

**Como** desarrollador,
**Quiero** un componente de tabla reutilizable,
**Para** listar datos en todas las páginas.

**Criterios de Aceptación:**
1. Tabla con paginación
2. Búsqueda integrada
3. Columnas configurables
4. Loading states

**Tareas:**

```typescript
// apps/erp-frontend/src/components/ui/DataTable.tsx
import { DataGrid, DataGridProps, GridColDef } from '@mui/x-data-grid'
import { Box, Paper } from '@mui/material'

interface DataTableProps extends DataGridProps {
  columns: GridColDef[]
  rows: any[]
  loading?: boolean
  totalRows?: number
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export function DataTable({
  columns,
  rows,
  loading = false,
  totalRows = 0,
  page = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  ...props
}: DataTableProps) {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={totalRows}
        page={page}
        pageSize={pageSize}
        paginationMode="server"
        pagination
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        disableColumnFilter
        disableColumnSelector
        disableSelectionOnClick
        autoHeight
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeaders': { bgcolor: 'grey.100' },
        }}
        {...props}
      />
    </Paper>
  )
}
```

**Archivos a crear:**
- [ ] `/apps/erp-frontend/src/components/ui/DataTable.tsx`

---

#### SU-4.4: Crear servicio API

**Como** desarrollador,
**Quiero** un cliente API con interceptores,
**Para** manejar autenticación y errores.

**Criterios de Aceptación:**
1. Axios instance configurada
2. Interceptor de auth automático
3. Manejo de errores global

**Tareas:**

```typescript
// apps/erp-frontend/src/services/api.ts
import axios from 'axios'
import toast from 'react-hot-toast'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Interceptor de response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Error al procesar la solicitud'

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    } else {
      toast.error(message)
    }

    return Promise.reject(error)
  },
)
```

```typescript
// apps/erp-frontend/src/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export function useProducts(params?: { skip?: number; take?: number; search?: string }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.get('/products', { params }).then((res) => res.data),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => api.post('/products', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}
```

**Archivos a crear:**
- [ ] `/apps/erp-frontend/src/services/api.ts`
- [ ] `/apps/erp-frontend/src/hooks/useProducts.ts`
- [ ] `/apps/erp-frontend/src/hooks/useSuppliers.ts`
- [ ] `/apps/erp-frontend/src/hooks/usePurchaseOrders.ts`

---

#### SU-4.5: Crear página de Productos

**Como** gerente de inventario,
**Quiero** ver y gestionar productos,
**Para** mantener el catálogo actualizado.

**Criterios de Aceptación:**
1. Lista de productos con paginación
2. Formulario de creación
3. Formulario de edición
4. Confirmación de eliminación

**Tareas:**

```typescript
// apps/erp-frontend/src/pages/Products/ProductsPage.tsx
import { useState } from 'react'
import { Box, Button, Typography, IconButton, Chip } from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { GridColDef } from '@mui/x-data-grid'
import { DataTable } from '../../components/ui/DataTable'
import { useProducts, useDeleteProduct } from '../../hooks/useProducts'
import { ProductForm } from './ProductForm'
import { UnitMeasure } from '../../types'

export function ProductsPage() {
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const { data, isLoading } = useProducts({ skip: page * pageSize, take: pageSize, search })
  const deleteProduct = useDeleteProduct()

  const columns: GridColDef[] = [
    { field: 'sku', headerName: 'SKU', width: 120 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'unidadMedida', headerName: 'Unidad', width: 100 },
    {
      field: 'pesoUnitario',
      headerName: 'Peso Unit.',
      width: 120,
      valueFormatter: (value) => `${value} kg`,
    },
    {
      field: 'precioBase',
      headerName: 'Precio',
      width: 120,
      valueFormatter: (value) => `$${value.toLocaleString()}`,
    },
    {
      field: 'activo',
      headerName: 'Estado',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Activo' : 'Inactivo'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => handleEdit(params.row)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ]

  const handleEdit = (product: any) => {
    setSelectedProduct(product)
    setOpenForm(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteProduct.mutateAsync(id)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Productos</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedProduct(null)
            setOpenForm(true)
          }}
        >
          Nuevo Producto
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={data?.items || []}
        loading={isLoading}
        totalRows={data?.total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <ProductForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        product={selectedProduct}
      />
    </Box>
  )
}
```

**Archivos a crear:**
- [ ] `/apps/erp-frontend/src/pages/Dashboard/DashboardPage.tsx`
- [ ] `/apps/erp-frontend/src/pages/Products/ProductsPage.tsx`
- [ ] `/apps/erp-frontend/src/pages/Products/ProductForm.tsx`
- [ ] `/apps/erp-frontend/src/pages/Suppliers/SuppliersPage.tsx`
- [ ] `/apps/erp-frontend/src/pages/Suppliers/SupplierForm.tsx`
- [ ] `/apps/erp-frontend/src/pages/PurchaseOrders/PurchaseOrdersPage.tsx`
- [ ] `/apps/erp-frontend/src/pages/PurchaseOrders/PurchaseOrderForm.tsx`
- [ ] `/apps/erp-frontend/src/pages/PurchaseOrders/PurchaseOrderDetail.tsx`

---

#### SU-4.6: Crear página de Purchase Orders con consolidación

**Como** gerente de compras,
**Quiero** ver órdenes de compra con peso_neto calculado,
**Para** controlar las cantidades solicitadas.

**Criterios de Aceptación:**
1. Lista de órdenes con monto total
2. Detalle de orden con peso_neto por línea
3. Consolidación de peso_neto_total visible

**Tareas:**

```typescript
// apps/erp-frontend/src/pages/PurchaseOrders/PurchaseOrderDetail.tsx
import { useParams } from 'react-router-dom'
import { Box, Typography, Paper, Grid, Divider, Chip } from '@mui/material'
import { usePurchaseOrder } from '../../hooks/usePurchaseOrders'

export function PurchaseOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = usePurchaseOrder(Number(id))

  if (isLoading) return <div>Cargando...</div>
  if (!order) return <div>Orden no encontrada</div>

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Orden de Compra #{order.numero}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información General
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="textSecondary">Proveedor</Typography>
                <Typography>{order.proveedor.razonSocial}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Estado</Typography>
                <Chip label={order.estado} color="primary" />
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Fecha Emisión</Typography>
                <Typography>
                  {new Date(order.fechaEmision).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Entrega Estimada</Typography>
                <Typography>
                  {order.fechaEntregaEstimada
                    ? new Date(order.fechaEntregaEstimada).toLocaleDateString()
                    : 'No definida'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Typography variant="h6" gutterBottom>
              Consolidación
            </Typography>
            <Typography variant="h3" gutterBottom>
              {order.pesoNetoTotal.toFixed(2)} kg
            </Typography>
            <Typography variant="subtitle1">
              Peso Neto Total
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }} />
            <Typography>
              Subtotal: ${order.montoSubtotal.toLocaleString()}
            </Typography>
            <Typography>
              IVA (19%): ${order.montoImpuestos.toLocaleString()}
            </Typography>
            <Typography variant="h6">
              Total: ${order.montoTotal.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Líneas de la Orden
            </Typography>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 8 }}>Producto</th>
                  <th style={{ textAlign: 'right', padding: 8 }}>Cantidad</th>
                  <th style={{ textAlign: 'right', padding: 8 }}>Peso Unit.</th>
                  <th style={{ textAlign: 'right', padding: 8 }}>Peso Neto</th>
                  <th style={{ textAlign: 'right', padding: 8 }}>Precio Unit.</th>
                  <th style={{ textAlign: 'right', padding: 8 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.lineas.map((linea: any) => (
                  <tr key={linea.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: 8 }}>{linea.producto.nombre}</td>
                    <td style={{ textAlign: 'right', padding: 8 }}>{linea.cantidad}</td>
                    <td style={{ textAlign: 'right', padding: 8 }}>
                      {linea.producto.pesoUnitario} kg
                    </td>
                    <td style={{ textAlign: 'right', padding: 8, fontWeight: 'bold' }}>
                      {linea.pesoNeto.toFixed(2)} kg
                    </td>
                    <td style={{ textAlign: 'right', padding: 8 }}>
                      ${linea.precioUnitario.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', padding: 8, fontWeight: 'bold' }}>
                      ${linea.precioTotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
```

**Archivos a crear:**
- [ ] `/apps/erp-frontend/src/pages/PurchaseOrders/PurchaseOrderDetail.tsx`

---

#### SU-4.7: Configurar entorno y testing

**Como** desarrollador,
**Quiero** testing configurado,
**Para** asegurar la calidad del código.

**Criterios de Aceptación:**
1. Vitest configurado
2. React Testing Library funcionando
3. Tests básicos de componentes

**Tareas:**

```bash
# Instalar dependencias de testing
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D msw @faker-js/faker
```

**Archivos a crear:**
- [ ] `/apps/erp-frontend/vitest.config.ts`
- [ ] `/apps/erp-frontend/src/test/setup.ts`
- [ ] `/apps/erp-frontend/src/components/ui/__tests__/DataTable.test.tsx`

---

### Definition of Done (Sprint 4)

- [ ] React proyecto configurado con Vite
- [ ] Layout con sidebar funcionando
- [ ] DataTable genérico creado
- [ ] Servicio API con interceptores
- [ ] Página de Productos funcional
- [ ] Página de Suppliers funcional
- [ ] Página de Purchase Orders funcional
- [ ] Detalle de orden con peso_neto
- [ ] Tests unitarios pasando
- [ ] Build exitoso

---

## SPRINT 5: BI Dashboard (2 semanas)

### Objetivo del Sprint
Desarrollar el dashboard de inteligencia de negocios con Next.js y GraphQL, incluyendo visualización de EBITDA y métricas financieras.

### Historias de Usuario

---

#### SU-5.1: Configurar proyecto Next.js

**Como** desarrollador,
**Quiero** un proyecto Next.js configurado con Apollo,
**Para** construir el dashboard BI.

**Criterios de Aceptación:**
1. Next.js 14 con App Router
2. Apollo Client configurado
3. Tailwind CSS funcionando

**Tareas:**

```bash
# 1. Crear proyecto Next.js
cd apps/bi-dashboard
npx create-next-app@latest . --typescript --tailwind --app --src-dir

# 2. Instalar dependencias
npm install @apollo/client graphql
npm install recharts
npm install @mui/material @emotion/react @emotion/styled
npm install date-fns
```

**Archivos a crear:**
- [ ] `/apps/bi-dashboard/` (estructura base)

---

#### SU-5.2: Configurar Apollo Client

**Como** desarrollador,
**Quiero** Apollo Client configurado,
**Para** consumir la API GraphQL.

**Criterios de Aceptación:**
1. ApolloClient configurado con URL del backend
2. Provider envolviendo la app
3. Cache configurado

**Tareas:**

```typescript
// apps/bi-dashboard/src/lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql',
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})
```

```typescript
// apps/bi-dashboard/src/app/providers.tsx
'use client'

import { ApolloProvider } from '@apollo/client'
import { client } from '../lib/apollo-client'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
```

**Archivos a crear:**
- [ ] `/apps/bi-dashboard/src/lib/apollo-client.ts`
- [ ] `/apps/bi-dashboard/src/app/providers.tsx`

---

#### SU-5.3: Crear queries GraphQL

**Como** desarrollador,
**Quiero** queries GraphQL definidas,
**Para** consumir métricas del backend.

**Criterios de Aceptación:**
1. Query para EBITDA
2. Query para financial summary
3. Query para top suppliers
4. Tipos TypeScript generados

**Tareas:**

```typescript
// apps/bi-dashboard/src/lib/queries.ts
import { gql } from '@apollo/client'

export const GET_EBITDA = gql`
  query GetEBITDA($periodo: String!) {
    ebitda(periodo: $periodo) {
      ingresos
      costosOperativos
      ebitda
      margenEBITDA
    }
  }
`

export const GET_FINANCIAL_SUMMARY = gql`
  query GetFinancialSummary($periodo: String!) {
    financialSummary(periodo: $periodo) {
      totalCompras
      promedioDiasEntrega
      ordenesPendientes
      proveedoresActivos
    }
  }
`

export const GET_TOP_SUPPLIERS = gql`
  query GetTopSuppliers($limit: Float!) {
    topSuppliers(limit: $limit) {
      nombre
      nit
      montoTotal
      ordenesCount
    }
  }
`

export const GET_PURCHASE_ORDERS = gql`
  query GetPurchaseOrders($estado: String, $proveedorId: Float) {
    purchaseOrders(estado: $estado, proveedorId: $proveedorId) {
      id
      numero
      estado
      fechaEmision
      pesoNetoTotal
      montoTotal
      proveedor {
        razonSocial
      }
    }
  }
`
```

**Archivos a crear:**
- [ ] `/apps/bi-dashboard/src/lib/queries.ts`

---

#### SU-5.4: Crear layout del dashboard

**Como** usuario del dashboard,
**Quiero** un layout profesional con sidebar,
**Para** navegar entre secciones de análisis.

**Criterios de Aceptación:**
1. Sidebar con navegación
2. Header con usuario
3. Contenido principal responsivo

**Tareas:**

```typescript
// apps/bi-dashboard/src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { DashboardSidebar } from '../components/layout/DashboardSidebar'
import { DashboardHeader } from '../components/layout/DashboardHeader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'open-erp BI Dashboard',
  description: 'Dashboard de inteligencia de negocios',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <div className="flex h-screen bg-gray-100">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <DashboardHeader />
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
```

```typescript
// apps/bi-dashboard/src/components/layout/DashboardSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { text: 'Overview', path: '/dashboard', icon: '📊' },
  { text: 'Financiero', path: '/dashboard/financiero', icon: '💰' },
  { text: 'Compras', path: '/dashboard/compras', icon: '🛒' },
  { text: 'Inventario', path: '/dashboard/inventario', icon: '📦' },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">open-erp BI</h1>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 py-3 hover:bg-gray-800 ${
              pathname === item.path ? 'bg-gray-800 border-l-4 border-blue-500' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.text}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
```

**Archivos a crear:**
- [ ] `/apps/bi-dashboard/src/app/layout.tsx`
- [ ] `/apps/bi-dashboard/src/components/layout/DashboardSidebar.tsx`
- [ ] `/apps/bi-dashboard/src/components/layout/DashboardHeader.tsx`

---

#### SU-5.5: Crear página Overview

**Como** gerente ejecutivo,
**Quiero** ver un resumen de KPIs principales,
**Para** entender rápidamente el estado del negocio.

**Criterios de Aceptación:**
1. KPI cards: Total Compras, EBITDA, Proveedores Activos
2. Gráfico de tendencia de compras
3. Top 5 proveedores

**Tareas:**

```typescript
// apps/bi-dashboard/src/app/page.tsx
'use client'

import { useQuery } from '@apollo/client'
import { GET_EBITDA, GET_FINANCIAL_SUMMARY, GET_TOP_SUPPLIERS } from '../lib/queries'
import { KPICard } from '../components/kpis/KPICard'
import { EBITDADisplay } from '../components/kpis/EBITDADisplay'
import { PurchasesChart } from '../components/charts/PurchasesChart'
import { TopSuppliersTable } from '../components/tables/TopSuppliersTable'

export default function DashboardPage() {
  const { data: ebitdaData } = useQuery(GET_EBITDA, {
    variables: { periodo: '2024' },
  })

  const { data: summaryData } = useQuery(GET_FINANCIAL_SUMMARY, {
    variables: { periodo: '2024' },
  })

  const { data: suppliersData } = useQuery(GET_TOP_SUPPLIERS, {
    variables: { limit: 5 },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Compras"
          value={summaryData?.financialSummary?.totalCompras || 0}
          format="currency"
          trend={12.5}
        />
        <KPICard
          title="Órdenes Pendientes"
          value={summaryData?.financialSummary?.ordenesPendientes || 0}
          format="number"
        />
        <KPICard
          title="Proveedores Activos"
          value={summaryData?.financialSummary?.proveedoresActivos || 0}
          format="number"
        />
        <KPICard
          title="Días Prom. Entrega"
          value={summaryData?.financialSummary?.promedioDiasEntrega || 0}
          format="number"
          suffix=" días"
        />
      </div>

      {/* EBITDA */}
      <EBITDADisplay data={ebitdaData?.ebitda} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PurchasesChart periodo="2024" />
        <TopSuppliersTable data={suppliersData?.topSuppliers || []} />
      </div>
    </div>
  )
}
```

**Archivos a crear:**
- [ ] `/apps/bi-dashboard/src/app/page.tsx`
- [ ] `/apps/bi-dashboard/src/components/kpis/KPICard.tsx`
- [ ] `/apps/bi-dashboard/src/components/kpis/EBITDADisplay.tsx`
- [ ] `/apps/bi-dashboard/src/components/charts/PurchasesChart.tsx`
- [ ] `/apps/bi-dashboard/src/components/tables/TopSuppliersTable.tsx`

---

#### SU-5.6: Crear página Financiera con EBITDA

**Como** CFO,
**Quiero** ver el desglose del EBITDA mensual,
**Para** analizar la rentabilidad del negocio.

**Criterios de Aceptación:**
1. EBITDA mensual con gráfico de barras
2. Margen EBITDA con tendencia
3. Selector de período

**Tareas:**

```typescript
// apps/bi-dashboard/src/app/financiero/page.tsx
'use client'

import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_EBITDA } from '../../lib/queries'
import { EBITDAChart } from '../../components/charts/EBITDAChart'
import { Card, CardContent, CardHeader, Typography, Select, MenuItem } from '@mui/material'

export default function FinancieroPage() {
  const [periodo, setPeriodo] = useState('2024')

  const { data, loading } = useQuery(GET_EBITDA, {
    variables: { periodo },
  })

  const ebitda = data?.ebitda

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Análisis Financiero</h1>
        <Select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          size="small"
        >
          <MenuItem value="2024">2024</MenuItem>
          <MenuItem value="2023">2023</MenuItem>
        </Select>
      </div>

      {/* Resumen EBITDA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <Typography color="textSecondary">Ingresos</Typography>
            <Typography variant="h4">
              ${ebitda?.ingresos?.toLocaleString() || 0}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary">Costos Operativos</Typography>
            <Typography variant="h4">
              ${ebitda?.costosOperativos?.toLocaleString() || 0}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: ebitda?.ebitda > 0 ? 'success.light' : 'error.light' }}>
          <CardContent>
            <Typography color="textSecondary">EBITDA</Typography>
            <Typography variant="h4">
              ${ebitda?.ebitda?.toLocaleString() || 0}
            </Typography>
            <Typography>
              Margen: {ebitda?.margenEBITDA?.toFixed(1) || 0}%
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico EBITDA */}
      <Card>
        <CardHeader title="Evolución EBITDA" />
        <CardContent>
          <EBITDAChart periodo={periodo} />
        </CardContent>
      </Card>
    </div>
  )
}
```

**Archivos a crear:**
- [ ] `/apps/bi-dashboard/src/app/financiero/page.tsx`
- [ ] `/apps/bi-dashboard/src/components/charts/EBITDAChart.tsx`

---

#### SU-5.7: Crear gráficos con Recharts

**Como** analista,
**Quiero** visualizaciones interactivas,
**Para** entender mejor los datos.

**Criterios de Aceptación:**
1. Gráfico de líneas para tendencias
2. Gráfico de barras para comparativas
3. Tooltips informativos

**Tareas:**

```typescript
// apps/bi-dashboard/src/components/charts/PurchasesChart.tsx
'use client'

import { useQuery } from '@apollo/client'
import { GET_FINANCIAL_SUMMARY } from '../../lib/queries'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function PurchasesChart({ periodo }: { periodo: string }) {
  const { data } = useQuery(GET_FINANCIAL_SUMMARY, { variables: { periodo } })

  // Datos mock para demo
  const chartData = [
    { month: 'Ene', value: 45000 },
    { month: 'Feb', value: 52000 },
    { month: 'Mar', value: 48000 },
    { month: 'Abr', value: 61000 },
    { month: 'May', value: 55000 },
    { month: 'Jun', value: 67000 },
  ]

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Tendencia de Compras</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Compras']} />
          <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

**Archivos a crear:**
- [ ] `/apps/bi-dashboard/src/components/charts/PurchasesChart.tsx`
- [ ] `/apps/bi-dashboard/src/components/charts/EBITDAChart.tsx`
- [ ] `/apps/bi-dashboard/src/components/charts/SuppliersChart.tsx`

---

#### SU-5.8: Crear página de Compras

**Como** gerente de compras,
**Quiero** analizar las órdenes de compra,
**Para** identificar tendencias y proveedores clave.

**Criterios de Aceptación:**
1. Lista de órdenes con filtros
2. Estadísticas de compras
3. Distribución por proveedor

**Tareas:**

**Archivos a crear:**
- [ ] `/apps/bi-dashboard/src/app/compras/page.tsx`
- [ ] `/apps/bi-dashboard/src/components/charts/SuppliersChart.tsx`
- [ ] `/apps/bi-dashboard/src/components/tables/OrdersTable.tsx`

---

### Definition of Done (Sprint 5)

- [ ] Next.js proyecto configurado
- [ ] Apollo Client funcionando
- [ ] Layout con sidebar
- [ ] Página Overview con KPIs
- [ ] Página Financiera con EBITDA
- [ ] Página de Compras
- [ ] Gráficos con Recharts
- [ ] Build exitoso
- [ ] Deployable a Vercel

---

## SPRINT 6: App Móvil Offline-First (2 semanas)

### Objetivo del Sprint
Desarrollar la aplicación móvil con React Native, implementando arquitectura offline-first con cola de mutaciones para sincronización.

### Historias de Usuario

---

#### SU-6.1: Configurar proyecto React Native

**Como** desarrollador mobile,
**Quiero** un proyecto React Native configurado,
**Para** construir la app de campo.

**Criterios de Aceptación:**
1. React Native con Expo o CLI
2. TypeScript configurado
3. Navegación instalada

**Tareas:**

```bash
# Opción 1: Expo (recomendado para portfolio)
npx create-expo-app@latest field-app --template blank-typescript
cd field-app

# Opción 2: React Native CLI
npx react-native init FieldApp --template react-native-template-typescript

# Instalar dependencias
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install @react-native-async-storage/async-storage
npm install axios @tanstack/react-query
npm install react-native-offline
npm install react-native-paper
```

**Archivos a crear:**
- [ ] `/apps/field-app/` (estructura base)

---

#### SU-6.2: Implementar cola de mutaciones

**Como** usuario de campo,
**Quiero** que mis cambios se guarden localmente cuando no hay internet,
**Para** no perder datos en áreas sin cobertura.

**Criterios de Aceptación:**
1. Mutaciones se guardan en cola local
2. Cola se procesa cuando hay conexión
3. Reintentos automáticos (máximo 3)
4. UI muestra estado de sincronización

**Tareas:**

```typescript
// apps/field-app/src/services/MutationQueue.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { v4 as uuidv4 } from 'uuid'

export interface QueuedMutation {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  endpoint: string
  data: any
  timestamp: number
  retries: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

const QUEUE_KEY = '@mutation_queue'

export class MutationQueue {
  private queue: QueuedMutation[] = []
  private isProcessing = false

  async load(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(QUEUE_KEY)
      this.queue = stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading queue:', error)
      this.queue = []
    }
  }

  private async persist(): Promise<void> {
    try {
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue))
    } catch (error) {
      console.error('Error persisting queue:', error)
    }
  }

  async add(mutation: Omit<QueuedMutation, 'id' | 'timestamp' | 'retries' | 'status'>): Promise<void> {
    const newMutation: QueuedMutation = {
      ...mutation,
      id: uuidv4(),
      timestamp: Date.now(),
      retries: 0,
      status: 'pending',
    }

    this.queue.push(newMutation)
    await this.persist()
    console.log(`📝 Mutation queued: ${mutation.type} ${mutation.endpoint}`)
  }

  async process(apiClient: any): Promise<void> {
    if (this.isProcessing) return
    this.isProcessing = true

    const pending = this.queue.filter((m) => m.status === 'pending')
    console.log(`🔄 Processing ${pending.length} mutations...`)

    for (const mutation of pending) {
      try {
        mutation.status = 'processing'
        await this.persist()

        await this.executeMutation(apiClient, mutation)

        mutation.status = 'completed'
        this.queue = this.queue.filter((m) => m.id !== mutation.id)
        console.log(`✅ Mutation completed: ${mutation.type} ${mutation.endpoint}`)
      } catch (error) {
        mutation.retries++
        mutation.status = mutation.retries >= 3 ? 'failed' : 'pending'
        console.error(`❌ Mutation failed (${mutation.retries}/3):`, error)
      }

      await this.persist()
    }

    this.isProcessing = false
  }

  private async executeMutation(apiClient: any, mutation: QueuedMutation): Promise<void> {
    const { type, endpoint, data } = mutation

    switch (type) {
      case 'CREATE':
        await apiClient.post(endpoint, data)
        break
      case 'UPDATE':
        await apiClient.put(`${endpoint}/${data.id}`, data)
        break
      case 'DELETE':
        await apiClient.delete(`${endpoint}/${data.id}`)
        break
    }
  }

  getPendingCount(): number {
    return this.queue.filter((m) => m.status === 'pending').length
  }

  getFailedCount(): number {
    return this.queue.filter((m) => m.status === 'failed').length
  }

  async retryFailed(): Promise<void> {
    this.queue
      .filter((m) => m.status === 'failed')
      .forEach((m) => {
        m.status = 'pending'
        m.retries = 0
      })
    await this.persist()
  }

  async clear(): Promise<void> {
    this.queue = []
    await this.persist()
  }
}

export const mutationQueue = new MutationQueue()
```

**Archivos a crear:**
- [ ] `/apps/field-app/src/services/MutationQueue.ts`

---

#### SU-6.3: Implementar hook de sincronización

**Como** desarrollador,
**Quiero** un hook que maneje la sincronización automáticamente,
**Para** que la app se sincronice cuando recupere conexión.

**Criterios de Aceptación:**
1. Hook detecta cambios de conectividad
2. Sincronización automática al recuperar conexión
3. UI refleja estado actual

**Tareas:**

```typescript
// apps/field-app/src/hooks/useOfflineSync.ts
import { useState, useEffect, useCallback } from 'react'
import NetInfo, { NetInfoState } from '@react-native-community/netinfo'
import { mutationQueue } from '../services/MutationQueue'
import { apiClient } from '../services/api'

export interface SyncStatus {
  isConnected: boolean
  isSyncing: boolean
  pendingCount: number
  failedCount: number
  lastSyncTime: Date | null
}

export function useOfflineSync() {
  const [status, setStatus] = useState<SyncStatus>({
    isConnected: true,
    isSyncing: false,
    pendingCount: 0,
    failedCount: 0,
    lastSyncTime: null,
  })

  const processQueue = useCallback(async () => {
    if (status.isSyncing) return

    setStatus((prev) => ({ ...prev, isSyncing: true }))

    try {
      await mutationQueue.load()
      await mutationQueue.process(apiClient)

      setStatus((prev) => ({
        ...prev,
        isSyncing: false,
        pendingCount: mutationQueue.getPendingCount(),
        failedCount: mutationQueue.getFailedCount(),
        lastSyncTime: new Date(),
      }))
    } catch (error) {
      console.error('Error processing queue:', error)
      setStatus((prev) => ({ ...prev, isSyncing: false }))
    }
  }, [status.isSyncing])

  const addToQueue = useCallback(
    async (type: 'CREATE' | 'UPDATE' | 'DELETE', endpoint: string, data: any) => {
      await mutationQueue.add({ type, endpoint, data })
      setStatus((prev) => ({
        ...prev,
        pendingCount: mutationQueue.getPendingCount(),
      }))
    },
    [],
  )

  useEffect(() => {
    // Cargar cola inicial
    mutationQueue.load().then(() => {
      setStatus((prev) => ({
        ...prev,
        pendingCount: mutationQueue.getPendingCount(),
        failedCount: mutationQueue.getFailedCount(),
      }))
    })

    // Escuchar cambios de conectividad
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const isConnected = state.isConnected ?? false

      setStatus((prev) => ({ ...prev, isConnected }))

      // Si se recuperó la conexión, procesar cola
      if (isConnected) {
        console.log('🌐 Connection restored, processing queue...')
        processQueue()
      }
    })

    return () => unsubscribe()
  }, [processQueue])

  return {
    ...status,
    addToQueue,
    retryFailed: async () => {
      await mutationQueue.retryFailed()
      processQueue()
    },
    forceSync: processQueue,
  }
}
```

**Archivos a crear:**
- [ ] `/apps/field-app/src/hooks/useOfflineSync.ts`

---

#### SU-6.4: Implementar almacenamiento local

**Como** usuario de campo,
**Quiero** que los datos se guarden localmente,
**Para** poder trabajar sin conexión.

**Criterios de Aceptación:**
1. Productos cacheados localmente
2. Inventario local
3. Sincronización de cambios

**Tareas:**

```typescript
// apps/field-app/src/services/LocalDatabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEYS = {
  PRODUCTS: '@products',
  INVENTORY: '@inventory',
  SUPPLIERS: '@suppliers',
}

export class LocalDatabase {
  // Products
  static async getProducts(): Promise<any[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS)
    return data ? JSON.parse(data) : []
  }

  static async saveProducts(products: any[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
  }

  static async getProduct(id: string): Promise<any | null> {
    const products = await this.getProducts()
    return products.find((p) => p.id === id) || null
  }

  static async saveProduct(product: any): Promise<void> {
    const products = await this.getProducts()
    const index = products.findIndex((p) => p.id === product.id)

    if (index >= 0) {
      products[index] = { ...products[index], ...product, synced: false }
    } else {
      products.push({ ...product, synced: false })
    }

    await this.saveProducts(products)
  }

  static async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts()
    const filtered = products.filter((p) => p.id !== id)
    await this.saveProducts(filtered)
  }

  // Inventory
  static async getInventory(): Promise<any[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.INVENTORY)
    return data ? JSON.parse(data) : []
  }

  static async saveInventory(inventory: any[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory))
  }

  static async adjustInventory(productId: string, warehouseId: string, quantity: number): Promise<void> {
    const inventory = await this.getInventory()
    const key = `${productId}-${warehouseId}`
    const existing = inventory.find((i) => `${i.productId}-${i.warehouseId}` === key)

    if (existing) {
      existing.quantity += quantity
      existing.synced = false
    } else {
      inventory.push({
        productId,
        warehouseId,
        quantity,
        synced: false,
      })
    }

    await this.saveInventory(inventory)
  }

  // Sync status
  static async getUnsyncedItems(): Promise<{ products: number; inventory: number }> {
    const products = await this.getProducts()
    const inventory = await this.getInventory()

    return {
      products: products.filter((p) => !p.synced).length,
      inventory: inventory.filter((i) => !i.synced).length,
    }
  }
}
```

**Archivos a crear:**
- [ ] `/apps/field-app/src/services/LocalDatabase.ts`

---

#### SU-6.5: Crear screens principales

**Como** usuario de campo,
**Quiero** pantallas intuitivas para mi trabajo diario,
**Para** ser productivo sin complicaciones.

**Criterios de Aceptación:**
1. HomeScreen con resumen y estado sync
2. InventoryScreen para consultar/ajustar stock
3. PurchaseOrderScreen para ver/crear órdenes

**Tareas:**

```typescript
// apps/field-app/src/screens/HomeScreen/index.tsx
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Card, Title, Paragraph, Badge, Button, Text } from 'react-native-paper'
import { useOfflineSync } from '../../hooks/useOfflineSync'
import { LocalDatabase } from '../../services/LocalDatabase'

export function HomeScreen() {
  const { isConnected, isSyncing, pendingCount, failedCount, lastSyncTime, forceSync } = useOfflineSync()
  const [unsyncedCounts, setUnsyncedCounts] = useState({ products: 0, inventory: 0 })

  useEffect(() => {
    loadUnsyncedCounts()
  }, [pendingCount])

  const loadUnsyncedCounts = async () => {
    const counts = await LocalDatabase.getUnsyncedItems()
    setUnsyncedCounts(counts)
  }

  return (
    <ScrollView style={styles.container}>
      {/* Estado de Conexión */}
      <Card style={[styles.card, { backgroundColor: isConnected ? '#E8F5E9' : '#FFEBEE' }]}>
        <Card.Content>
          <View style={styles.connectionRow}>
            <Title>Estado de Conexión</Title>
            <Badge style={{ backgroundColor: isConnected ? '#4CAF50' : '#F44336' }}>
              {isConnected ? 'Online' : 'Offline'}
            </Badge>
          </View>
          {lastSyncTime && (
            <Paragraph>
              Última sincronización: {lastSyncTime.toLocaleTimeString()}
            </Paragraph>
          )}
          <Button
            mode="contained"
            onPress={forceSync}
            loading={isSyncing}
            disabled={!isConnected || isSyncing}
            style={{ marginTop: 10 }}
          >
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
          </Button>
        </Card.Content>
      </Card>

      {/* Datos Pendientes */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Datos Pendientes de Sincronización</Title>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{pendingCount}</Text>
              <Text style={styles.statLabel}>En Cola</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#F44336' }]}>{failedCount}</Text>
              <Text style={styles.statLabel}>Fallidos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{unsyncedCounts.products}</Text>
              <Text style={styles.statLabel}>Productos Local</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Acciones Rápidas */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Acciones Rápidas</Title>
          <Button mode="outlined" style={styles.actionButton}>
            📦 Consultar Inventario
          </Button>
          <Button mode="outlined" style={styles.actionButton}>
            📋 Nueva Orden de Compra
          </Button>
          <Button mode="outlined" style={styles.actionButton}>
            📸 Capturar Evidencia
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  card: { margin: 16, marginBottom: 8 },
  connectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#666' },
  actionButton: { marginTop: 10 },
})
```

```typescript
// apps/field-app/src/screens/InventoryScreen/index.tsx
import React, { useState, useEffect } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { Searchbar, Card, Title, Paragraph, Button, TextInput } from 'react-native-paper'
import { LocalDatabase } from '../../services/LocalDatabase'
import { useOfflineSync } from '../../hooks/useOfflineSync'

export function InventoryScreen() {
  const [products, setProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const { addToQueue } = useOfflineSync()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const data = await LocalDatabase.getProducts()
    setProducts(data)
  }

  const handleAdjustment = async (productId: string, warehouseId: string, quantity: number) => {
    // Guardar localmente
    await LocalDatabase.adjustInventory(productId, warehouseId, quantity)

    // Agregar a cola de sincronización
    await addToQueue('UPDATE', '/inventory/adjust', {
      productId,
      warehouseId,
      quantity,
    })

    await loadProducts()
  }

  const filteredProducts = products.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar producto..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.productRow}>
                <View style={styles.productInfo}>
                  <Title>{item.nombre}</Title>
                  <Paragraph>SKU: {item.sku}</Paragraph>
                  <Paragraph>Stock: {item.stock || 0} {item.unidadMedida}</Paragraph>
                </View>
                <View style={styles.actions}>
                  <Button compact mode="contained" onPress={() => handleAdjustment(item.id, '1', 1)}>
                    +1
                  </Button>
                  <Button compact mode="outlined" onPress={() => handleAdjustment(item.id, '1', -1)}>
                    -1
                  </Button>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  searchbar: { margin: 16 },
  card: { marginHorizontal: 16, marginBottom: 8 },
  productRow: { flexDirection: 'row', justifyContent: 'space-between' },
  productInfo: { flex: 1 },
  actions: { justifyContent: 'center', gap: 8 },
})
```

**Archivos a crear:**
- [ ] `/apps/field-app/src/screens/HomeScreen/index.tsx`
- [ ] `/apps/field-app/src/screens/InventoryScreen/index.tsx`
- [ ] `/apps/field-app/src/screens/PurchaseOrderScreen/index.tsx`

---

#### SU-6.6: Configurar navegación

**Como** usuario de la app,
**Quiero** navegar fácilmente entre pantallas,
**Para** ser productivo.

**Criterios de Aceptación:**
1. Bottom tabs para navegación principal
2. Stack navigation para detalles
3. Iconos intuitivos

**Tareas:**

```typescript
// apps/field-app/src/navigation/MainNavigator.tsx
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { HomeScreen } from '../screens/HomeScreen'
import { InventoryScreen } from '../screens/InventoryScreen'
import { PurchaseOrderScreen } from '../screens/PurchaseOrderScreen'

const Tab = createBottomTabNavigator()

export function MainNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: string

            switch (route.name) {
              case 'Home':
                iconName = 'home'
                break
              case 'Inventory':
                iconName = 'package-variant'
                break
              case 'Orders':
                iconName = 'clipboard-text'
                break
              default:
                iconName = 'circle'
            }

            return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
        <Tab.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Inventario' }} />
        <Tab.Screen name="Orders" component={PurchaseOrderScreen} options={{ title: 'Órdenes' }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
```

**Archivos a crear:**
- [ ] `/apps/field-app/src/navigation/MainNavigator.tsx`

---

### Definition of Done (Sprint 6)

- [ ] React Native proyecto configurado
- [ ] Cola de mutaciones implementada
- [ ] Hook useOfflineSync funcionando
- [ ] LocalDatabase con CRUD
- [ ] HomeScreen con estado de sync
- [ ] InventoryScreen con ajustes offline
- [ ] PurchaseOrderScreen
- [ ] Navegación configurada
- [ ] Sync automático al recuperar conexión

---

## SPRINT 7: Testing y Quality (1 semana)

### Objetivo del Sprint
Asegurar la calidad del código con testing comprehensivo y configuración de herramientas de calidad.

### Historias de Usuario

---

#### SU-7.1: Configurar testing backend

**Como** desarrollador,
**Quiero** tests unitarios y E2E para el backend,
**Para** prevenir regresiones.

**Criterios de Aceptación:**
1. Jest configurado
2. Tests para servicios principales
3. Tests E2E para endpoints críticos

**Tareas:**

```bash
# Ejecutar tests
npm run test

# Ejecutar tests con coverage
npm run test:cov

# Ejecutar tests E2E
npm run test:e2e
```

**Archivos a crear:**
- [ ] `/apps/erp-api/src/products/products.service.spec.ts`
- [ ] `/apps/erp-api/src/purchase-orders/purchase-orders.service.spec.ts`
- [ ] `/apps/erp-api/test/app.e2e-spec.ts`

---

#### SU-7.2: Configurar testing frontend

**Como** desarrollador,
**Quiero** tests para componentes React,
**Para** asegurar que la UI funciona correctamente.

**Criterios de Aceptación:**
1. Vitest configurado
2. React Testing Library
3. Tests de componentes críticos

**Tareas:**

```bash
# Ejecutar tests
npm run test
```

**Archivos a crear:**
- [ ] `/apps/erp-frontend/src/components/ui/__tests__/DataTable.test.tsx`
- [ ] `/apps/erp-frontend/src/pages/__tests__/ProductsPage.test.tsx`

---

#### SU-7.3: Configurar linting y formateo

**Como** equipo,
**Quiero** reglas de linting consistentes,
**Para** mantener código limpio.

**Criterios de Aceptación:**
1. ESLint sin errores
2. Prettier formateando
3. Pre-commit hooks funcionando

**Tareas:**

```bash
# Verificar lint
npm run lint

# Formatear código
npm run format
```

---

### Definition of Done (Sprint 7)

- [ ] Tests backend pasando
- [ ] Tests frontend pasando
- [ ] Coverage mínimo 70%
- [ ] ESLint sin errores
- [ ] Prettier ejecutándose
- [ ] Pre-commit hooks funcionando

---

## SPRINT 8: Deployment (1 semana)

### Objetivo del Sprint
Configurar el deployment de todas las aplicaciones con CI/CD.

### Historias de Usuario

---

#### SU-8.1: Configurar Docker multi-stage builds

**Como** DevOps,
**Quiero** Dockerfiles optimizados,
**Para** deployment eficiente.

**Criterios de Aceptación:**
1. Multi-stage builds
2. Imágenes pequeñas
3. Health checks

**Tareas:**

```dockerfile
# apps/erp-api/Dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production

FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma/

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

**Archivos a crear:**
- [ ] `/apps/erp-api/Dockerfile`
- [ ] `/apps/erp-frontend/Dockerfile`
- [ ] `/apps/bi-dashboard/Dockerfile`

---

#### SU-8.2: Configurar CI/CD con GitHub Actions

**Como** equipo,
**Quiero** pipeline de CI/CD automatizado,
**Para** deployment continuo y confiable.

**Criterios de Aceptación:**
1. Tests en cada PR
2. Build automático
3. Deploy a staging/production

**Tareas:**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
      - run: npm run build
```

**Archivos a crear:**
- [ ] `/.github/workflows/ci.yml`
- [ ] `/.github/workflows/deploy.yml`

---

#### SU-8.3: Configurar deployment a Railway/Vercel

**Como** equipo,
**Quiero** deployment a producción,
**Para** que el proyecto sea accesible públicamente.

**Criterios de Aceptación:**
1. API desplegada en Railway
2. Frontend ERP en Vercel
3. BI Dashboard en Vercel
4. Variables de entorno configuradas

**Tareas:**

```bash
# Railway (API + PostgreSQL)
# 1. Instalar CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Crear proyecto
railway init

# 4. Agregar PostgreSQL
railway add postgresql

# 5. Deploy
railway up

# Vercel (Frontends)
# 1. Instalar CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

---

### Definition of Done (Sprint 8)

- [ ] Dockerfiles multi-stage
- [ ] docker-compose.yml actualizado
- [ ] CI/CD pipeline funcionando
- [ ] API desplegada y accesible
- [ ] Frontend ERP desplegado
- [ ] BI Dashboard desplegado
- [ ] Variables de entorno configuradas

---

## SPRINT 9: Documentación y Portafolio (3 días)

### Objetivo del Sprint
Documentar el proyecto para el portafolio y preparar la demo.

### Historias de Usuario

---

#### SU-9.1: Crear README.md completo

**Como** reclutador,
**Quiero** un README profesional y completo,
**Para** entender el proyecto rápidamente.

**Criterios de Aceptación:**
1. Descripción clara del proyecto
2. Stack tecnológico documentado
3. Instrucciones de setup
4. Arquitectura visual
5. Screenshots

**Tareas:**

**Archivo a crear:**
- [ ] `/README.md` (completo con todas las secciones)

---

#### SU-9.2: Crear video demo

**Como** reclutador,
**Quiero** ver una demo en video,
**Para** entender las funcionalidades sin instalar nada.

**Criterios de Aceptación:**
1. Video de 2-3 minutos
2. Mostrar flujo completo
3. Calidad profesional

**Contenido del video:**
1. Introducción al proyecto (15s)
2. Crear orden de compra en ERP (30s)
3. Ver consolidación de peso_neto (15s)
4. Dashboard con EBITDA en tiempo real (30s)
5. App móvil sincronizando offline (30s)
6. Código fuente y arquitectura (15s)

---

#### SU-9.3: Documentar API

**Como** desarrollador,
**Quiero** documentación de la API,
**Para** que otros desarrolladores puedan integrarse.

**Criterios de Aceptación:**
1. Swagger/OpenAPI documentado
2. Ejemplos de requests/responses
3. Autenticación documentada

**Acceso:**
- Swagger UI: `https://api.open-erp.com/api/docs`

---

### Definition of Done (Sprint 9)

- [ ] README.md completo
- [ ] Video demo grabado
- [ ] API documentada con Swagger
- [ ] URLs de deployment funcionando
- [ ] Screenshots actualizados
- [ ] LinkedIn actualizado con el proyecto

---

## Cronograma Final

```
Semana 1:       Sprint 0 - Setup
Semana 2-3:     Sprint 1 - Base de Datos
Semana 4-5:     Sprint 2 - Backend REST
Semana 6:       Sprint 3 - GraphQL
Semana 7-8:     Sprint 4 - Frontend ERP
Semana 9-10:    Sprint 5 - BI Dashboard
Semana 11-12:   Sprint 6 - App Móvil
Semana 13:      Sprint 7 - Testing
Semana 14:      Sprint 8 - Deployment
Semana 15:      Sprint 9 - Documentación
```

**Total: 15 semanas (~4 meses)**

---

## Checklist Final de Portafolio

Antes de compartir el proyecto:

- [ ] Todos los repositorios en GitHub con README
- [ ] Código limpio sin secrets expuestos
- [ ] Deployment funcionando con URLs accesibles
- [ ] Video demo publicado (YouTube/Loom)
- [ ] README actualizado con links de deployment
- [ ] LinkedIn actualizado con el proyecto
- [ ] Preparado para explicar decisiones técnicas

---

*Última actualización: $(date)*
