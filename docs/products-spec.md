# Especificación del módulo de productos

Fuente de verdad para productos, variantes, imágenes, tallas y stock. Si algo de aquí cambia, se actualiza este documento en el mismo cambio.

## Conceptos

- **Producto**: el modelo (por ejemplo "Nike Ja Morant 1"). Solo guarda nombre, marca, categoría y si es popular. No tiene precio, fotos ni color.
- **Variante**: la opción que realmente se vende (por ejemplo "Black Gold"). Tiene su propio nombre, slug, descripción, precio, descuento, imágenes y tallas.
- Un producto con una sola opción tiene una sola variante. No existe un caso especial: todos funcionan igual.
- El título que ve el cliente se compone con el nombre del producto y el nombre de la variante.

## Modelo de datos

El SQL vive en `docs/sql/01-products-schema.sql` y `docs/sql/02-storage-policies.sql`. Resumen:

- `products`: `id`, `name`, `brand_id`, `category_id`, `is_popular` (booleano, por defecto falso), `created_at`. Único por (`brand_id`, `name`) con el constraint `products_brand_id_name_key`. Las FK a marcas y categorías son restrictivas.
- `product_variants`: `id`, `product_id`, `name`, `slug`, `description` (opcional), `price` (numeric, no negativo), `discount_percentage` (0 a 100), `is_active`, `display_order`, `created_at`.
- Constraints: `product_variants_slug_key` (slug único global) y `product_variants_product_id_name_key` (nombre único dentro del producto).
- Un producto solo se puede eliminar si no tiene variantes: la FK `product_variants_product_id_fkey` es `restrict`. Borrar una variante sí borra sus imágenes y tallas (cascada).
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
- Políticas de `storage.objects` (ver `docs/sql/02-storage-policies.sql`): subir, actualizar, borrar y **leer** (SELECT). La de lectura es obligatoria para que el borrado funcione; sin ella el borrado en lote devuelve una lista vacía sin error y deja el archivo huérfano.
- Al borrar una imagen se borra primero el archivo del bucket y luego la fila. Si el bucket no confirma el borrado (lista vacía), la acción falla y la fila se conserva para no dejar archivos huérfanos.

## Reglas de negocio

- La variante de portada es la activa con menor `display_order`. Si no hay ninguna activa, el producto no aparece en la tienda.
- El `display_order` no se edita en el formulario: al crear una variante se asigna el mayor existente + 1 y el orden se cambia con las flechas subir y bajar del detalle. Así no se repite el mismo orden.
- No se puede activar una variante sin al menos una imagen. La primera imagen (menor `display_order`) es la principal.
- El estado activo se cambia solo desde el detalle del producto; al crear una variante nace inactiva.
- No se puede borrar la última imagen de una variante activa; primero se desactiva.
- Se avisa, sin bloquear, si una variante activa no tiene ninguna talla con stock.
- El stock lo ajusta el admin a mano. No hay descuento automático.
- La baja normal es `is_active = false`. El borrado real de una variante se permite aunque esté activa, pide confirmación (indica cuántas imágenes y tallas se pierden y avisa si es la única variante activa del producto) y elimina primero los archivos del bucket y luego las filas. Antes de borrar las filas se comprueba que la carpeta `variants/{variant_id}` quedó vacía, para que un reintento tras un fallo parcial no se bloquee.
- Un producto solo se elimina cuando no tiene variantes. Para eliminarlo, el admin elimina primero cada variante (cada una limpia su carpeta del bucket). En la interfaz el botón de eliminar del producto se deshabilita mientras `variantCount` sea mayor que 0, y la base de datos lo rechaza igualmente.
- El slug de la variante se propone a partir de "nombre del producto + nombre de la variante", es editable y sigue la regex de brands (minúsculas, números y guiones).
- Las tallas son texto ("9.5", "M"). El orden de presentación lo resuelve la interfaz con listas predefinidas (numeración para tenis, S a XL para camisetas), no la base de datos.
- Los precios se muestran en pesos dominicanos (`DOP`) con formato `es-DO`.
- La etiqueta "Popular" es un interruptor manual del producto (`is_popular`), no se calcula. Conviene usarla en pocos productos para que siga diferenciando. En la tienda estos productos encabezan el catálogo mientras no haya filtros ni orden aplicado.

