# Especificación del mapa de ventas por provincia

Fuente de verdad para el mapa público de ventas por provincia y para el registro manual de totales desde el panel de administración. Si algo de este documento cambia, se actualiza en el mismo cambio.

## 1. Objetivo

Agregar a la Home una sección pública con un mapa de República Dominicana que muestre un marcador con el logo de Gonzalez Peña en cada provincia que tenga ventas registradas. Debajo del mapa se muestra el total general y un botón "Ver desglose" que abre un diálogo con las 32 provincias y su total de ventas. No existe una página `/sales` aparte.

Desde el panel de admin se elige una provincia y se le suma o resta una cantidad de ventas. Todo se maneja por totales (cantidad de ventas). No hay detalle de productos, clientes ni montos de dinero.

Los totales son manuales. No se derivan de los pedidos de WhatsApp ni de ninguna tabla de pedidos. El admin los registra a mano y el mapa solo los muestra. Esta diferencia importa para no contradecir `docs/dashboard-spec.md`, que dice que hoy no existen estadísticas de ventas calculadas desde pedidos.

## 2. Relación con otras especificaciones

- `docs/dashboard-spec.md`: mantiene su regla de no inventar ventas a partir de pedidos. Este mapa no la contradice porque usa totales cargados manualmente. La especificación del dashboard ya incluye la aclaración de que el mapa de provincias usa totales manuales y no pedidos.
- `docs/products-spec.md`: no se toca el modelo de productos, variantes, imágenes ni stock.
- `docs/cart-spec.md`: el carrito y el checkout por WhatsApp no cambian. El mapa no descuenta stock ni crea pedidos.
- `AGENTS.md`: manda en convenciones, gestor de paquetes, estructura, RLS y reglas de cambios en la base de datos.

## 3. Stack y convenciones del proyecto

- React 19, TypeScript y Vite.
- React Router con el paquete `react-router` (no `react-router-dom`).
- TanStack React Query para datos remotos, caché e invalidaciones.
- Supabase para auth y base de datos, con tipos generados en `src/supabase/database.types.ts`.
- React Hook Form + Zod.
- Tailwind CSS v4, shadcn/ui con Base UI (`@base-ui/react`), `lucide-react` y Sonner.
- Zustand no se usa en esta feature.
- Gestor de paquetes: `pnpm`. Nunca `npm`, `npx` ni `yarn`.
- Código en inglés, identificadores, comentarios y logs incluidos. Solo los textos visibles de la interfaz van en español.
- Tabs, comillas simples, punto y coma y llaves sin espacios interiores, por ejemplo `{supabase}`.
- Alias `@/` para imports.
- Combinar clases de Tailwind con `cn` de `@/lib/utils`.
- Named exports por defecto. La excepción son las páginas y layouts cargados con `lazy()`, que usan `export default`. Un componente cargado con `lazy()` sigue la misma excepción.
- No se usa Radix ni la prop `asChild`. Para enlaces con estilo de botón se usa `buttonVariants`.

### Dependencias nuevas

Solo estas tres, y hay que pedir permiso antes de instalarlas:

```bash
pnpm add leaflet react-leaflet@^5
pnpm add -D @types/leaflet
```

No instalar `@types/react-leaflet` (está obsoleto), `leaflet.markercluster`, plugins de heatmap ni ninguna otra librería de mapas. `react-leaflet@^5` es la versión compatible con React 19.

## 4. Estado actual de la base de datos

Los tipos regenerados ya incluyen `provinces`, `province_sales_entries` y `province_sales_summary`. El script `docs/sql/04-province-sales.sql` se conserva como referencia y debe compararse con la base antes de aplicarlo; no se ejecuta automáticamente.

Antes de tocar la base:

1. Confirmar en Supabase, en modo solo lectura, que las columnas, constraints, vista, grants y políticas RLS coinciden con el esquema esperado de este documento.
2. Si coinciden, no alterar nada.
3. Si algo difiere, detenerse y reportarlo. No inventar un esquema distinto ni aplicar cambios por cuenta propia.
4. Si hace falta aplicar el SQL, esperar confirmación explícita antes de ejecutarlo.

Reglas del proyecto que aplican aquí:

- No ejecutar `supabase init`.
- No crear una carpeta `supabase/migrations`. El proyecto guarda los scripts en `docs/sql` y se ejecutan en el SQL Editor de Supabase.
- No instalar la CLI de Supabase como dependencia nueva. Ya existe `supabase` en `devDependencies`.
- No editar `src/supabase/database.types.ts` a mano. Se regenera con `pnpm gen:types`.
- No cambiar el esquema, los grants ni las políticas RLS sin confirmación.

