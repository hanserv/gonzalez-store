# Especificación del módulo de productos

Fuente de verdad para productos, variantes, imágenes, tallas y stock. Si algo de aquí cambia, se actualiza este documento en el mismo cambio.

## Conceptos

- **Producto**: el modelo (por ejemplo "Nike Ja Morant 1"). Solo guarda nombre, marca y categoría. No tiene precio, fotos ni color.
- **Variante**: la opción que realmente se vende (por ejemplo "Black Gold"). Tiene su propio nombre, slug, descripción, precio, descuento, imágenes y tallas.
- Un producto con una sola opción tiene una sola variante. No existe un caso especial: todos funcionan igual.
- El título que ve el cliente se compone con el nombre del producto y el nombre de la variante.

## Modelo de datos

El SQL vive en `docs/sql/01-products-schema.sql` y `docs/sql/02-storage-policies.sql`. Resumen:

- `products`: `id`, `name`, `brand_id`, `category_id`, `created_at`. Único por (`brand_id`, `name`) con el constraint `products_brand_id_name_key`. Las FK a marcas y categorías son restrictivas.
- `product_variants`: `id`, `product_id`, `name`, `slug`, `description` (opcional), `price` (numeric, no negativo), `discount_percentage` (0 a 100), `is_active`, `display_order`, `created_at`.
  - Constraints: `product_variants_slug_key` (slug único global) y `product_variants_product_id_name_key` (nombre único dentro del producto).
  - Borrar un producto borra sus variantes (cascada).
- `variant_images`: `id`, `variant_id`, `path`, `display_order`, `created_at`. `path` es único (`variant_images_path_key`). Borrar la variante borra las filas (cascada), pero NO los archivos del bucket.
- `variant_sizes`: `id`, `variant_id`, `size` (texto), `stock` (no negativo), `created_at`. Único por (`variant_id`, `size`) con el constraint `variant_sizes_variant_id_size_key`.

### RLS

- `products`: lectura pública, escritura solo `authenticated`.
- `product_variants`: el anónimo solo lee las activas; el autenticado lee todas y es el único que escribe.
- `variant_images` y `variant_sizes`: el anónimo solo lee las de variantes activas; el autenticado lee todo y es el único que escribe.
- El catálogo público filtra productos con al menos una variante activa desde la consulta (unión interna con las variantes activas).

### Storage

- Bucket público `product-images` (límite de 6 MB, tipos jpeg, png y webp).
- Ruta: `variants/{variant_id}/{uuid}.{ext}`. Nombre único, nunca se sobrescribe.
- Subida con `cacheControl` de un año.
- La base de datos guarda el `path`. La URL pública se arma en el mapper con `getPublicUrl(path)`.
- Antes de subir: validar tipo y tamaño en el cliente, y comprimir y redimensionar en el navegador (WebP, lado máximo 1600 px).

## Reglas de negocio

- La variante de portada es la activa con menor `display_order`. Si no hay ninguna activa, el producto no aparece en la tienda.
- El `display_order` no se edita en el formulario: al crear una variante se asigna el mayor existente + 1 y el orden se cambia con las flechas subir y bajar del detalle. Así no se repite el mismo orden.
- No se puede activar una variante sin al menos una imagen. La primera imagen (menor `display_order`) es la principal.
- Se avisa, sin bloquear, si una variante activa no tiene ninguna talla con stock.
- El stock lo ajusta el admin a mano. No hay descuento automático.
- La baja normal es `is_active = false`. El borrado real pide confirmación, indica cuánto se pierde y elimina primero los archivos del bucket y luego las filas.
- El slug de la variante se propone a partir de "nombre del producto + nombre de la variante", es editable y sigue la regex de brands (minúsculas, números y guiones).
- Las tallas son texto ("9.5", "M"). El orden de presentación lo resuelve la interfaz con listas predefinidas (numeración para tenis, S a XL para camisetas), no la base de datos.
- Los precios se muestran en pesos dominicanos (`DOP`) con formato `es-DO`.

## Modelos de la aplicación