## Modelos de la aplicación

- `Product`: `id`, `name`, `brandId`, `categoryId`, `isPopular`, `createdAt`.
- `ProductListItem` (lista del admin): `Product` más `brandName`, `categoryName`, `variantCount`, `activeVariantCount`, `totalStock` y `coverImageUrl`.
- `ProductVariant`: `id`, `productId`, `name`, `slug`, `description` (string o null), `price` (number), `discountPercentage`, `isActive`, `displayOrder`, `createdAt`, `images` y `sizes`.
- `ProductVariantImage`: `id`, `path`, `url` (armada en el mapper), `displayOrder`.
- `ProductVariantSize`: `id`, `size`, `stock`.
- `ProductVariantInput`: `productId`, `name`, `slug`, `description` (string), `price`, `discountPercentage`, `isActive`, `sizes` (lista de `size` y `stock`) y `displayOrder` opcional. El orden no se edita en el formulario: al crear se asigna el mayor existente + 1 y luego se ajusta con las flechas.
- Los modelos del módulo llevan el prefijo `ProductVariant` para coincidir con los nombres del código.
- Los campos numéricos del formulario usan `z.coerce.number()`, así que el tipo de entrada y el de salida del esquema difieren: usar los tres genéricos de `useForm`.
- Modelos de la tienda (dominio `src/shop/`, sin prefijo `ProductVariant` porque viven en su propio dominio):
  - `ShopCatalogItem`: `id`, `name`, `brandId`, `brandName` (para la línea de marca de la card), `categoryId`, `isPopular`, `activeVariantCount` y `variants` (solo activas, ordenadas por `displayOrder`). El action descarta los productos sin variantes activas.
  - `ShopCatalogVariant`: `id`, `slug`, `name`, `price`, `discountPercentage`, `finalPrice` (calculado en el mapper) y `coverImageUrl` (primera imagen por `displayOrder`).
  - `ShopVariant`: `id`, `slug`, `title` (producto + variante), `description`, `price`, `discountPercentage`, `finalPrice`, `isActive`, `images`, `sizes`, `productId` y `brandName`.
  - `ShopVariantSibling`: `id`, `slug`, `name` y `coverImageUrl`. Se resuelven en la misma consulta de la variante, anidadas en el producto, y se filtran por activas y distintas de la actual.
  - `ShopFilterOption`: `id`, `name`, para los selects de marca y categoría.
  - `CartItem`, `ShopCartVariant`, `ShopCartVariantRow`, `AddCartItemResult` y `CartReconcileResult`: modelos del carrito. El detalle vive en `docs/cart-spec.md`.
  - El precio final siempre se calcula en el mapper (`price * (1 - discount_percentage / 100)`), nunca en la UI.

## Errores de negocio

- `ProductError`: `duplicate_name`, `in_use`, `not_found`.
- `ProductVariantError`: `duplicate_slug`, `duplicate_name`, `image_required`, `delete_failed`, `not_found`.
- `VariantImageError`: `invalid_type`, `too_large`, `upload_failed`, `delete_failed`, `reorder_failed`, `active_variant`, `not_found`. Los errores de imágenes (tipo o tamaño inválido, fallo de subida o borrado) se tratan en la capa de subida con mensajes en español.

## Admin

Rutas bajo `/admin`:

- `/admin/products`: lista.
- `/admin/products/new`: formulario del producto. Al guardar, redirige al detalle.
- `/admin/products/:productId`: detalle del producto.
- `/admin/products/:productId/variants/new` y `/admin/products/:productId/variants/:variantId`: formulario de variante.

Pantallas:

