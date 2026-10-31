# Especificación del carrito y checkout

Fuente de verdad para el carrito de la tienda. Si algo de aquí cambia, se actualiza este documento en el mismo cambio.

## Alcance

- Etapa 6: carrito en el cliente y checkout por WhatsApp.
- No hay tablas nuevas ni cambios de esquema. El pedido no se guarda en Supabase: se envía como mensaje de WhatsApp.
- El carrito no es una pantalla nueva. Vive en un `Sheet` lateral derecho, igual que el panel de filtros del catálogo.
- El stock no se descuenta automáticamente. La disponibilidad se valida al abrir el carrito y al agregar, pero el admin sigue ajustando el stock a mano.

## Modelo del carrito

El carrito vive en el cliente. La identidad de una línea es la pareja `variantId` + `size`, así que la misma variante en dos tallas ocupa dos líneas.

- `CartItem`: `variantId`, `size` (string o null), `slug`, `title`, `brandName`, `imageUrl`, `price`, `finalPrice`, `quantity` y `stockLimit` (number o null).
- `ShopCartVariant`: variante activa que se usa para revalidar: `id`, `slug`, `title`, `brandName`, `imageUrl`, `price`, `discountPercentage`, `finalPrice` y `sizes`.
- `ShopCartVariantRow`: fila cruda de Supabase que consume el mapper.
- `AddCartItemResult`: `quantity`, `added` y `clamped`. `added` es falso cuando la línea ya estaba en el máximo; `clamped` es verdadero cuando la cantidad pedida superó el stock.
- `CartReconcileResult`: `removed`, `updated` y `clamped`. Se usa para decidir si se muestra un aviso al abrir el carrito.
- `stockLimit` es el stock de la talla elegida. Es `null` cuando la variante no maneja tallas. La UI usa este valor para deshabilitar el botón de sumar.

## Store

Archivo: `src/shop/stores/cart.store.ts`.

- Zustand con `persist` y `localStorage`.
- Clave de almacenamiento: `gonzalez-cart`, versión `1`.
- Solo se persiste `items`. El estado `isOpen` no se guarda.
- Acciones: `openCart`, `closeCart`, `setCartOpen`, `addItem`, `removeItem`, `updateQuantity`, `reconcileItems` y `clearCart`.
- Selectores: `selectCartCount` (suma de cantidades), `selectCartSubtotal` (precio final por cantidad) y `selectCartSavings` (diferencia entre precio original y final).
- `addItem` busca la línea por `variantId` + `size`; si existe, suma la cantidad y respeta el stock; si no existe, crea la línea. Nunca permite bajar de una unidad.
- `updateQuantity` solo se usa desde el carrito. La cantidad no se edita en la página de producto.
- La cantidad se limita con `stockLimit`. Si no hay talla, no hay límite de stock en la línea.
- Al recargar la página, el carrito se hidrata desde `localStorage` y luego se revalida al abrir el aside.

## Revalidación

Archivos: `src/shop/actions/cart/get-cart-variants.action.ts`, `src/shop/mappers/cart.mapper.ts` y `src/shop/hooks/cart/useCartValidation.tsx`.

- Al abrir el carrito, `useCartValidation` consulta las variantes por id y solo trae las activas.
- La consulta pide producto, marca, imágenes y tallas en una sola llamada.
- El mapper arma el título con producto + variante, la URL pública de la portada con `buildVariantImageUrl` y el precio final con `price * (1 - discount_percentage / 100)`.
- Reglas de reconciliación:
  - Si la variante ya no existe o está inactiva, se quita la línea.
  - Si la variante maneja tallas y la talla guardada ya no existe o quedó en stock 0, se quita la línea.
  - Si la cantidad supera el stock actual, se ajusta al stock disponible.
  - Si cambió el precio, el título, la marca o la imagen, la línea se actualiza.
  - Si la variante no maneja tallas, se conserva la cantidad.
- La revalidación no se ejecuta con el carrito cerrado.
- Cuando hay cambios se muestra un `toast.info` con el resumen: artículos retirados, cantidades ajustadas o datos actualizados. Si no hay cambios, no se avisa nada.
- Si la consulta falla, el carrito sigue usable y el pie muestra un aviso de que no se pudo verificar la disponibilidad. El checkout por WhatsApp no se bloquea por ese error.

## Interfaz

### Aside del carrito

Archivo: `src/shop/components/cart/CartSheet.tsx`.