### Esquema esperado

```sql
provinces (
	id smallint identity primary key,
	name text not null unique,
	slug text not null unique,
	lat double precision not null,
	lng double precision not null
)

province_sales_entries (
	id bigint identity primary key,
	province_id smallint not null references provinces(id),
	quantity integer not null check (quantity <> 0),
	note text,
	created_by uuid default auth.uid() references auth.users(id),
	created_at timestamptz not null default now()
)

/* Vista agregada. No expone notas ni created_by. */
province_sales_summary (id, name, slug, lat, lng, total_sales)
```

`total_sales` es `coalesce(sum(quantity), 0)::int` por provincia. Las cantidades negativas son correcciones, no ventas negativas del negocio.

### RLS y permisos

El proyecto no tiene un rol `admin` en la base de datos. El panel se protege con `AuthenticatedRoute` y las escrituras se permiten a `authenticated`, igual que en `products`, `brands` y `categories`. Para esta feature, "admin" significa cualquier usuario autenticado. Si algún día se agregan roles reales, se actualizan las políticas.

- `provinces`: lectura pública para `anon` y `authenticated`. Sin políticas de escritura para usuarios, el seed se ejecuta desde el SQL Editor como `postgres`.
- `province_sales_entries`: `select` e `insert` solo para `authenticated`. Sin `update` ni `delete`.
- La política de inserción debe comprobar `created_by = auth.uid()` para que nadie pueda registrar una entrada a nombre de otro usuario.
- `province_sales_summary`: lectura para `anon` y `authenticated`. La vista solo expone nombres de provincia y totales agregados, nunca las filas de `province_sales_entries`.
- La vista necesita ejecutarse con los permisos del owner (`security_invoker = false`) para que `anon` pueda leer los agregados sin tener acceso a las entradas. Es intencional y no expone datos sensibles. Si el linter de Supabase lo marca, se documenta la decisión y no se cambia el contrato de datos.

### SQL propuesto

El script completo vive en `docs/sql/04-province-sales.sql`, siguiendo el estilo de `docs/sql/03-dashboard-stats.sql`: comentarios en inglés, transacción completa y ejecución manual en el SQL Editor.

```sql
/*
	Province sales: provinces, province_sales_entries and province_sales_summary.

	Proposal only. Confirm with the project owner before running it.
	If the objects already exist, review them first and do not apply destructive changes.
*/

begin;

create table if not exists public.provinces (
	id smallint generated by default as identity primary key,
	name text not null unique,
	slug text not null unique,
	lat double precision not null,
	lng double precision not null
);

create table if not exists public.province_sales_entries (
	id bigint generated by default as identity primary key,
	province_id smallint not null references public.provinces(id),
	quantity integer not null check (quantity <> 0),
	note text,
	created_by uuid default auth.uid() references auth.users(id),
	created_at timestamptz not null default now()
);

create index if not exists province_sales_entries_province_id_idx
	on public.province_sales_entries (province_id);

create or replace view public.province_sales_summary
with (security_invoker = false)
as
select
	p.id,
	p.name,
	p.slug,
	p.lat,
	p.lng,
	coalesce(sum(e.quantity), 0)::int as total_sales
from public.provinces p
left join public.province_sales_entries e on e.province_id = p.id
group by p.id, p.name, p.slug, p.lat, p.lng;

alter table public.provinces enable row level security;
alter table public.province_sales_entries enable row level security;

drop policy if exists "Provinces are public" on public.provinces;
create policy "Provinces are public"
on public.provinces
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can read province sales entries" on public.province_sales_entries;
create policy "Authenticated can read province sales entries"
on public.province_sales_entries
for select
to authenticated
using (true);

drop policy if exists "Authenticated can insert province sales entries" on public.province_sales_entries;
create policy "Authenticated can insert province sales entries"
on public.province_sales_entries
for insert
to authenticated
with check (created_by = auth.uid());

revoke all on public.province_sales_summary from public;
grant select on public.province_sales_summary to anon, authenticated;

grant select on public.provinces to anon, authenticated;
revoke all on public.province_sales_entries from anon;
grant select, insert on public.province_sales_entries to authenticated;

insert into public.provinces (name, slug, lat, lng) values
	('Distrito Nacional',        'distrito-nacional',        18.4861, -69.9312),
	('Azua',                     'azua',                     18.4533, -70.7347),
	('Baoruco',                  'baoruco',                  18.4817, -71.4186),
	('Barahona',                 'barahona',                 18.2085, -71.1008),
	('Dajabón',                  'dajabon',                  19.5499, -71.7083),
	('Duarte',                   'duarte',                   19.3009, -70.2528),
	('El Seibo',                 'el-seibo',                 18.7659, -69.0388),
	('Elías Piña',               'elias-pina',               18.8761, -71.7042),
	('Espaillat',                'espaillat',                19.3939, -70.5256),
	('Hato Mayor',               'hato-mayor',               18.7635, -69.2564),
	('Hermanas Mirabal',         'hermanas-mirabal',         19.3779, -70.4184),
	('Independencia',            'independencia',            18.4900, -71.7500),
	('La Altagracia',            'la-altagracia',            18.6150, -68.7080),
	('La Romana',                'la-romana',                18.4273, -68.9728),
	('La Vega',                  'la-vega',                  19.2200, -70.5289),
	('María Trinidad Sánchez',   'maria-trinidad-sanchez',   19.3833, -69.8500),
	('Monseñor Nouel',           'monsenor-nouel',           18.9368, -70.4091),
	('Monte Cristi',             'monte-cristi',             19.8500, -71.6500),
	('Monte Plata',              'monte-plata',              18.8081, -69.7847),
	('Pedernales',               'pedernales',               18.0384, -71.7440),
	('Peravia',                  'peravia',                  18.2794, -70.3313),
	('Puerto Plata',             'puerto-plata',             19.7934, -70.6884),
	('Samaná',                   'samana',                   19.2057, -69.3364),
	('San Cristóbal',            'san-cristobal',            18.4167, -70.1000),
	('San José de Ocoa',         'san-jose-de-ocoa',         18.5436, -70.5042),
	('San Juan',                 'san-juan',                 18.8059, -71.2299),
	('San Pedro de Macorís',     'san-pedro-de-macoris',     18.4539, -69.3086),
	('Sánchez Ramírez',          'sanchez-ramirez',          19.0522, -70.1497),
	('Santiago',                 'santiago',                 19.4517, -70.6970),
	('Santiago Rodríguez',       'santiago-rodriguez',       19.4833, -71.3417),
	('Santo Domingo',            'santo-domingo',            18.5100, -69.8000),
	('Valverde',                 'valverde',                 19.5521, -70.9871)
on conflict (slug) do nothing;

commit;
```