- `Product`: `id`, `name`, `brandId`, `categoryId`, `createdAt`.
- `ProductListItem` (lista del admin): `Product` más `brandName`, `categoryName`, `variantCount`, `activeVariantCount`, `totalStock` y `coverImageUrl`.
- `ProductVariant`: `id`, `productId`, `name`, `slug`, `description` (string o null), `price` (number), `discountPercentage`, `isActive`, `displayOrder`, `createdAt`, `images` y `sizes`.
- `ProductVariantImage`: `id`, `path`, `url` (armada en el mapper), `displayOrder`.
- `ProductVariantSize`: `id`, `size`, `stock`.
- `ProductVariantInput`: `productId`, `name`, `slug`, `description` (string), `price`, `discountPercentage`, `isActive`, `sizes` (lista de `size` y `stock`) y `displayOrder` opcional. El orden no se edita en el formulario: al crear se asigna el mayor existente + 1 y luego se ajusta con las flechas.
- Los modelos del módulo llevan el prefijo `ProductVariant` para coincidir con los nombres del código.
- Los campos numéricos del formulario usan `z.coerce.number()`, así que el tipo de entrada y el de salida del esquema difieren: usar los tres genéricos de `useForm`.

## Errores de negocio

- `ProductError`: `duplicate_name`, `not_found`.
- `ProductVariantError`: `duplicate_slug`, `duplicate_name`, `not_found`.
- Los errores de imágenes (tipo o tamaño inválido, fallo de subida) se tratan en la capa de subida con mensajes en español.

## Admin

Rutas bajo `/admin`:

- `/admin/products`: lista.
- `/admin/products/new`: formulario del producto. Al guardar, redirige al detalle.
- `/admin/products/:productId`: detalle del producto.
- `/admin/products/:productId/variants/new` y `/admin/products/:productId/variants/:variantId`: formulario de variante.
  Pantallas:

- **Lista**: miniatura de portada, nombre, marca, categoría, cantidad de variantes y stock total. Filtros por marca, categoría y búsqueda por nombre. Aviso en los productos sin variantes activas.
- **Detalle del producto**: datos del producto arriba. Debajo, la lista de variantes con miniatura, nombre, precio, descuento, interruptor de activa y resumen de stock. La primera lleva la insignia "Portada". Flechas de subir y bajar cambian el orden. Botón "Agregar variante".
- **Formulario de variante**: tres secciones. Datos (nombre, slug, descripción, precio, descuento, activa), tallas con stock (filas que se agregan una a una) y galería de imágenes.
  - Al crear, se guardan datos y tallas, y se redirige a la edición de la misma variante, donde se habilita la galería (porque la ruta del archivo lleva el id de la variante).
  - En la galería: subir varias, reordenar y borrar. La primera imagen es la principal.
- **Panel rápido de stock**: en el detalle del producto, cada variante se expande y muestra sus tallas con un campo numérico que se guarda al salir del campo. Es la operación más frecuente, debe ser de dos clics.

## Tienda

- **Catálogo**: una card por producto. Muestra la imagen, el precio y el color de la variante activa en ese momento (por defecto la de portada), y el título del producto.
  - Si el producto tiene más de una variante, una línea pequeña dice "N variantes". Con una sola variante no se muestra.
  - Escritorio: al hacer hover aparece una fila de miniaturas de las variantes, superpuesta en la parte baja de la imagen (no cambia el alto de la card). Al pasar el mouse por una miniatura cambian la imagen, el precio y el nombre del color. Al sacar el mouse, vuelve a la portada. El clic en la card abre la variante activa.
  - Móvil: sin fila de variantes. Solo imagen, título, precio y "N variantes". El toque abre la variante de portada.
  - Las miniaturas son botones. La fila se oculta con `opacity-0` Y `pointer-events-none`, y se activa solo con `group-hover` y con foco. Las imágenes de las demás variantes se precargan en el primer hover.
- **Página de variante** (`/:slug` de la variante): carrusel con todas las imágenes de la variante, título compuesto, precio con descuento, selector de talla (deshabilitada si no hay stock) y enlaces a las otras variantes del mismo producto.

## Plan por etapas

Cada etapa lleva datos, hooks y pantallas, y debe poder probarse al terminar. Implementar una etapa por vez, replicando el patrón de `brands` y `categories`.

- [x] Etapa 1, productos (el modelo): interface, mapper, schema, error, actions, hooks, lista, formulario, rutas e ítem del menú. La lista ya trae marca, categoría y variantes en una sola consulta.
- [x] Etapa 2, variantes con tallas: detalle del producto con lista de variantes y formulario de variante (datos y tallas).
- [ ] Etapa 3, imágenes: galería de la variante con subida, orden y borrado, compresión en el cliente y limpieza del bucket.
- [ ] Etapa 4, panel rápido de stock.
- [ ] Etapa 5, tienda: card del catálogo y página de variante con carrusel.
- [ ] Etapa 6, carrito y checkout (decisión pendiente: pedido por WhatsApp o tablas de pedidos).

## Pendientes de confirmar

- Nombres exactos de carpetas y archivos de `src/admin`: seguir los que ya usa `brands`.
