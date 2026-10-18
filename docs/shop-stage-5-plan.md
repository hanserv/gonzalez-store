# Plan de la Etapa 5: tienda

Plan de trabajo para la Etapa 5 del módulo de productos (ver `docs/products-spec.md`). La fuente de verdad de reglas de negocio sigue siendo ese documento; este archivo solo organiza los pasos de implementación y se marca a medida que avanza.

## Decisiones ya tomadas

- La página de la variante vive en `product/:slug` (se mantiene la ruta actual del router y se corrige el spec).
- El carrusel usa `embla-carousel-react` (dependencia nueva, autorizada).
- El catálogo vive en `/store`, tal como el header ya lo anuncia.
- El clic en una card abre la variante que se muestra al hover en escritorio; en móvil (sin hover) abre siempre la portada.
- Filtros y orden del catálogo: búsqueda por nombre, marca, categoría, "Solo ofertas", "Solo populares" y rango de precio con slider de dos pulgares (sin mostrar la cantidad de productos). Orden por defecto "Más recientes", con opción de precio ascendente, precio descendente y nombre A-Z. Los productos populares encabezan la lista solo en la vista por defecto: si hay filtros o un orden elegido, la lista respeta eso.
- Filtros y orden viven en un botón "Filtrar y ordenar" en la cabecera (con insignia de filtros activos) que abre un `Sheet` lateral derecho con overlay oscurecido y desenfocado. Sección "Ordenar por" arriba y "Filtros" debajo; el pie cierra con "Ver resultados" y ofrece "Limpiar todo". Los productos deben ser lo primero que se ve, sin barra de filtros ocupando espacio.
- La cabecera del catálogo es una fila con el título "Tienda" a la izquierda en fuente Cinzel (con línea de acento roja debajo, sin subtítulo, siguiendo `AdminTitle` del panel) y el botón de filtros a la derecha.
- El catálogo va sobre `bg-gray-50` con las cards blancas y `ring-1 ring-foreground/10`, el mismo contraste del panel de administrador (área gris clara, cards blancas sin borde duro), así que no hay banda de color aparte; la página de variante sigue sobre blanco. Las cards llevan `shadow-xs` y sombra al hover. Como las imágenes son PNG sin fondo, la zona de imagen es blanca con padding y la imagen centrada con `object-contain`.
- El filtrado se hace en cliente sobre el catálogo cargado. El precio de referencia es el precio final de la variante portada, que es el que muestra la card.
- Sin botón de compra ni carrito: eso es la Etapa 6.

## Pasos

### 1. Dependencia

- [x] `pnpm add embla-carousel-react`.

### 2. Capa de datos (dominio `src/shop/`)

- [x] `src/shop/interfaces/catalog.interface.ts`: `ShopCatalogVariant` (`id`, `slug`, `name`, `finalPrice`, `coverImageUrl`) y `ShopCatalogItem` (`id`, `name`, `isPopular`, `activeVariantCount`, `variants[]`).
- [x] `src/shop/interfaces/variant.interface.ts`: `ShopVariantImage`, `ShopVariantSize`, `ShopVariant` (`id`, `slug`, `title`, `description`, `price`, `discountPercentage`, `finalPrice`, `isActive`, `images[]`, `sizes[]`, `product` con `id`, `name` y `brandName`) y `ShopVariantSibling` (`id`, `slug`, `name`, `coverImageUrl`).
- [x] `src/shop/mappers/catalog.mapper.ts`: `snake_case` a `camelCase`, precio final `price * (1 - discount_percentage / 100)`, portada = variante activa con menor `display_order` y URL pública con `buildVariantImageUrl` (reutilizado del mapper de variantes).
- [x] `src/shop/mappers/variant.mapper.ts`: `mapShopVariant` con título compuesto (producto + variante), precio final y URL de imágenes.
- [x] `src/shop/actions/catalog/get-catalog.action.ts`: `products` con unión interna a variantes activas, imágenes anidadas e `is_popular`, ordenado por `created_at` descendente.
- [x] `src/shop/actions/catalog/get-brands.action.ts` y `get-categories.action.ts`: listas públicas para los selects de filtros.
- [x] `src/shop/actions/variants/get-variant-by-slug.action.ts`: variante por `slug` en una sola consulta, con producto, marca, imágenes, tallas y las variantes hermanas anidadas en el producto. `maybeSingle` para distinguir "no existe" de error; las hermanas se filtran por activas y distintas de la actual en el mapper.
- [x] `src/shop/hooks/catalog/useCatalog.tsx`, `useShopBrands.tsx`, `useShopCategories.tsx` y `src/shop/hooks/variants/useVariantBySlug.tsx` (queryKeys `['shop','catalog']`, `['shop','brands']`, `['shop','categories']` y `['shop','variant',slug]`).