Notas del seed:

- Santo Domingo se coloca ligeramente al este de Distrito Nacional a propósito, para que los marcadores no se superpongan.
- La ortografía oficial de la provincia es "Bahoruco". El seed conserva "Baoruco" para no duplicar filas si la tabla ya existe con ese slug. Si la base se crea desde cero y se prefiere la forma oficial, usar `Bahoruco` con slug `bahoruco` y confirmarlo antes.
- Si ya hay filas en `provinces`, `on conflict (slug) do nothing` evita duplicados. Antes de aplicar, consultar el contenido actual y reportar si ya existían provincias.
- Si no hay acceso para aplicar el SQL, dejar el archivo listo y avisar. No inventar credenciales ni ejecutar cambios sin confirmación.

Criterio de aceptación de datos: `select count(*) from public.provinces` devuelve 32 y `province_sales_summary` devuelve 32 filas con `total_sales = 0` cuando no hay entradas.

## 5. Alcance

### Incluido

1. Verificación del esquema y, si hace falta, SQL propuesto y seed de las 32 provincias.
2. Regeneración de los tipos de Supabase con `pnpm gen:types`.
3. Instalación de Leaflet y `react-leaflet` con `pnpm`, previa confirmación.
4. Capa de datos compartida para leer totales y registrar ventas.
5. Sección pública en la Home con mapa, total general y desglose por provincia.
6. Página de admin `/admin/sales` con formulario para sumar o restar ventas y entrada en el menú lateral.

### Fuera de alcance

- Montos de dinero, productos, clientes o cualquier detalle de venta.
- Clustering, heatmaps, animaciones, 3D o mapas de calor.
- Historial o listado de movimientos en el admin. La tabla `province_sales_entries` existe para auditoría, pero no se muestra.
- Edición o borrado de movimientos.
- Cambios al esquema, RLS o roles existentes sin confirmación.
- Integración con el dashboard, con pedidos o con el carrito. No se agregan tablas de pedidos.
- Descuento automático de stock.
- Roles nuevos de administrador. Se mantiene el modelo actual de `authenticated`.

## 6. Arquitectura de archivos

El proyecto no usa `src/features`. La feature se reparte entre un dominio compartido de datos y las dos áreas que la consumen:

