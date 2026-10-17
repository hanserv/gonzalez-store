# Copilot Instructions

Este repositorio es una app web en React + TypeScript + Vite para una tienda de tenis y ropa (Gonzalez Peña), con tres zonas: shop, auth y admin. Antes de proponer cambios, respeta el patrón existente y no introduzcas arquitecturas nuevas.

## Documentos de referencia

- Antes de trabajar en productos, variantes, imágenes, tallas o stock, lee `docs/products-spec.md`. Es la fuente de verdad de ese módulo: modelo de datos, reglas de negocio, pantallas del admin, comportamiento de la tienda y plan por etapas.
- Si una tarea contradice ese documento, detente y avisa en vez de improvisar. Si cambias algo del módulo, actualiza el documento en el mismo cambio.

## Stack

- React 19, TypeScript y Vite.
- React Router para navegación.
- TanStack React Query para datos remotos, caché e invalidaciones.
- Supabase para autenticación, base de datos y Storage, con tipos generados.
- React Hook Form + Zod para formularios y validación.
- Zustand para estado global ligero (sesión de auth).
- Tailwind CSS v4, shadcn/ui (componentes base en `src/components/ui`) e iconos de `lucide-react`.
- Sonner para notificaciones.
- El alias `@` apunta a `src/`.

## Convenciones

- Gestor de paquetes: pnpm (nunca npm ni yarn).
- UI: shadcn/ui con Base UI (`@base-ui/react`), NO Radix. No usar `asChild`; usar `render` o `buttonVariants`.
- No instalar ni eliminar dependencias sin preguntarme.
- No modificar archivos fuera del alcance de lo pedido.
- Mantener el estilo de código existente (tabs, comillas simples).

## Comandos

- Gestor de paquetes: pnpm. Nunca uses npm, npx ni yarn. Para ejecutar binarios sin instalarlos usa `pnpm dlx`.
- `pnpm dev`: servidor de desarrollo.
- `pnpm build`: build de producción. Úsalo para verificar que TypeScript no quede inconsistente.
- `pnpm gen:types`: regenera `src/supabase/database.types.ts`.

## Reglas estrictas

- Todo el código va en inglés: identificadores, comentarios, logs y mensajes de consola. Solo el texto visible de la UI va en español.
- No instales la CLI de Supabase como dependencia ni ejecutes `supabase init`. Los tipos se generan solo con `pnpm gen:types`.
- Nunca edites `src/supabase/database.types.ts` a mano.
- Nunca cambies el esquema de la base de datos por tu cuenta. Si una tarea lo requiere, propón el SQL y espera confirmación.
- Nunca subas `.env`, tokens ni llaves al repositorio.
- No escribas dobles guiones ni em dashes en textos generados.
- Haz cambios mínimos y relacionados con la tarea. No reformatees archivos completos ni toques código ajeno a lo pedido.

## Estilo de código

- Respeta `.prettierrc`. El código existente usa tabs, comillas simples, punto y coma y llaves sin espacios interiores, por ejemplo `{supabase}`.
- Named exports por defecto. Excepción: layouts y páginas cargadas con `lazy()` usan `export default`.
- Nombres: hooks `useX`, acciones `xAction`, mappers `mapX`, errores `XError`.
- Organiza por feature, no por capa global.
- Imports con el alias `@/`.
- Combina clases de Tailwind con `cn` de `@/lib/utils`.

## Estructura del proyecto

- `src/shop`: experiencia pública de la tienda.
- `src/auth`: login, layout y estado de sesión.
- `src/admin`: dashboard, CRUD, formularios, hooks, actions, mappers, errores, interfaces y schemas.
- `src/components/ui`: primitivas reutilizables de interfaz.
- `src/lib`: utilidades compartidas (`query-client`, helpers).
- `src/supabase`: cliente y tipos generados de la base de datos.
- `docs`: especificaciones del proyecto.

## Entidad de referencia

`categories` es la implementación de referencia y `brands` la replica sin diferencias. Toda entidad nueva se replica archivo por archivo desde ellas, con los mismos nombres, capas y convenciones. Ante cualquier duda, abre los archivos de categories y brands y copia el patrón.

## Patrón de implementación

Cuando trabajes con datos de Supabase sigue siempre esta cadena. Cada entidad `X` tiene estos archivos bajo `src/admin/`:

1. Interface (`interfaces/x.interface.ts`):
   - `XRow = Tables<'x'>`, la fila tal como viene de Supabase.
   - `X`, el modelo de la app en camelCase (`createdAt` como string ISO 8601).
   - `XInput`, el payload de crear y editar.
2. Mapper (`mappers/x.mapper.ts`):
   - `mapX(row)` convierte `snake_case` a `camelCase`.
   - `prepareXForSave(input)` hace trim del texto, slug en minúsculas, y descripción vacía a `null`.
3. Schema (`schemas/x.schema.ts`):
   - Esquema de Zod SIN anotación `z.ZodType<XInput>`.
   - Exporta `XFormValues = z.infer<typeof xSchema>`.
   - Mensajes de validación en español, con `trim`, límites de longitud y regex para el slug.
4. Error (`errors/x.error.ts`):
   - Unión `XErrorCode`, clase `XError` con `code`, diccionario `X_ERROR_MESSAGES` en español y función `toXError`.
   - `toXError` traduce `23505` (por nombre de constraint), `23503` (en uso) y `PGRST116` (no encontrado). Si no reconoce el error, devuelve el original sin tocarlo.