- **Lista**: miniatura de portada, nombre, marca, categoría, cantidad de variantes y stock total. Filtros por marca, categoría y búsqueda por nombre. Aviso en los productos sin variantes activas. Insignia "Popular" junto al nombre cuando aplica. El botón de eliminar se deshabilita mientras el producto tenga variantes.
- **Detalle del producto**: datos del producto arriba. Debajo, la lista de variantes con miniatura, nombre, precio, descuento, interruptor de activa y resumen de stock. La primera lleva la insignia "Portada". Flechas de subir y bajar cambian el orden. Botón "Agregar variante". Cada variante tiene un botón de eliminar con confirmación.
- **Formulario de variante**: tres tarjetas blancas separadas. Datos de la variante (nombre, slug, descripción, precio y descuento) a la izquierda, imágenes a su derecha y tallas con stock debajo de los datos.
- Al crear, se guardan datos y tallas, y se redirige a la edición de la misma variante, donde se habilita la galería (porque la ruta del archivo lleva el id de la variante).
- El estado activo no se edita aquí: se cambia con el interruptor del detalle del producto.
- En la galería: se suben imágenes arrastrando y soltando (o con el selector de archivos), se reordenan con flechas izquierda y derecha y se borran con confirmación. La primera imagen es la principal.
- **Panel rápido de stock**: en el detalle del producto, cada variante se expande y muestra sus tallas con un campo numérico que se guarda al salir del campo. Es la operación más frecuente, debe ser de dos clics.

## Tienda

- **Header de la tienda** (`ShopHeader`): píldora flotante fija arriba (`fixed`, `top-4`) con el logo, los enlaces y las acciones. En reposo se ve sólida, negra con texto y logo blancos. Al hacer scroll se queda en la misma posición y pasa a un velo apenas perceptible del negro de marca (`rgba(0, 0, 0, 0.12)`), sin sombra y con el texto y el logo en oscuro, porque sobre fondos claros el texto blanco sería ilegible. Al hacer hover vuelve al negro sólido con texto y logo blancos. El fondo, la sombra y el color del texto transicionan suavemente en 300ms, y el logo oscuro se precarga para que el cambio no parpadee. Con el menú móvil abierto la píldora se mantiene sólida.
- **Cabecera del catálogo**: fila con el título "Tienda" alineado a la izquierda en fuente Cinzel, con una línea corta de acento roja debajo, y a la derecha el botón "Filtrar y ordenar". Sin subtítulo. El estilo del título sigue el del admin (`AdminTitle`), para que el área pública y el panel se sientan de la misma familia.
- **Catálogo**: una card por producto con esquinas redondeadas, fondo blanco, `shadow-xs` y `ring-1 ring-foreground/10`, con `hover:shadow-md`. La página va sobre `bg-gray-50`, el mismo contraste del panel de administrador (área gris clara, cards blancas sin borde duro), y el grid dentro del contenedor habitual. La página de variante sigue sobre blanco.
  - Las imágenes de producto son PNG sin fondo, así que la zona de imagen es un cuadro de proporción fija (`aspect-square`) con fondo blanco, `overflow-hidden` y padding (`p-6`), y la imagen se muestra centrada con `object-contain`: nunca se recorta ni se estira. Al pasar el cursor sobre la card hace un zoom suave (`transition-transform duration-500` y `group-hover:scale-110`) sin cambiar el tamaño en reposo. El `overflow-hidden` del cuadro evita que el zoom invada el bloque de texto. Cuando haya imágenes con fondo propio, se revisa esta decisión.
  - La zona de imagen y el bloque de texto se separan con un ornamento negro (`CardDivider`): dos trazos de 1px a los lados y un rombo pequeño en el centro. No es una línea recta lisa. El skeleton replica el mismo separador.
  - El bloque de texto es una fila con la información a la izquierda y el precio a la derecha, alineados abajo (`flex items-end justify-between`). A la izquierda, de arriba hacia abajo: marca en mayúsculas pequeña y gris, nombre del producto en negrita, nombre del color (solo en escritorio) y "N variantes" si aplica. A la derecha y alineado a la derecha, el precio final más grande (`text-xl`) y, debajo, el precio original tachado cuando hay descuento.
  - Los productos con `is_popular` se marcan de forma clara: la card lleva el anillo en dorado (`ring-gonzalez-golden/70`) y una insignia "Popular" en la esquina superior izquierda, con degradado dorado, texto oscuro en mayúsculas y una estrella rellena. La insignia no es un simple texto: debe sentirse premium y leerse sobre imágenes claras y oscuras.
  - El porcentaje de descuento se muestra en la esquina superior derecha con el mismo lenguaje visual que "Popular" (píldora oscura translúcida con desenfoque, mayúsculas pequeñas y espaciado).
  - Si el producto tiene más de una variante, una línea pequeña dice "N variantes". Con una sola variante no se muestra.
  - Escritorio: al hacer hover sube desde la parte baja de la imagen una barra flotante blanca con sombra y un anillo fino (`ring-1 ring-black/5`) con swatches circulares de las variantes, superpuesta sobre la imagen (no cambia el alto de la card). Cada swatch es un círculo con fondo `neutral-100` y la imagen centrada con `object-contain`, porque los PNG son transparentes. El swatch activo lleva un anillo oscuro. Al pasar el mouse por un swatch cambian la imagen, el precio y el nombre del color. Al sacar el mouse, vuelve a la portada. El clic en la card abre la variante mostrada; en móvil, la de portada.
  - Móvil: sin barra de variantes. Solo imagen, título, precio y "N variantes". El toque abre la variante de portada.
  - Los swatches son enlaces. La barra se oculta con `opacity-0` y `pointer-events-none` (el contenedor no debe interceptar el hover de la imagen) y se activa solo con `group-hover` y con foco, con una transición suave de opacidad y desplazamiento. Se muestran máximo 6 swatches; si hay más variantes, el resto se resume en una píldora "+N". Las imágenes de las demás variantes se precargan en el primer hover.