```text
src/province-sales/
  actions/
    get-province-sales.action.ts
    create-province-sales-entry.action.ts
  errors/
    province-sales.error.ts
  hooks/
    useProvinceSales.tsx
    useAddProvinceSales.tsx
  interfaces/
    province-sales.interface.ts
  lib/
    format.ts
  mappers/
    province-sales.mapper.ts
  schemas/
    add-province-sales.schema.ts

src/shop/components/sales-map/
  SalesMap.tsx
  ProvinceSalesSection.tsx

src/admin/pages/province-sales/
  AdminProvinceSalesPage.tsx
  ui/
    AddProvinceSalesForm.tsx
```

Archivos existentes que se tocan:

- `src/app.router.tsx`: ruta `/admin/sales`.
- `src/shop/pages/home/HomePage.tsx`: sección del mapa debajo del hero.
- `src/admin/interfaces/sidebar.config.ts`: ítem del menú de admin.
- `docs/sql/04-province-sales.sql`: script de base de datos de referencia.
- `docs/dashboard-spec.md`: una línea para aclarar que los totales del mapa son manuales.

No crear `src/features/`, `src/components/sales-map` ni una carpeta de migraciones.

## 7. Modelos de la aplicación

Los tipos se definen en `src/province-sales/interfaces/province-sales.interface.ts`.

```ts
import type {Database} from '@/supabase/database.types';

export type ProvinceSalesSummaryRow =
	Database['public']['Views']['province_sales_summary']['Row'];

export interface ProvinceSales {
	id: number;
	name: string;
	slug: string;
	lat: number;
	lng: number;
	totalSales: number;
}

export interface ProvinceSalesEntryInput {
	provinceId: number;
	quantity: number;
	note: string;
}
```

Los tipos generados de una vista marcan todas las columnas como nullable. Se resuelve en el mapper, nunca con `!` repartidos por los componentes.

## 8. Capa de datos

### `getProvinceSalesAction`

Archivo: `src/province-sales/actions/get-province-sales.action.ts`.

- Consulta `province_sales_summary` con `select('id,name,slug,lat,lng,total_sales')`.
- Ordena por `name` ascendente.
- Lanza el error de Supabase si lo hay.
- Mapea cada fila con `mapProvinceSales` y devuelve `ProvinceSales[]`.

### `createProvinceSalesEntryAction`

Archivo: `src/province-sales/actions/create-province-sales-entry.action.ts`.

- Inserta en `province_sales_entries` con `{province_id, quantity, note}`.
- Usa `prepareProvinceSalesEntryForSave` para convertir `note` vacío a `null`.
- No devuelve la entidad creada. La UI solo necesita saber si la mutación tuvo éxito.
- Lanza `toProvinceSalesError(error)` cuando falla.

### `useProvinceSales`

Archivo: `src/province-sales/hooks/useProvinceSales.tsx`.

```ts
export const useProvinceSales = () =>
	useQuery({
		queryKey: ['province-sales'],
		queryFn: getProvinceSalesAction,
	});
```

Es la única consulta de lectura. La sección de la Home, el desglose y el formulario de admin comparten la misma clave y la misma caché.

### `useAddProvinceSales`

Archivo: `src/province-sales/hooks/useAddProvinceSales.tsx`.

- `useMutation` con `mutationFn: createProvinceSalesEntryAction`.
- `onSuccess`: `invalidateQueries({queryKey: ['province-sales']})` y `toast.success('Ventas registradas.')`.
- `onError`: si el error es `ProvinceSalesError`, muestra `PROVINCE_SALES_ERROR_MESSAGES[error.code]`. Si no, muestra "No se pudieron registrar las ventas.".
- Los toasts viven en el hook, no en el componente puro.

### Mapper

Archivo: `src/province-sales/mappers/province-sales.mapper.ts`.

```ts
export const mapProvinceSales = (
	row: ProvinceSalesSummaryRow,
): ProvinceSales => ({
	id: Number(row.id ?? 0),
	name: row.name ?? '',
	slug: row.slug ?? '',
	lat: Number(row.lat ?? 0),
	lng: Number(row.lng ?? 0),
	totalSales: Number(row.total_sales ?? 0),
});

export const prepareProvinceSalesEntryForSave = (
	input: ProvinceSalesEntryInput,
) => ({
	province_id: input.provinceId,
	quantity: input.quantity,
	note: input.note.trim() || null,
});
```

### Errores de negocio

Archivo: `src/province-sales/errors/province-sales.error.ts`.