5. Actions (`actions/`):
   - `getXsAction`, `getXByIdAction`, `createXAction`, `updateXAction`, `deleteXAction`.
   - La lista se ordena por `created_at` descendente.
   - Las acciones devuelven datos ya mapeados con `mapX`.
   - Las mutaciones y el get by id lanzan `toXError(error)`.
6. Hook (`hooks/`): encapsula React Query, invalidaciones y toasts.
7. Page o componente: compone UI, navegación y formulario.

## Formularios

- Usa `react-hook-form` con `zodResolver` y el esquema de `schemas/`.
- Tipa con `useForm<XFormValues>`. `defaultValues` con strings vacíos.
- `onSubmit(values: XFormValues)` pasa los values directo a la mutación. No conviertas `''` a `null` en el formulario, eso ya lo hace `prepareXForSave`.
- Si un esquema usa `z.coerce` o transformaciones, el tipo de entrada y el de salida difieren: usa los tres genéricos de `useForm` (entrada, contexto, salida).
- Si un campo es opcional en la UI, refléjalo en el esquema, en el input y en el modelo.
- Para mostrar errores de negocio usa `X_ERROR_MESSAGES[error.code]` cuando el error sea `XError`.

## React Query y estado

- Usa `queryKey` estables y por dominio, por ejemplo `['categories']`.
- Tras crear, editar o eliminar, invalida la caché del recurso afectado.
- Los side effects (toasts y navegación) van en hooks o páginas, no en componentes puros.
- Para auth usa `useAuthStore` y limpia la caché al cerrar sesión.

## Supabase y datos

- Usa el cliente de `src/supabase/supabase`.
- No expongas rows crudas de Supabase en la UI cuando exista un modelo de dominio.
- Traduce los errores de Postgres a errores de negocio legibles.
- RLS activo en todas las tablas. Patrón base: SELECT público, INSERT, UPDATE y DELETE solo para `authenticated`. Las tablas del módulo de productos tienen una variante: el anónimo solo ve lo activo (detalle en `docs/products-spec.md`).
- Los constraints únicos se llaman `<tabla>_<columnas>_key` (por ejemplo `brands_slug_key`). `toXError` depende de esos nombres exactos, así que al crear una tabla nueva respétalos.
- Tablas actuales: `brands`, `categories`, `products` (el modelo), `product_variants`, `variant_images` y `variant_sizes`.
- Storage: bucket público `product-images`. Las imágenes se guardan en la base de datos como `path` (por ejemplo `variants/{variant_id}/{archivo}`), nunca como URL. La URL pública se arma en el mapper con `supabase.storage.from('product-images').getPublicUrl(path)`.

## Reglas del módulo de productos (resumen)

El detalle completo está en `docs/products-spec.md`. Lo esencial:

- Un producto es el modelo (nombre, marca, categoría). Lo que se vende son sus variantes, cada una con su precio, descripción, imágenes y tallas.
- El título que ve el cliente se compone con el nombre del producto y el nombre de la variante. La URL pertenece a la variante (su slug).
- La variante de portada es la activa con menor `display_order`.
- El stock vive por talla en `variant_sizes` y lo ajusta el admin a mano. Nunca descuentes stock automáticamente.
- Una variante no se puede activar sin al menos una imagen. El estado activo se cambia solo desde el detalle del producto.
- Al borrar una variante o una imagen, elimina primero los archivos del bucket y luego las filas. Las bajas normales se hacen con `is_active = false`.
- Los archivos se suben con nombre único (uuid) y nunca se sobrescriben.

## UI y experiencia

- Reutiliza los componentes de `src/components/ui` y los patrones existentes antes de crear uno nuevo.
- Los textos visibles están en español, conserva ese idioma.
- Estilo visual: limpio, moderno y elegante, con Tailwind y componentes pequeños.
- Paleta de marca: marfil #f5f1e9, oxblood #800020, negro y dorado #C9A961. Tokens de Tailwind `gonzalez-golden` y `gonzalez-red`; títulos con la fuente Cinzel.

## Navegación y layouts

- Sigue la estructura de rutas de `src/app.router.tsx`.
- Protege rutas con `AuthenticatedRoute` y `NotAuthenticatedRoute`.
- Coloca layouts y páginas en la carpeta de su dominio.

## Estado actual

- Terminado: categories (CRUD completo), login y layout de auth.
- Brands: CRUD completo, lista en admin, formularios, rutas `/admin/brands` y menú lateral listos.
- Productos: Etapa 1 (productos), Etapa 2 (variantes con tallas) y Etapa 3 (imágenes) terminadas. En progreso: módulo de productos, por etapas (ver el plan y los checkboxes en `docs/products-spec.md`).
- Después: panel rápido de stock (Etapa 4), tienda pública (Etapa 5) y carrito y checkout (Etapa 6).
  Actualiza esta sección al terminar cada etapa.

## Deuda técnica (refactor final)

- Crear una variante con sus tallas debería ser todo o nada. Hoy son dos peticiones separadas; se resolverá con una función en la base de datos.
- Si falla el guardado después de subir imágenes, pueden quedar archivos huérfanos en el bucket.
- El orden de variantes e imágenes se cambia con flechas; se puede mejorar con arrastrar y soltar.

## Cuando dudes

- Revisa los archivos de categories y brands antes de inventar una convención nueva.
- Prioriza la consistencia con el patrón actual sobre una solución genérica.
- Si una decisión afecta datos, validación o caché, alinea action, mapper, schema y hook juntos.
