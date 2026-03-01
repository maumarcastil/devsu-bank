# Devsu Bank - Product Management App

Aplicación móvil de gestión de productos financieros desarrollada con React Native y Expo. Permite crear, visualizar, editar y eliminar productos con validaciones robustas y diseño moderno.

## Características

- **CRUD Completo**: Crear, leer, actualizar y eliminar productos
- **Validaciones**: Formularios con validación en tiempo real usando Zod
- **UI Moderna**: Diseño con soporte para modo claro/oscuro
- **Búsqueda**: Filtrado de productos en tiempo real
- **Navegación**: Navegación fluida con Expo Router
- **Estado Global**: Manejo de estado con Zustand y TanStack Query
- **TypeScript**: Código tipado para mayor seguridad

## Tecnologías

- **Framework**: React Native + Expo
- **Navegación**: Expo Router (file-based routing)
- **Estado**: Zustand + TanStack Query
- **Validación**: Zod
- **Formularios**: React Hook Form
- **Estilos**: React Native StyleSheet
- **Testing**: Jest + TypeScript
- **Fechas**: date-fns

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd devsu-bank

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu API_URL
```

## Ejecución

```bash
# Iniciar servidor de desarrollo
pnpm start

# Ejecutar en iOS (requiere macOS + Xcode)
pnpm ios

# Ejecutar en Android (requiere Android Studio)
pnpm android

# Ejecutar en web
pnpm web
```

## Scripts Disponibles

```bash
pnpm start          # Iniciar servidor Expo
pnpm ios            # Ejecutar en simulador iOS
pnpm android        # Ejecutar en emulador Android
pnpm web            # Ejecutar en navegador
pnpm lint           # Verificar código con ESLint
pnpm format         # Formatear código con Prettier
pnpm format:check   # Verificar formato sin modificar
pnpm typecheck      # Verificar tipos de TypeScript
pnpm test           # Ejecutar pruebas unitarias
pnpm test:watch     # Ejecutar pruebas en modo watch
pnpm test:coverage  # Ver cobertura de pruebas
```

## Testing

### Filosofía de Testing

Este proyecto sigue una estrategia de testing pragmática enfocada en **valor real** sobre cobertura superficial.

### Qué SÍ testeamos (52 pruebas)

#### 1. Utilidades de Fecha (17 tests)

**Ubicación**: `src/utils/__tests__/date.utils.test.ts`

Testeamos la lógica pura de manejo de fechas porque:

- Es lógica de negocio compleja con muchos casos edge
- No depende de frameworks externos
- Es fácil de testear y da mucho valor
- Maneja cálculos críticos como fechas de revisión (año + 1)

```typescript
// Ejemplo: calculateRevisionDate maneja años bisiestos
// Si lanzas el 29 de febrero de 2024 (año bisiesto)
// La revisión debe ser el 1 de marzo de 2025, no el 29 de feb
```

Casos cubiertos:

- Formateo de fechas (yyyy-MM-dd, dd/MM/yyyy)
- Cálculo de fechas de revisión (+1 año)
- Normalización de diferentes formatos de entrada
- Manejo de años bisiestos
- Fechas inválidas y vacías

#### 2. Esquemas de Validación (25 tests)

**Ubicación**: `src/schemas/__tests__/product.schema.test.ts`

Testeamos las validaciones de Zod porque:

- Son reglas de negocio críticas
- Protegen la integridad de los datos
- Fáciles de testear (entrada/salida pura)
- Cambian poco (estabilidad)

Reglas validadas:

- ID: requerido, mínimo 1 carácter
- Nombre: 5-100 caracteres
- Descripción: 10-200 caracteres
- Logo: requerido
- Fecha de lanzamiento: debe ser ≥ fecha actual
- Esquema de edición: permite ID vacío (no editable)

#### 3. Theme Store (15 tests)

**Ubicación**: `src/stores/__tests__/theme-store.test.ts`

Testeamos el estado del tema porque:

- Es lógica de estado global con comportamiento complejo
- Maneja prioridad: selección del usuario vs sistema
- Los colores deben sincronizarse correctamente con el modo
- Toggle y setTheme deben funcionar consistentemente

Casos cubiertos:

- Inicialización en modo claro
- Toggle entre modos
- Prioridad de selección de usuario sobre sistema
- Sincronización de colores
- Cambios múltiples consecutivos

### Qué NO testeamos (y por qué)

#### ❌ Componentes React (ProductCard, ProductList, etc.)

**Razones:**

1. **Complejidad vs Valor**: Los componentes son principalmente presentacionales:

   ```typescript
   // ProductCard: Solo renderiza y navega (1 línea de lógica)
   const handlePress = () => router.push(`/${product.id}`);
   ```

2. **Costo de mantenimiento**: Los tests de componentes:
   - Se rompen fácilmente cuando cambia el diseño
   - Requieren mockear múltiples dependencias (router, queries, theme)
   - Son más lentos de ejecutar

3. **Mejor alternativa**: Para UI usamos **tests E2E** (Maestro/Detox):
   - Testean el flujo completo del usuario
   - No se rompen con cambios de implementación
   - Verifican comportamiento real en dispositivos

4. **Excepción**: Si un componente tuviera lógica compleja (cálculos, estado local elaborado), sí valdría la pena testearlo unitariamente.

#### ❌ Hooks de TanStack Query

**Razones:**

- Son wrappers simples alrededor de `useQuery`/`useMutation`
- La lógica real está en `productsService`
- Testing hooks requiere renderizar componentes (complejo)
- Mejor testear el servicio API si tiene lógica de transformación

#### ❌ Servicio API (products.ts)

**Razones:**

- Solo hace fetch básico sin lógica de transformación
- Si tuviera parseo de errores o retry logic, sí valdría la pena
- Mejor testear con mocks en E2E o integración

### Cómo ejecutar los tests

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar en modo watch (útil durante desarrollo)
pnpm test:watch

# Ver cobertura
pnpm test:coverage
```