- **Página de variante** (`product/:slug`): fondo blanco, igual que el catálogo. Carrusel con todas las imágenes de la variante, marca en texto pequeño, título compuesto, precio con descuento, selector de talla (deshabilitada si no hay stock) y chips "Otros colores" con las otras variantes activas del mismo producto. Al pasar el cursor (o dar foco con el teclado) sobre una miniatura secundaria, esa imagen se previsualiza en el área principal con un fundido suave; al salir vuelve la seleccionada y el clic fija la selección. El botón "Agregar al carrito" valida la talla, guarda la variante y la talla en el carrito, muestra un toast con la acción "Ver carrito" y no abre el aside automáticamente. Si todas las tallas están agotadas, el botón se muestra como "Agotado" y deshabilitado. Estados de carga, error y "variante no encontrada".
- **Filtros y orden del catálogo**: el botón "Filtrar y ordenar" (con insignia del contador de filtros activos) abre un `Sheet` lateral derecho con overlay oscurecido y desenfocado, para que el foco quede en el panel y el catálogo se actualice en vivo detrás.
  - El panel tiene dos secciones: "Ordenar por" (Más recientes por defecto, Precio: menor a mayor, Precio: mayor a menor, Nombre A-Z) y "Filtros" (búsqueda por nombre, marca, categoría, rango de precio, "Solo ofertas" y "Solo populares").
  - El orden se aplica en cliente sobre los productos ya filtrados, usando el precio final de la portada para los órdenes de precio. Los productos con `is_popular` van primero solo en la vista por defecto (sin filtros ni orden aplicado): en cuanto se aplica un filtro o se cambia el orden, la lista sigue exactamente lo pedido. En la vista por defecto, el orden del servidor (`created_at` descendente) se conserva dentro de los populares y dentro del resto.
  - "Solo ofertas" usa la definición de reglas de negocio: producto con al menos una variante activa con descuento mayor que 0. "Solo populares" usa `is_popular`.
  - El rango de precio es un slider de dos pulgares (componente `Slider` de Base UI en `src/components/ui/slider.tsx`), no dos inputs. Sus límites van de 0 al mayor precio final del catálogo redondeado hacia arriba. El rango se aplica sobre el precio final de la variante de portada, que es el que muestra la card.
  - Los filtros no muestran la cantidad de productos en ninguna parte de la UI.
  - Los campos no llevan labels visibles: usan placeholders y `aria-label`. El precio sí muestra sus valores actuales junto al rótulo.
  - Los filtros y el orden activos se resumen en chips que se pueden quitar de uno en uno, más un botón "Limpiar todo" (también en el pie del panel, junto a "Ver resultados" que cierra el aside).
  - Se filtra en cliente sobre el catálogo cargado. El estado vacío distingue entre "Aún no hay productos disponibles" y "No hay productos que coincidan con esos filtros".
  - Los selects de marca y categoría se alimentan de `getShopBrandsAction` y `getShopCategoriesAction` (consultas públicas).