### 3. Catálogo (`/store`)

- [x] `src/shop/components/catalog/ProductCard.tsx`: card blanca con `shadow-xs` y `ring-1 ring-foreground/10` sobre la página `bg-gray-50` (anillo dorado si es popular). Jerarquía: zona de imagen en cuadro de proporción fija (`aspect-square`), fondo blanco, `overflow-hidden`, padding e imagen centrada con `object-contain` (con zoom suave `group-hover:scale-110` y `transition-transform duration-500`, sin cambio de tamaño en reposo), separada del bloque de texto por un ornamento negro con rombo central (`CardDivider`). Bloque de texto en fila alineada abajo (`items-end`): a la izquierda marca en mayúsculas pequeña y gris, nombre del producto en negrita, nombre del color (solo escritorio) y "N variantes"; a la derecha, alineado a la derecha, el precio final en `text-xl` y el original tachado si hay descuento. Insignia "Popular" con degradado dorado, estrella y mayúsculas, y descuento con el mismo lenguaje visual. En escritorio, una barra flotante blanca con sombra y swatches circulares (fondo `neutral-100` e imagen con `object-contain`) sube desde la parte baja de la imagen (`opacity-0` y `pointer-events-none`, activada por `group-hover` y foco, máximo 6 swatches y "+N" para el resto); los swatches cambian imagen, precio y color; al salir vuelve la portada; clic en la card a la variante mostrada. Precarga de las demás imágenes en el primer hover.
- [x] `src/shop/components/catalog/ProductCardSkeleton.tsx`: esqueleto de card para la carga.
- [x] `src/shop/components/catalog/catalog-filters.ts`: `CatalogFilterValues` (incluye `sort`), `EMPTY_CATALOG_FILTERS` y `CATALOG_SORT_OPTIONS`.
- [x] `src/shop/components/catalog/FilterFields.tsx`: campos del panel (búsqueda, marca y categoría en fila, slider de rango de precio y los checkboxes de ofertas y populares), sin labels visibles salvo el precio, con placeholders y `aria-label`.
- [x] `src/shop/components/catalog/SortOptions.tsx`: lista de botones seleccionables con check para las opciones de orden.
- [x] `src/shop/components/catalog/CatalogFiltersSheet.tsx`: botón "Filtrar y ordenar" con insignia y `Sheet` lateral derecho con overlay desenfocado, secciones "Ordenar por" y "Filtros", y pie con "Limpiar todo" y "Ver resultados".
- [x] `src/components/ui/slider.tsx` (nuevo, componente genérico): slider de Base UI con soporte de rango doble. `sheet.tsx` acepta `overlayClassName` para estilizar el overlay.
- [x] `src/shop/pages/store/StorePage.tsx`: fondo blanco, cabecera con título a la izquierda y botón de filtros a la derecha, estado de filtros y orden, límites del slider calculados desde el catálogo, chips de filtros activos con "Limpiar todo", grid de cards y estados de carga, error, catálogo vacío y "No hay productos que coincidan con esos filtros".
- [x] Ruta `store` en `src/app.router.tsx` bajo `ShopLayout`.

### 4. Página de variante (`product/:slug`)

- [x] `src/shop/components/product/VariantCarousel.tsx`: carrusel con `embla-carousel-react`, flechas, indicadores y swipe.
- [x] `src/shop/components/product/SizeSelector.tsx`: botones de talla, deshabilitados si `stock` es 0, aviso si no hay tallas.
- [x] `src/shop/components/product/SiblingVariants.tsx`: chips con miniatura y nombre de las otras variantes activas del mismo producto.
- [x] `src/shop/pages/product/ProductPage.tsx`: reemplaza el placeholder con fondo blanco; carrusel, título compuesto, precio (tachado si hay descuento), descripción, selector de tallas y hermanas; estados de carga, error y "variante no encontrada".

### 5. Documentación y verificación

- [x] `docs/products-spec.md`: ruta `product/:slug`, modelos de la tienda, sección de filtros del catálogo y Etapa 5 marcada (incluye la etiqueta "Popular" de la tienda).
- [x] `copilot-instructions.md`: estado actual del módulo.
- [x] `pnpm build` y ESLint sin errores en los archivos nuevos.

## Deuda técnica conocida

- El filtrado en cliente carga el catálogo completo. Si el catálogo crece mucho, mover los filtros a la consulta (por ejemplo con `ilike` y rangos de precio en Supabase).
- Las variantes hermanas se resuelven anidadas en el producto. Para un admin autenticado, RLS también devuelve las inactivas, que el mapper descarta: se descargan de más aunque no se muestren.