### Cobertura actual

- **Date Utils**: 100% (4 funciones, 17 casos de prueba)
- **Product Schema**: 100% (2 esquemas, 25+ casos de prueba)
- **Theme Store**: 100% (2 funciones principales, 15 casos de prueba)

**Total**: 52 pruebas que protegen la lógica crítica de negocio

## Estructura del Proyecto

```
devsu-bank/
├── app/                      # Expo Router (rutas basadas en archivos)
│   ├── (products)/          # Grupo de rutas de productos
│   │   ├── index.tsx        # Lista de productos
│   │   ├── create.tsx       # Crear producto
│   │   └── [id]/
│   │       ├── index.tsx    # Detalle del producto
│   │       └── edit.tsx     # Editar producto
│   └── _layout.tsx          # Layout raíz
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── features/        # Componentes de dominio
│   │   └── ui/              # Componentes base
│   ├── hooks/               # Hooks personalizados
│   ├── services/            # Servicios API
│   ├── stores/              # Estado global (Zustand)
│   ├── schemas/             # Validaciones (Zod)
│   ├── utils/               # Utilidades
│   ├── constants/           # Constantes
│   └── providers/           # Providers React
├── __tests__/               # Tests E2E (si se agregan)
└── docs/                    # Documentación
```

## API

La aplicación consume una API REST para gestión de productos:

- `GET /bp/products` - Listar productos
- `GET /bp/products/:id` - Obtener producto
- `POST /bp/products` - Crear producto
- `PUT /bp/products/:id` - Actualizar producto
- `DELETE /bp/products/:id` - Eliminar producto
- `GET /bp/products/verification/:id` - Verificar ID único

## Convenciones de Código

- **TypeScript**: Modo estricto habilitado, tipos explícitos
- **Imports**: Orden (React → Librerías → @/ → Relativos)
- **Componentes**: PascalCase, memoización cuando aplica
- **Hooks**: camelCase con prefijo `use`
- **Estilos**: StyleSheet, no inline styles
- **Imports path**: Usar `@/` alias para imports absolutos

## Recursos

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [Zod](https://github.com/colinhacks/zod)

## Licencia

ISC
