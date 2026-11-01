# Especificación del dashboard

Fuente de verdad para las estadísticas del dashboard del admin. Si algo de aquí cambia, se actualiza este documento en el mismo cambio.

## Principios

- Solo datos reales. La única excepción temporal es "Productos más vistos" (ver Deuda técnica).
- No hay estadísticas de ventas. Los pedidos van por WhatsApp y no hay forma de saber si el admin concretó la venta, así que cualquier cifra sería inventada. El mapa de ventas por provincia no contradice esta regla: usa totales cargados manualmente, no pedidos. Ver `docs/province-sales-map.spec.md`.
- Las cifras se calculan en la base de datos. Nunca se traen listas al navegador para contarlas.
- Las dos consultas del dashboard son independientes: cada una tiene su propia carga y su propio error.

## Widgets

- **Total de productos**: cantidad de productos (modelos), sin importar si tienen variantes.
- **Productos en oferta**: cantidad de productos con al menos una variante activa con `discount_percentage` mayor a 0.
- **Variantes agotadas** (subtítulo "Requieren reposición"): variantes activas sin stock en ninguna talla. Una variante activa sin ninguna talla registrada también cuenta como agotada.
- **Total de categorías**: cantidad de categorías.
- **Variantes activas vs. inactivas**: cantidad de cada una y el porcentaje de activas. Con cero variantes, el porcentaje es 0.
- **Últimas variantes agregadas**: las 5 variantes más recientes. Cada fila muestra el título compuesto ("nombre del producto + nombre de la variante"), la categoría, la fecha de creación, el precio final con descuento y el estado (activa o inactiva).
- **Productos más vistos**: mock temporal, ver Deuda técnica.
  Los textos de las tarjetas dicen "Variantes", no "Productos", cuando el dato es de variantes (agotadas, activas e inactivas). El estado activo y el stock viven en las variantes, y el texto viejo se leería como si contara productos.

## Definiciones

- **Activa**: `product_variants.is_active = true`.
- **Agotada**: variante activa sin ninguna fila de `variant_sizes` con `stock > 0`.
- **En oferta**: el producto tiene al menos una variante activa con descuento mayor a 0.
- **Precio final**: `price * (1 - discount_percentage / 100)`, calculado en el mapper.
- Los precios se muestran en pesos dominicanos (`DOP`) con formato `es-DO`. Las fechas se muestran cortas, por ejemplo "10 oct".

## Datos

### Estadísticas: función `get_dashboard_stats()`

SQL en `docs/sql/03-dashboard-stats.sql`. Devuelve una sola fila tipada:

- `total_products`, `products_on_sale`, `sold_out_variants`, `total_categories`, `active_variants`, `inactive_variants` (todas `bigint`).
- `security invoker`, con `execute` revocado a `public` y `anon` y concedido solo a `authenticated`. Si se concediera a `anon`, el stock y las cifras del catálogo serían legibles con la clave pública.
- La action llama a `supabase.rpc('get_dashboard_stats')` y toma la única fila. Al ser una función `returns table`, el tipo generado es un objeto tipado, no `Json`: no se castea nada.

### Últimas variantes

Consulta a `product_variants` con el producto y su categoría anidados, ordenada por `created_at` descendente con `limit 5`. No necesita SQL nuevo.

## Modelos de la aplicación

- `DashboardStats`: `totalProducts`, `productsOnSale`, `soldOutVariants`, `totalCategories`, `activeVariants`, `inactiveVariants`.
- `DashboardLatestVariant`: `id`, `title`, `categoryName`, `createdAt`, `finalPrice` (number), `isActive`.
- El porcentaje de activas se deriva en la interfaz o en el mapper, no se guarda.

## Caché y estados

- `queryKey`: `['dashboard', 'stats']` y `['dashboard', 'latest-variants']`.
- Las mutaciones de productos, variantes, tallas y categorías invalidan `['dashboard']`. Importa sobre todo el panel rápido de stock, que cambia el contador de agotadas con frecuencia.
- Cada widget tiene estado de carga (esqueleto), de error (con reintento) y vacío. Un catálogo sin productos debe verse bien: ceros en las tarjetas y un mensaje en la lista de recientes.

## Plan por etapas

Implementar una etapa por vez.

- [x] Etapa D1, esta especificación.
- [x] Etapa D2, SQL: Comprobar que `anon` es rechazado y regenerar los tipos (los tipos estan en `../src/supabase/database.types.ts`).
- [x] Etapa D3, capa de datos: interface, mapper, actions (`getDashboardStatsAction`, `getDashboardLatestVariantsAction`) y hooks.
- [x] Etapa D4, interfaz: tarjetas y lista de recientes, con estados de carga, error y vacío.
- [x] Etapa D5, eliminar los mocks y los datos de ejemplo (menos el de "Productos más vistos") y comprobar con `git grep` que no queda ningún import de ellos.
- [x] Etapa D6, registro de interés (visitas y clics a WhatsApp), ver Deuda técnica. // Temporalmente sigue mock de "Productos más vistos"

## Deuda técnica

- **Productos más vistos usa datos de ejemplo.** El mock vive en un único archivo, con un `TODO` que apunta a este documento, y el widget muestra una etiqueta visible "Datos de ejemplo", para que nadie confunda esas cifras con datos reales.
- **Registro de interés pendiente.** Para tener visitas por producto y clics al botón de WhatsApp (una señal de interés, no de venta) hace falta una tabla de eventos agregados por día, y una función que los registre de forma anónima. Decisiones abiertas: qué cuenta como vista, cómo evitar que los bots la inflen y qué se guarda por privacidad. Al implementarlo, el widget de más vistos pasa a datos reales y se elimina el mock.
- **RLS y stock exacto.** Hoy el anónimo puede leer el stock exacto de las variantes activas desde la API. La tienda solo necesita saber si hay o no. Evaluar ocultarlo.
