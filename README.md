# Gonzalez Peña

Tienda de tenis y ropa con catálogo público, carrito y pedido por WhatsApp, más un panel de administración para gestionar productos, variantes, imágenes y stock.

**Sitio en vivo: [gonzalez-pena.vercel.app](https://gonzalez-pena.vercel.app/)**

## El proyecto

La aplicación tiene tres zonas:

- **Tienda**: inicio con hero, colección editorial, mapa de ventas por provincia y página "Sobre nosotros". El catálogo vive en `/store` con búsqueda, filtros por marca, categoría, precio, ofertas y populares, además de orden por precio o nombre. Cada producto abre su página en `product/:slug` con carrusel de imágenes, selector de talla y las demás variantes del producto.
- **Carrito**: se guarda en el navegador, se abre en un panel lateral desde el header y revalida precio y stock al abrirse. El checkout arma el pedido y lo envía por WhatsApp. No hay pasarela de pago ni descuento automático de stock.
- **Administración**: dashboard con métricas reales y CRUD de marcas, categorías, productos, variantes, tallas e imágenes. El stock se ajusta a mano y el estado activo de una variante se controla desde el detalle del producto.

## Stack

- React 19, TypeScript y Vite.
- React Router.
- TanStack React Query para datos remotos y caché.
- Supabase para autenticación, base de datos y Storage.
- React Hook Form y Zod para formularios.
- Zustand para el carrito y la sesión.
- Tailwind CSS v4 y shadcn/ui sobre Base UI.
- Leaflet para el mapa de ventas por provincia.
- Sonner para notificaciones.