- `ProvinceSalesErrorCode`: `not_authorized`, `invalid_quantity`, `not_found`.
- `ProvinceSalesError` con `code`.
- `PROVINCE_SALES_ERROR_MESSAGES` en español.
- `toProvinceSalesError` traduce `42501` a `not_authorized`, `23514` a `invalid_quantity` y `23503` a `not_found` solo cuando el constraint es `province_sales_entries_province_id_fkey`. Si no reconoce el error, devuelve el original sin tocarlo.

Mensajes sugeridos:

- `not_authorized`: "No tienes permiso para registrar ventas."
- `invalid_quantity`: "La cantidad no es válida."
- `not_found`: "La provincia ya no existe."

### Formato de números

Archivo: `src/province-sales/lib/format.ts`.

```ts
const numberFormatter = new Intl.NumberFormat('es-DO');

export const formatSalesCount = (value: number) =>
	numberFormatter.format(value);

export const formatSalesLabel = (value: number) =>
	`${formatSalesCount(value)} ${Math.abs(value) === 1 ? 'venta' : 'ventas'}`;
```

Los totales de ventas no son dinero. No usar `formatCurrency` para ellos.

## 9. Sección pública en la Home

### Ubicación

- La sección vive en `src/shop/pages/home/HomePage.tsx`, debajo de la sección Colección.
- No se agrega la ruta `/sales`, ni `SalesPage`, ni un enlace "Ventas" en `nav-items.ts` o `ShopHeader.tsx`.
- El header es fijo, pero la sección queda debajo del hero, así que no necesita `pt-28`.
- El footer sigue oculto en la Home. El comentario de `ShopLayout` debe decir que la Home termina con la sección de ventas, no que es solo el hero.

### `HomePage`

- Envuelve la sección en un bloque `bg-gray-50 px-6 pb-16 pt-6 md:pt-10` con contenedor `mx-auto max-w-6xl`. El gris alterna con el blanco de la sección Colección que va arriba.
- Título "Ventas por provincia" con la fuente por defecto del proyecto, `text-3xl font-bold md:text-4xl`, sin línea de acento ni párrafo debajo. Arriba lleva la etiqueta pequeña "Nuestro alcance" en rojo, centrada, con el mismo estilo de la etiqueta de la sección Colección.
- Debajo, `ProvinceSalesSection`.

### `ProvinceSalesSection`

Archivo: `src/shop/components/sales-map/ProvinceSalesSection.tsx`.

- Llama `useProvinceSales()` una sola vez y pasa `provinces` al mapa y al resumen. No llamar el hook dos veces.
- Layout: mapa arriba y resumen abajo, con `flex flex-col gap-6`.
- El resumen muestra el total general en grande con `formatSalesCount`, la etiqueta "Ventas totales", un icono `TrendingUp` sobre `bg-gonzalez-red` y el botón "Ver desglose".
- "Ver desglose" abre un `Dialog` con las 32 provincias, ordenadas por `totalSales` descendente y, a igualdad, por nombre ascendente con `localeCompare('es')`. Incluye también las provincias con 0 ventas, el total general arriba, una cabecera "Provincia" y "Ventas", y la lista con scroll.
- Si no hay provincias, el diálogo muestra un estado vacío discreto y la sección muestra una tarjeta con "Aún no hay provincias registradas."
- Mientras carga: skeleton del mapa con la misma altura y skeleton del resumen. No simular una tabla.
- Si falla: tarjeta blanca con el mensaje "No pudimos cargar las ventas por provincia." y un botón "Reintentar" que llama `refetch`.
- El mapa se carga con `React.lazy` y `Suspense` para que Leaflet no entre al bundle principal. El fallback es un `Skeleton` de la misma altura.
- El componente lazy usa `export default`, como las páginas y layouts cargados con `lazy()`.

### `SalesMap`

Archivo: `src/shop/components/sales-map/SalesMap.tsx`.

- Usar `react-leaflet`: `MapContainer`, `TileLayer`, `Marker`, `Popup` y `useMap`.
- Importar `leaflet/dist/leaflet.css` en este archivo, no en `index.css`, para que el CSS viaje en el chunk diferido.
- Tiles OpenStreetMap estándar, sin API key:

```text
https://tile.openstreetmap.org/{z}/{x}/{y}.png
```