- `Sheet` lateral derecho montado en `ShopLayout`, para que esté disponible en todas las páginas de la tienda.
- Ancho completo en móvil y `28rem` en escritorio. Usa `w-full!` y `sm:max-w-md!` para ganarle al ancho base del `Sheet`.
- Overlay oscurecido con desenfoque, igual que el panel de filtros.
- Cabecera: "Tu carrito" y el conteo de artículos.
- Cuerpo con scroll propio. Cada línea muestra imagen sobre fondo neutro, título enlazado a la variante, marca, talla, precio final, precio original tachado si hay descuento, control de cantidad y botón de quitar.
- Estado vacío: icono, "Tu carrito está vacío" y botón "Ir a la tienda".
- Pie: subtotal, ahorro cuando hay descuento y botón "Finalizar por WhatsApp".
- Mientras se revalida, el botón de checkout se deshabilita y muestra "Actualizando...".
- Cerrar con Escape, con el overlay o con la X. El botón de carrito del header abre el aside.

### Header

- El icono de carrito del `ShopHeader` abre el aside.
- Cuando hay artículos muestra una insignia roja con el total de unidades. A partir de 100 se muestra "99+".
- El `aria-label` incluye el conteo cuando hay artículos.

### Página de producto

- El botón "Agregar al carrito" valida que haya talla seleccionada cuando la variante maneja tallas.
- Si la variante tiene tallas y todas están en stock 0, el botón se muestra como "Agotado" y deshabilitado.
- Al agregar, se guarda la variante, la talla, el precio y la portada en el store.
- Se muestra un toast de éxito con la acción "Ver carrito". El aside no se abre automáticamente.
- Si la cantidad se ajustó al stock, el toast lo indica.
- Si la línea ya estaba en el máximo, se muestra un aviso y no se agrega nada.

## Checkout por WhatsApp

Archivo: `src/shop/lib/cart.ts`.

- `buildWhatsAppCartUrl(items)` arma una URL `https://wa.me/{numero}?text=...`.
- El número sale de `VITE_WHATSAPP_NUMBER` y se limpia a solo dígitos, porque `wa.me` no acepta espacios, guiones ni el signo más.
- Si la variable no está definida o el carrito está vacío, la función devuelve `null`. En ese caso el botón se deshabilita y se muestra "Falta configurar el número de WhatsApp de la tienda".
- El mensaje incluye un saludo, cada línea con título, talla, cantidad, precio unitario y enlace a la variante, y el subtotal.
- El enlace se abre en una pestaña nueva. El carrito no se vacía automáticamente: el usuario decide cuándo limpiarlo.
- Los precios se muestran en pesos dominicanos con formato `es-DO`.

## Archivos

- `src/shop/interfaces/cart.interface.ts`: modelos y resultados.
- `src/shop/stores/cart.store.ts`: estado, persistencia y selectores.
- `src/shop/lib/cart.ts`: identidad de línea, mensaje de actualización y URL de WhatsApp.
- `src/shop/mappers/cart.mapper.ts`: fila de Supabase a `ShopCartVariant`.
- `src/shop/actions/cart/get-cart-variants.action.ts`: consulta de revalidación.
- `src/shop/hooks/cart/useCartValidation.tsx`: React Query para la revalidación.
- `src/shop/components/cart/CartSheet.tsx`: aside, revalidación y pie de checkout.
- `src/shop/components/cart/CartLineItem.tsx`: línea del carrito.
- `src/shop/components/cart/QuantityStepper.tsx`: control de cantidad.
- `src/shop/components/cart/CartEmptyState.tsx`: estado vacío.
- `src/shop/components/ShopHeader.tsx`: botón e insignia del carrito.
- `src/shop/layouts/ShopLayout.tsx`: monta el aside.
- `src/shop/pages/product/ProductPage.tsx`: agregar al carrito y estado agotado.

## Plan por etapas

- [x] Etapa 6, carrito y checkout: store persistido, revalidación de precio y stock, aside derecho, insignia en el header, integración con la página de producto y checkout por WhatsApp.

## Deuda técnica

- El stock no se reserva. Dos clientes pueden agregar la última unidad al mismo tiempo; el admin confirma la disponibilidad al recibir el pedido.
- No hay tablas de pedidos ni historial. Si se quiere un pedido formal, se decide entre tablas propias o seguir con WhatsApp.
- El carrito no se sincroniza entre pestañas abiertas. Zustand persiste en `localStorage`, pero no escucha el evento `storage`.
- La revalidación es del lado del cliente. Un pedido armado hace horas puede llegar con precios o stock desactualizados; el mensaje de WhatsApp no es una cotización formal.
- No hay cupones, impuestos, envío ni cálculo de totales más allá del subtotal.
- No hay analítica de carrito abandonado.