- **Carrito y checkout** (`docs/cart-spec.md`): carrito en el cliente con Zustand y `localStorage` (`gonzalez-cart`, versión 1). Se abre en un `Sheet` lateral derecho desde el icono del header, que lleva una insignia con el total de unidades. La identidad de línea es variante + talla. Al abrir el aside se revalidan precio y stock: se quitan las líneas de variantes inactivas, de tallas agotadas o inexistentes, y se ajustan las cantidades al stock. El checkout arma un mensaje de WhatsApp con `VITE_WHATSAPP_NUMBER`; si falta la variable, el botón se deshabilita. No hay tablas de pedidos ni descuento automático de stock.
- **Pie de página de la tienda** (`ShopFooter`): fondo negro sólido, igual que el header. Aparece en las páginas de la tienda (`/store`, `product/:slug` y las que se sumen, como "Sobre nosotros") y nunca en el inicio, donde solo vive el hero; lo controla el layout según la ruta. Lleva el logo blanco con el wordmark "gonzalez Peña", una línea corta roja de acento, los dos lemas del inicio ("Pasos pequeños. Huellas gigantes." y "Persiste e Insiste."), la navegación pública (los mismos enlaces del header, reutiliza `navItems` para que no se desincronicen) y los accesos a las redes. Cierra con una barra inferior separada por una línea tenue con el aviso de derechos y el año en curso.
  - Las redes (Instagram, WhatsApp y TikTok) se arman desde variables de entorno: `VITE_INSTAGRAM_USER`, `VITE_TIKTOK_USER` y `VITE_WHATSAPP_NUMBER`. El número de WhatsApp se limpia a solo dígitos porque `wa.me` no acepta espacios ni guiones. Si una variable no está definida, esa red no se muestra, así el pie nunca queda con enlaces rotos.
  - `lucide-react` no incluye iconos de marcas, así que los tres se dibujan como SVG en línea (`SocialIcons`), con el mismo trazo del resto de la interfaz.

## Plan por etapas

Cada etapa lleva datos, hooks y pantallas, y debe poder probarse al terminar. Implementar una etapa por vez, replicando el patrón de `brands` y `categories`.

- [x] Etapa 1, productos (el modelo): interface, mapper, schema, error, actions, hooks, lista, formulario, rutas e ítem del menú. La lista ya trae marca, categoría y variantes en una sola consulta.
- [x] Etapa 2, variantes con tallas: detalle del producto con lista de variantes y formulario de variante (datos y tallas).
- [x] Etapa 3, imágenes: galería de la variante con subida, orden y borrado, compresión en el cliente y limpieza del bucket.
- [x] Ajuste, producto popular: columna `is_popular` en `01-products-schema.sql`, interface, mapper, interruptor en la lista e insignia en la lista del admin y en la card de la tienda.
- [x] Ajuste, borrado de variantes: `deleteProductVariantAction` (archivos del bucket y luego filas) y botón con confirmación en el detalle del producto.
- [x] Ajuste, borrado de productos: FK `restrict` en `product_variants`, código de error `in_use` y botón de eliminar deshabilitado cuando el producto tiene variantes.
- [ ] Etapa 4, panel rápido de stock.
- [x] Etapa 5, tienda: catálogo en `/store` con card por producto, filtros, página de variante en `product/:slug` con carrusel y pie de página con navegación y redes tomadas del `.env`.
- [x] Etapa 6, carrito y checkout: carrito en el cliente, revalidación de precio y stock, aside derecho, insignia en el header y pedido por WhatsApp. Ver `docs/cart-spec.md`.

## Pendientes de confirmar

- Nombres exactos de carpetas y archivos de `src/admin`: seguir los que ya usa `brands`.