- Atribución: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`.
- Mostrar los tiles a todo color, sin filtros de escala de grises ni opacidad.
- Configuración:
  - `center={[18.9, -70.4]}`, `zoom={8}`, `minZoom={7}`.
  - `maxBounds={[[17.2, -72.5], [20.2, -68.0]]}`.
  - `scrollWheelZoom={false}` para no secuestrar el scroll de la página.
  - Altura `h-[360px] md:h-[480px]`, `w-full`.
  - Envoltura con `relative isolate z-0 overflow-hidden rounded-xl border border-gray-200 bg-gonzalez-bone shadow-xs`, `role='region'` y `aria-label='Mapa de ventas por provincia'`. El `isolate` y el `z-0` evitan que los panes de Leaflet (que usan z-index alto) tapen el header fijo de la tienda.
- Marcadores: solo provincias con `totalSales > 0`.
- Icono: no usar `L.Icon.Default`. Reutilizar `public/gonzalez-logo-white.png` dentro de un badge circular oscuro, sin borde, armado con `L.divIcon`:

```ts
const markerIcon = L.divIcon({
	className: 'province-sales-marker',
	html: `
		<div style="width: 40px; height: 40px; border-radius: 9999px; background: rgba(17,17,17,0.96); box-shadow: 0 10px 24px rgba(0,0,0,0.18); display:flex; align-items:center; justify-content:center; overflow:hidden;">
			<img src="/gonzalez-logo-white.png" alt="Gonzalez Peña" style="width: 28px; height: 28px; object-fit: contain; filter: brightness(1.2);" />
		</div>
	`,
	iconSize: [40, 40],
	iconAnchor: [20, 20],
	popupAnchor: [0, -20],
});
```

- Popup: nombre de la provincia y `formatSalesLabel(totalSales)`. Ejemplo: "Santiago", "5 ventas".
- En móvil, desactivar `dragging` y `touchZoom` para que el dedo no quede atrapado paneando el mapa. Los controles de zoom siguen visibles. Usar `useMediaQuery` de `@/shop/hooks/useMediaQuery`.
- Sincronizar esos dos controles con un componente interno `MapInteractionSync` que use `useMap` y `useEffect`. Los props de `MapContainer` no se actualizan de forma fiable cuando cambia el breakpoint.
- El `aria-label` de la envoltura describe el mapa. El desglose en diálogo es la alternativa accesible al mapa.
- Probar en desarrollo con `StrictMode` activo. Si aparece "Map container is already initialized", no desactivar `StrictMode`; usar el patrón recomendado por `react-leaflet`.

## 10. Panel de admin `/admin/sales`

### Ruta y menú

- Agregar la ruta hija `sales` dentro del bloque `/admin` de `src/app.router.tsx`, protegida por el `AuthenticatedRoute` que ya envuelve el layout.
- Importar `AdminProvinceSalesPage` con named export.
- Agregar `{icon: MapPin, label: 'Ventas por provincia', to: '/admin/sales'}` a `src/admin/interfaces/sidebar.config.ts`. El sidebar de escritorio y el móvil consumen esa misma configuración.
- No crear un sistema de roles nuevo. El guard actual es suficiente.

### `AdminProvinceSalesPage`

Archivo: `src/admin/pages/province-sales/AdminProvinceSalesPage.tsx`.

- `AdminTitle` con título "Ventas por provincia" y subtítulo "Registra los totales de ventas de cada provincia".
- Debajo, `AddProvinceSalesForm` dentro de una tarjeta blanca con el mismo estilo de `BrandForm`: `mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6`.

### `AddProvinceSalesForm`

Archivo: `src/admin/pages/province-sales/ui/AddProvinceSalesForm.tsx`.

- React Hook Form con `zodResolver` y `addProvinceSalesSchema`.
- Tipar con los tres genéricos, como `ProductVariantForm`, porque `z.coerce.number()` hace que la entrada y la salida difieran:

```ts
useForm<AddProvinceSalesFormInput, unknown, AddProvinceSalesFormValues>({
	resolver: zodResolver(addProvinceSalesSchema),
	defaultValues: {provinceId: '', quantity: '', note: ''},
});
```

- Campos:
  1. `provinceId`: `select` nativo, no un componente shadcn nuevo. El proyecto ya usa `<select>` en `ProductForm`, `ProductFilters` y `FilterFields`, con `Label` y las clases `h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50`. Las opciones vienen de `useProvinceSales()`, ordenadas por nombre. La opción inicial es "Selecciona una provincia". Debajo, mostrar "Total actual: N ventas" de la provincia elegida.
  2. `quantity`: `Input` numérico, `step='1'`, sin `min`, porque se permiten negativos para corregir. Texto de ayuda: "Usa un número negativo para corregir un error."
  3. `note`: `Textarea` opcional, máximo 200 caracteres. Placeholder: "Ej. Feria en Santiago".
- No usar `asChild` ni agregar `select.tsx`, `form.tsx` o `table.tsx` con el CLI. `Table`, `Skeleton`, `Card`, `Input`, `Label`, `Textarea`, `Button` y `Sheet` ya existen.
- Esquema en `src/province-sales/schemas/add-province-sales.schema.ts`:

```ts
import {z} from 'zod';

export const addProvinceSalesSchema = z.object({
	provinceId: z.coerce
		.number('Selecciona una provincia.')
		.int('La provincia es inválida.')
		.positive('Selecciona una provincia.'),
	quantity: z.coerce
		.number('La cantidad debe ser un número.')
		.int('La cantidad debe ser un número entero.')
		.refine((value) => value !== 0, 'La cantidad no puede ser 0.'),
	note: z
		.string()
		.trim()
		.max(200, 'La nota no puede superar 200 caracteres')
		.default(''),
});

export type AddProvinceSalesFormValues = z.infer<typeof addProvinceSalesSchema>;
export type AddProvinceSalesFormInput = z.input<typeof addProvinceSalesSchema>;
```

- Ajustar los mensajes a Zod 4. El proyecto usa la forma `.int('mensaje')` y `.positive('mensaje')`, no el objeto `{message}`.
- Validación adicional en cliente: si la cantidad es negativa y `totalActual + quantity < 0`, bloquear el envío con `setError('quantity', {message: 'El total de la provincia no puede quedar negativo.'})`. El esquema no conoce el total actual, así que esta comprobación va en el submit del formulario.
- Mientras `useProvinceSales()` carga, deshabilitar el select y el botón. Si falla, mostrar un aviso con "Reintentar".
- Al enviar: llamar `useAddProvinceSales()`, deshabilitar el botón mientras `isPending` y mostrar `Loader2` con `animate-spin`.
- Al tener éxito, `reset()` conservando la provincia seleccionada para facilitar cargas seguidas. La lista de totales se actualiza sola por la invalidación de `['province-sales']`.
- El formulario no muestra el historial de entradas ni permite editar o borrar movimientos.

## 11. Tipos de Supabase y mapeo

- Los tipos ya incluyen las tablas y la vista; se regeneraron con `pnpm gen:types`. El script ya existe en `package.json` y usa la CLI instalada como devDependency.
- No editar `src/supabase/database.types.ts` a mano.
- Si hace falta regenerar y falla por autenticación o por el project id, avisar. No inventar tipos manuales en el archivo generado.
- Los tipos de la vista se leen desde `Database['public']['Views']['province_sales_summary']['Row']`. No hay helper `Views` en el archivo generado, así que se accede por el tipo `Database`.
- Las columnas de la vista son nullable. El mapper las normaliza con `?? 0` y `Number(...)`.
- No usar `any`, `as unknown as` ni `!` para silenciar los tipos de la vista.

## 12. Plan por etapas

Implementar una etapa por vez y verificar antes de pasar a la siguiente.

- [ ] Etapa 1, base de datos: verificar que `provinces`, `province_sales_entries` y `province_sales_summary` coinciden con `docs/sql/04-province-sales.sql`; reportar diferencias. Los tipos ya están regenerados; si hace falta cambiar la base, esperar confirmación.
- [ ] Etapa 2, dependencias: pedir permiso e instalar `leaflet`, `react-leaflet@^5` y `@types/leaflet` con `pnpm`.
- [ ] Etapa 3, capa de datos: interfaces, mapper, errores, acciones, hooks y esquema del formulario en `src/province-sales/`.
- [ ] Etapa 4, Home: `ProvinceSalesSection`, `SalesMap`, resumen y diálogo en `HomePage`. Sin ruta `/sales` ni enlaces nuevos.
- [ ] Etapa 5, panel de admin: `AdminProvinceSalesPage`, `AddProvinceSalesForm`, ruta `/admin/sales` y entrada en `sidebar.config.ts`.
- [ ] Etapa 6, verificación: `pnpm build`, pruebas manuales de los criterios de aceptación, revisión de que Leaflet quedó en un chunk aparte y de que no hay errores en consola.
- [ ] Etapa 7, documentación: actualizar `docs/dashboard-spec.md` con la aclaración de totales manuales y este documento si cambió alguna decisión.

## 13. Criterios de aceptación

1. `provinces` tiene 32 filas y los nombres y slugs son los del seed aprobado.
2. `province_sales_summary` devuelve 32 filas y `total_sales = 0` cuando no hay entradas.
3. Los tipos generados incluyen las tablas y la vista después de `pnpm gen:types`, sin ediciones manuales.
4. `pnpm build` pasa sin errores y sin `any` nuevos.
5. En la Home se ve el mapa centrado en República Dominicana con tiles de OpenStreetMap a todo color y sin avisos de API key. Sin ventas registradas no hay marcadores.
6. El diálogo "Ver desglose" lista las 32 provincias, ordenadas por ventas descendente y, a igualdad, por nombre ascendente. El total general coincide con la suma de las filas.
7. Desde `/admin/sales` se registra `+5` en Santiago: aparece un marcador con el logo en Santiago, el popup dice "5 ventas" y el mapa y el desglose se actualizan sin recargar la página.
8. Un `-2` en Santiago deja el total en 3 y todo se actualiza sin recargar.
9. Un `-10` cuando Santiago tiene 3 se rechaza en el formulario con el mensaje "El total de la provincia no puede quedar negativo." y no se inserta nada.
10. Sin sesión, la sección pública de la Home funciona y lee la vista. Un usuario sin sesión no puede insertar en `province_sales_entries` por RLS.
11. Un usuario autenticado sí puede insertar, porque el proyecto no distingue roles de admin. Si más adelante se agregan roles, este criterio se revisa.
12. Leaflet queda en un chunk separado por la carga diferida.
13. En móvil el mapa se ve completo, la Home se puede scrollear sin quedar atrapada en el mapa y el header fijo no queda tapado por los paneles de Leaflet.
14. No hay errores 404 de iconos por defecto de Leaflet ni errores en consola.
15. La sección pública no expone `province_sales_entries`, sus notas ni `created_by`. Solo lee la vista agregada.
16. No se crea la ruta `/sales` ni un enlace "Ventas" en el header o el footer. El mapa solo aparece en la Home.

## 14. Reglas para el agente

- Leer `AGENTS.md`, `docs/products-spec.md`, `docs/cart-spec.md` y `docs/dashboard-spec.md` antes de tocar código.
- Revisar `categories` y `brands` antes de inventar una convención nueva. La capa de datos sigue el patrón de `src/admin`: interface, mapper, error, action y hook.
- Usar `pnpm` para todo. No usar `npm`, `npx` ni `yarn`.
- Pedir permiso antes de instalar dependencias y antes de aplicar cambios en la base de datos.
- No modificar el esquema, los grants ni las políticas RLS sin confirmación. Si se propone SQL, va en `docs/sql` y se ejecuta a mano.
- No editar `src/supabase/database.types.ts` a mano.
- No agregar dependencias fuera de `leaflet`, `react-leaflet@^5` y `@types/leaflet`.
- Usar los componentes de `src/components/ui` que ya existen. No agregar componentes shadcn nuevos para `select`, `form`, `table` o `skeleton`.
- No usar Radix ni `asChild`. Usar `render`, `buttonVariants` o elementos nativos según el patrón existente.
- Textos de interfaz en español. Identificadores, comentarios y logs en inglés.
- Mantener los cambios mínimos y relacionados con la feature. No reformatear archivos completos.
- Al terminar, entregar un resumen corto con archivos creados y modificados, dónde quedó la sección pública de la Home, dónde quedó el formulario de admin y cualquier supuesto o pendiente.
- Mostrar siempre las opciones de commit (mensaje sugerido y archivos a incluir). El usuario hace el commit.

## 15. Pendientes de confirmar

1. `provinces`, `province_sales_entries` y `province_sales_summary` ya existen y los tipos están regenerados. Falta confirmar que el script de referencia `docs/sql/04-province-sales.sql` coincide con la base actual, en especial el check `quantity <> 0`.
2. Si se autoriza instalar `leaflet`, `react-leaflet@^5` y `@types/leaflet`.
3. Si se autoriza aplicar el SQL propuesto en `docs/sql/04-province-sales.sql`.
4. La sección pública va en la Home. No se crea `/sales` ni un enlace "Ventas".
5. Si se acepta que "admin" sea cualquier usuario autenticado, como en el resto del panel, o si se quiere introducir un rol real. Introducir roles queda fuera de esta spec.
6. El marcador usa `public/gonzalez-logo-white.png` en un badge oscuro. Confirmar que se lee bien a 40 px o generar `public/logo-pin.png` a partir del símbolo.
7. Si se mantiene "Baoruco" o se corrige a "Bahoruco" en el seed.
8. Si el mapa debe ser público para cualquier visitante o solo visible con sesión. La spec asume público, como dice el objetivo.
9. Si el desglose en diálogo es suficiente o si el admin necesita una tabla de totales aparte en `/admin/sales`. La spec solo pide el formulario y el total actual junto al select.
10. Si la Home debe seguir sin footer. Hoy el mapa se agrega al final y el footer se mantiene oculto en `/`.
