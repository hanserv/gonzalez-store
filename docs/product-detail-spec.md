# Spec: Detalle de producto --- Modern Soft-Card Layout (referencia final)

## 1. Objetivo

Rediseñar la página de detalle de producto de la tienda para replicar la
composición visual de la última referencia proporcionada por el usuario:
una galería amplia a la izquierda y una tarjeta de compra blanca,
elevada y redondeada a la derecha.

La referencia define la dirección visual y la distribución, pero **no**
los datos del catálogo. Los datos, precios, imágenes, valoraciones,
variantes, stock, textos comerciales y comportamientos deben provenir de
la aplicación existente.

El resultado debe sentirse moderno, ligero, premium, minimalista y fácil
de utilizar. No entregar únicamente un mockup: implementar la interfaz
funcional dentro del proyecto actual.

### Cambios explícitos que deben conservarse

- No mostrar «Devoluciones fáciles» ni mensajes equivalentes sobre
  devoluciones.
- No crear pestañas inferiores «Descripción» y «Detalles del
  producto».
- La descripción breve puede aparecer debajo de las características de
  la galería y el enlace «Leer más» solo debe mostrarse si existe
  contenido adicional real y una acción de expansión/navegación
  válida.
- No inventar funcionalidades para imitar la imagen. Los controles de
  búsqueda, favoritos, carrito, vista 360°, valoración y «Leer más»
  solo se muestran si están conectados a funciones reales o a rutas ya
  existentes.

## 2. Stack y restricciones del proyecto

- Framework: React.
- Estilos: Tailwind CSS.
- Componentes UI: shadcn/ui.
- Respetar las versiones, rutas, estructura, lenguaje y convenciones
  existentes.
- Si el proyecto utiliza TypeScript, mantener TypeScript; si utiliza
  JavaScript, mantener JavaScript.
- Inspeccionar primero la configuración y los componentes existentes.
- Reutilizar servicios, hooks, componentes, tokens, iconos y lógica de
  negocio actuales.
- No instalar dependencias innecesarias.
- No modificar páginas ajenas al detalle del producto ni reemplazar la
  navegación global.
- No inventar datos comerciales ni alterar el funcionamiento del
  carrito.
- La referencia visual no autoriza a cambiar la arquitectura ni el
  modelo de datos.

## 3. Dirección visual exacta

### 3.1 Estética general

- Fondo general blanco roto o gris casi blanco, con una variación
  tonal muy sutil.
- Superficies limpias, sin contornos pesados ni divisores
  innecesarios.
- Tarjeta de compra blanca, claramente separada del fondo mediante una
  sombra difusa de baja intensidad y esquinas muy redondeadas.
- Galería sobre un fondo gris perla con un degradado o iluminación muy
  suave; evitar decoraciones que compitan con el producto.
- Tipografía sans serif coherente con la tienda. Usar la fuente ya
  configurada en el proyecto.
- Texto principal en negro o gris carbón; texto secundario en gris
  medio.
- Botones de selección no activos con fondo gris muy claro; selección
  activa en carbón/negro con texto blanco.
- Iconografía lineal, sencilla y consistente. Reutilizar la biblioteca
  de iconos instalada.
- Evitar efectos llamativos, gradientes saturados, glassmorphism
  intenso, animaciones excesivas y bordes oscuros.
- El producto debe ser el foco visual. La interfaz no debe parecer un
  dashboard ni una ficha genérica de administración.

### 3.2 Referencia de color

Usar los tokens existentes siempre que estén disponibles. Si el proyecto
no tiene tokens adecuados, aproximarse a esta paleta:

- Fondo de página: `#F7F8FA` o equivalente.
- Superficie principal: `#FFFFFF`.
- Fondo de galería y chips: `#F1F3F5` / `#F5F6F7`.
- Texto principal: `#111418`.
- Texto secundario: `#6B7280`.
- Bordes suaves: `#E5E7EB`.
- Botón principal y selección activa: `#111418`.
- Texto del botón principal: `#FFFFFF`.

Estos valores son referencias visuales, no una razón para duplicar
tokens si el proyecto ya dispone de un sistema de diseño equivalente.
Mantener contraste accesible.

## 4. Composición de escritorio

La página se organiza en dos columnas principales, pero **no deben
comenzar a la misma altura**. La galería izquierda comienza más arriba;
la tarjeta blanca de compra de la derecha lleva un desplazamiento vertical
visible hacia abajo, tal como aparece en la referencia final:

1.  **Columna izquierda, aproximadamente 55--57 %:** galería,
    características y descripción.
2.  **Columna derecha, aproximadamente 43--45 %:** barra de acciones
    superior y tarjeta de compra.

Usa la captura como referencia geométrica, no solo como inspiración. En
una vista de escritorio comparable a la referencia (aprox. 1095 × 712 px
de área visible), las posiciones relativas son parte del diseño:

- El contenido empieza con un margen izquierdo cercano a 40 px y termina
  con un margen derecho cercano a 24 px.
- La columna visual izquierda ocupa aproximadamente el 57 % del ancho
  útil; la columna derecha, aproximadamente el 42 %; entre ambas hay una
  separación compacta de unos 20–24 px.
- La galería izquierda comienza cerca de 37 px desde el borde superior
  del contenido.
- La tira vertical de miniaturas mide aproximadamente 70 px de ancho. La
  imagen principal empieza unos 18–20 px a su derecha, ocupa el espacio
  restante y tiene una proporción cercana a 1.08:1 (ancho:alto) en esta
  referencia.
- La tarjeta blanca de compra empieza aproximadamente 50 px por debajo
  del borde superior de la imagen principal. En la captura, la galería
  empieza cerca de y=37 px y la tarjeta cerca de y=88 px. Conserva este
  desfase visual, escalándolo con moderación si cambia el tamaño de
  pantalla; no alinees ambos bordes superiores.
- La fila de iconos superior de la columna derecha permanece por encima
  de la tarjeta: la flecha de regreso queda a la izquierda y búsqueda,
  favoritos y carrito a la derecha. No desplazar estos iconos junto con
  la tarjeta.
- Las características comienzan inmediatamente debajo de la galería,
  con unos 16–20 px de separación; la descripción aparece debajo de las
  características.

Estos valores describen la proporción de la referencia, no dimensiones
rígidas para todos los dispositivos. Mantén la relación visual al adaptar
el ancho, pero no permitas que la tarjeta se superponga con la galería.
La separación horizontal debe ser compacta como en la captura, no un
espacio exagerado entre columnas. Usa el contenedor de la aplicación solo
si permite conservar estas relaciones.

### 4.1 Barra superior

- La barra superior debe sentirse ligera y no competir con el
  producto.
- En la zona superior derecha de la página, mostrar los iconos de
  búsqueda, favoritos y carrito, siguiendo la referencia.
- En la zona superior de la columna de compra, mostrar el control de
  volver mediante flecha si existe una acción de navegación de regreso
  válida.
- Mantener la navegación global existente. No duplicar una cabecera
  completa dentro del componente si la aplicación ya tiene una.
- Los iconos deben tener área táctil adecuada, estados hover/focus y
  etiquetas accesibles.
- El indicador numérico del carrito solo debe mostrarse si existe un
  conteo real de artículos y el diseño actual admite ese indicador.
- No crear enlaces muertos ni controles decorativos que aparenten
  funcionar.

### 4.2 Columna izquierda: galería y contenido editorial

La galería debe ser el elemento visual dominante del lado izquierdo.

#### Distribución de miniaturas e imagen principal

- Colocar una columna vertical de miniaturas a la izquierda de la
  imagen principal.
- La columna de miniaturas debe tener un ancho aproximado de 64--76 px
  en un escritorio comparable al de la referencia.
- Dejar una separación aproximada de 14--20 px entre las miniaturas y
  la imagen principal.
- Las miniaturas deben ser cuadradas o casi cuadradas, con esquinas
  redondeadas y fondo gris muy claro.
- Mantener una separación vertical aproximada de 10--14 px entre
  miniaturas.
- La miniatura activa debe distinguirse claramente con un borde oscuro
  fino o un contorno de foco visible, sin una sombra exagerada.
- La imagen principal debe ocupar todo el espacio restante de la
  columna, con una proporción visual cercana a 1:1 o ligeramente
  rectangular según las imágenes reales.
- La superficie de la imagen principal debe tener esquinas redondeadas
  amplias (aproximadamente 18--24 px en escritorio).
- Centrar el producto con `object-fit: contain`. No recortarlo,
  deformarlo ni modificar artificialmente su color.
- Mantener un área de fondo despejada alrededor del producto, como en
  la referencia.
- Reservar el espacio de la imagen para evitar saltos de layout
  durante la carga.
- Si solo existe una imagen, no generar miniaturas falsas. Si hay
  pocas imágenes, mostrar únicamente las disponibles.
- En pantallas pequeñas, la columna de miniaturas puede convertirse en
  una fila horizontal debajo o junto a la imagen según el espacio
  disponible; debe seguir siendo fácil cambiar de imagen.

#### Indicador de vista 360°

- La referencia incluye un pequeño icono circular «360°» cerca de la
  esquina inferior derecha de la imagen principal.
- Mostrarlo únicamente si el proyecto tiene una vista 360° real o una
  acción asociada implementada.
- Si no existe esa funcionalidad, omitir el indicador por completo; no
  simular una interacción inexistente.
- Si existe, el control debe ser discreto, legible y accesible.

#### Interacción de galería

- Al activar una miniatura, actualizar la imagen principal sin
  recargar la página.
- El estado activo debe sincronizarse con la imagen mostrada.
- Admitir teclado y mostrar foco visible.
- Utilizar el componente de imagen optimizada del proyecto si existe.
- Gestionar estados de carga y error sin romper la distribución.
- Si se selecciona una variante con imágenes propias, actualizar la
  galería solo cuando esos datos existan.
- No mostrar imágenes de otra variante o de otro producto.

### 4.3 Características debajo de la galería

Inmediatamente debajo del área de imagen, colocar una fila de tres chips
o tarjetas de características, alineados horizontalmente en escritorio.
Deben parecer superficies suaves y ligeras, no botones de acción.

Las tres características de la referencia son:

1.  **Ligereza** --- texto secundario: «para mayor velocidad».
2.  **Comodidad** --- texto secundario: «todo el día».
3.  **Tracción superior** --- texto secundario: «en cada jugada».

Reglas de contenido:

- Utilizar estas etiquetas solo si los datos del producto o el
  contenido comercial autorizado respaldan las afirmaciones.
- Si la tienda tiene características reales diferentes, mostrar esas
  características en lugar de inventar las de la imagen.
- Si no hay características verificadas, omitir la fila o mostrar solo
  las disponibles; no rellenar espacios con contenido ficticio.
- Cada chip lleva un icono lineal pequeño a la izquierda, un título
  corto y una línea secundaria.
- Los iconos sugeridos por la referencia son: rayo para ligereza, nube
  para comodidad y escudo para tracción. Reutilizar iconos
  equivalentes de la biblioteca ya instalada.
- Fondo blanco translúcido o gris muy tenue; bordes discretos o
  ninguno.
- Esquinas redondeadas aproximadas de 14--18 px.
- Altura compacta, padding horizontal moderado y alineación vertical
  consistente.
- Los textos deben adaptarse sin desbordamiento. No reducir la fuente
  hasta volverla ilegible.

### 4.4 Descripción y enlace «Leer más»

Debajo de las características, mostrar la descripción corta del producto
en un bloque editorial alineado a la izquierda.

- Usar texto gris medio, tamaño aproximado de 14--15 px en escritorio
  y altura de línea cómoda.
- Limitar la anchura del texto para facilitar la lectura.
- La referencia muestra un párrafo de aproximadamente tres líneas;
  adaptar el número de líneas al contenido real y al ancho disponible.
- No inventar la descripción. Utilizar el campo correspondiente del
  producto.
- Mostrar «Leer más» con una flecha pequeña solo si existe contenido
  adicional real y el control expande el texto o lleva a un destino
  válido.
- Si el texto ya está completo o no hay más contenido, no mostrar un
  enlace inoperante.
- No convertir esta sección en pestañas.
- No crear paneles inferiores llamados «Descripción», «Detalles»,
  «Información» u otros nombres para reproducir tabs que fueron
  expresamente excluidos.

## 5. Columna derecha: tarjeta de compra

### 5.1 Superficie y geometría

- La información de compra se presenta dentro de una tarjeta blanca
  independiente.
- Esquinas redondeadas amplias, aproximadamente 24--28 px en
  escritorio.
- Padding interior de aproximadamente 28--32 px, ajustado al ancho
  disponible.
- Sombra suave y difusa para elevar la tarjeta sutilmente sobre el
  fondo; no usar una sombra negra dura.
- Mantener alineación a la izquierda y espaciado vertical consistente.
- La tarjeta debe conservar una anchura legible y no desbordarse en
  tablet o móvil.
- Evitar divisores entre todos los campos; usar el espacio en blanco
  para separar las secciones.
- En escritorio, el borde superior de la tarjeta debe quedar unos
  **50 px por debajo** del borde superior de la imagen principal, como
  en la captura de referencia (aprox. y=37 px frente a y=88 px).
- La fila superior de acciones se sitúa por encima de la tarjeta y no
  se desplaza con ella: flecha de regreso a la izquierda; búsqueda,
  favoritos y carrito a la derecha.
- La tarjeta ocupa aproximadamente el ancho de la columna derecha
  (unos 430 px en una captura de 1095 px de ancho), con padding interno
  cercano a 30 px y esquinas redondeadas de unos 24–28 px.
- Este desfase y esta jerarquía son parte del diseño, no ajustes
  opcionales. No forzar la alineación superior de ambas columnas ni
  alturas iguales.

### 5.2 Marca y nombre del producto

Orden:

1.  Marca.
2.  Nombre del producto.
3.  Valoración, si existe.
4.  Precio y descuento.
5.  Descripción breve, si existe.
6.  Selección de color.
7.  Selección de talla u otras variantes.
8.  Botón de agregar al carrito.
9.  Franja de confianza.

Detalles visuales:

- Marca en mayúsculas o con el formato real de catálogo, en gris medio
  y tamaño aproximado de 12--13 px.
- Separación breve entre marca y nombre.
- Nombre del producto en negrita, negro, aproximadamente 23--27 px en
  escritorio, con altura de línea compacta.
- Permitir que el título ocupe varias líneas si es largo; nunca
  cortarlo de forma que impida identificar el producto.
- Mantener jerarquía clara sin aumentar el título hasta desplazar
  demasiado los controles de compra.

### 5.3 Valoración

- En la referencia, la valoración aparece inmediatamente debajo del
  título con estrellas oscuras y el conteo entre paréntesis.
- Mostrar estrellas y cantidad de reseñas solo si existen datos
  reales.
- No inventar puntuaciones ni número de opiniones.
- Si el proyecto dispone de valoración pero no de reseñas, mostrar
  únicamente la información disponible.
- Si no hay valoraciones, omitir el bloque y ajustar el espaciado para
  que no quede un hueco vacío.
- Usar un tamaño discreto para las estrellas y el texto secundario.

### 5.4 Precio, precio anterior y descuento

- Mostrar el precio actual en negrita y con mayor peso visual.
- A su derecha, colocar el precio anterior tachado si existe un precio
  anterior válido.
- Después, mostrar una insignia compacta oscura con el descuento real
  si corresponde.
- En la referencia, la insignia es negra, ovalada y usa texto blanco.
- Mantener los elementos alineados verticalmente y permitir que pasen
  a una segunda línea en pantallas estrechas.
- Respetar la moneda y el formato local configurado en la tienda; usar
  `RD$` únicamente si ese es el formato de datos real.
- No calcular ni inventar un descuento si el backend proporciona el
  valor oficial.
- Si no hay descuento o precio anterior, no reservar espacio vacío
  para esos elementos.
- El precio debe proceder del producto o de la variante seleccionada,
  según la lógica actual del catálogo.

### 5.5 Descripción breve dentro de la tarjeta

La referencia presenta una línea corta debajo del precio.

- Mostrarla solo si existe un subtítulo o descripción corta real que
  corresponda a ese campo.
- Usar texto secundario y tamaño aproximado de 13--14 px.
- No duplicar innecesariamente el párrafo editorial que aparece debajo
  de las características de la galería.
- Si no hay un campo apropiado, omitir este bloque en lugar de
  inventar una frase promocional.

## 6. Selectores de variantes

Los selectores deben ser compactos, claros y fáciles de utilizar.
Adaptarlos al modelo real del catálogo: no asumir que todos los
productos tienen talla, color u otras variantes.

### 6.1 Color

- Mostrar primero la etiqueta del color actual, por ejemplo «Color:
  Rose Shadow», usando el nombre real de la variante.
- Debajo, mostrar las opciones como miniaturas cuadradas pequeñas, con
  fondo gris muy claro y esquinas redondeadas.
- En la referencia se muestran dos miniaturas de producto sin botones
  textuales largos. Seguir ese patrón cuando existan imágenes
  representativas de las variantes.
- Usar una miniatura por variante disponible; no inventar opciones ni
  reutilizar imágenes incorrectas.
- La opción activa debe tener un borde oscuro fino o contorno
  claramente visible.
- Mantener una separación de aproximadamente 8--12 px entre
  miniaturas.
- Añadir un nombre accesible para cada opción, aunque visualmente solo
  se vea la imagen.
- Si no hay imagen de variante, utilizar una muestra de color o el
  nombre textual disponible, según los datos reales.
- Al cambiar de color, actualizar el identificador de variante y,
  cuando los datos lo permitan, las imágenes, las tallas disponibles,
  el stock y el precio.
- No mostrar variantes agotadas como disponibles. Si el diseño permite
  verlas, marcarlas de manera inequívoca como no disponibles.

### 6.2 Talla

- Mostrar la etiqueta «Talla» o la etiqueta apropiada para el tipo de
  producto.
- Debajo, presentar las tallas en una fila de botones ovalados
  compactos, distribuidos uniformemente.
- Cada botón debe tener un área táctil cómoda y un ancho suficiente
  para leer el valor.
- Las opciones no seleccionadas tienen fondo gris claro y texto
  oscuro.
- La opción seleccionada tiene fondo carbón/negro y texto blanco, como
  en la referencia.
- Usar un borde discreto; evitar sombras fuertes.
- La fila puede envolver a una segunda línea si el ancho no alcanza.
  Nunca provocar scroll horizontal de toda la página.
- Las tallas agotadas deben estar deshabilitadas y comunicarse
  visualmente y mediante accesibilidad.
- No seleccionar automáticamente una talla si ello puede llevar a
  comprar una variante incorrecta.
- Si se requiere una talla, validar antes de agregar al carrito y
  mostrar un mensaje comprensible.
- La selección debe ser un estado real de la aplicación y no
  únicamente un cambio visual.

### 6.3 Otras variantes

- Si el producto tiene variantes adicionales, presentarlas con la
  misma jerarquía visual y con controles coherentes con el sistema de
  diseño.
- No añadir selectores que no correspondan al modelo de datos.
- Cambiar una opción debe actualizar el estado de la variante
  seleccionada y validar su disponibilidad.

## 7. Botón principal de compra

### 7.1 Apariencia

- Colocar un único botón principal de ancho completo debajo de los
  selectores.
- Fondo negro o carbón, texto blanco y esquinas muy redondeadas, con
  apariencia de píldora.
- Altura visual aproximada de 52--56 px en escritorio.
- Icono de carrito lineal a la izquierda del texto.
- Texto centrado: «Agregar al carrito» o la etiqueta real que utilice
  la tienda.
- Tipografía de peso medio/seminegrita.
- Sin borde visible en estado normal.
- Transiciones sutiles para hover, active, focus, disabled y loading,
  respetando `prefers-reduced-motion`.
- Mantener contraste suficiente y un indicador de foco accesible.

### 7.2 Comportamiento

- Conectar al flujo real del carrito existente.
- Enviar el identificador correcto de producto y variante
  seleccionada.
- Validar las opciones obligatorias, stock y disponibilidad antes de
  agregar.
- Mostrar el estado de carga mientras se procesa la operación.
- Evitar dobles envíos durante el procesamiento.
- Mostrar notificación de éxito solo cuando el backend o la lógica
  real confirme la operación.
- Mostrar errores de forma comprensible y recuperar el estado del
  botón cuando corresponda.
- No crear un segundo sistema de carrito ni cambiar la lógica de
  negocio para adaptarla al diseño.
- Implementación actual: el botón valida la talla, guarda la variante y
  la talla en el carrito del cliente (`useCartStore`), muestra un toast
  con la acción «Ver carrito» y no abre el aside automáticamente. Si la
  variante tiene tallas y todas están en stock 0, se muestra como
  «Agotado» y deshabilitado. El detalle del carrito vive en
  `docs/cart-spec.md`.

## 8. Franja de confianza

Debajo del botón principal, mostrar una sola franja de confianza con dos
elementos, tal como en la referencia:

1.  **Envío disponible** --- subtítulo de plazo, por ejemplo «2--6
    días».
2.  **Compras seguras** --- subtítulo, por ejemplo «100% protegido».

Los textos de ejemplo de la referencia no deben copiarse como hechos si
no están respaldados por la tienda.

Reglas:

- Mostrar solo afirmaciones comerciales verificadas y aplicables al
  producto o a la zona del comprador.
- Si se conoce un plazo de entrega real, mostrarlo con el formato
  definido por la tienda. Si no se conoce, no inventar «2--6 días».
- Mostrar «Compras seguras» únicamente si refleja una garantía o
  característica real del proceso de compra.
- No mostrar «Envío gratis» si solo se ofrece envío disponible; no son
  afirmaciones equivalentes.
- No mostrar «Devoluciones fáciles», políticas de devolución ni
  mensajes equivalentes.
- Fondo gris muy claro, esquinas redondeadas aproximadas de 16--20 px
  y padding cómodo.
- Dos columnas de anchura similar, con icono lineal a la izquierda y
  texto a la derecha.
- Títulos de 12--13 px, seminegrita; subtítulos de 11--12 px en gris.
- Mantener buena legibilidad. Si el espacio es limitado, permitir que
  los elementos se apilen o ajusten sin desbordamiento.
- La franja es informativa, no un botón, salvo que el proyecto tenga
  una acción real asociada.

## 9. Favoritos, búsqueda y carrito del encabezado

- Reutilizar los controles existentes del sitio.
- Si se muestra el corazón de favoritos, conectarlo a la función real
  y sincronizar su estado en todos los lugares donde aparezca.
- Si no hay una función real de favoritos, no simular que el producto
  se ha guardado.
- La búsqueda debe utilizar la navegación o el componente de búsqueda
  existente.
- El carrito debe abrir el carrito o la vista correspondiente según la
  implementación actual.
- Mostrar el contador del carrito solo cuando corresponda.
- Proporcionar nombres accesibles a los iconos, por ejemplo «Buscar»,
  «Añadir a favoritos» y «Abrir carrito».
- No añadir botones duplicados si la cabecera global ya ofrece esas
  acciones.

## 10. Diseño responsive

La referencia está pensada principalmente para escritorio. Adaptar la
composición sin perder su jerarquía visual.

### 10.1 Escritorio (aprox. 1200 px o más)

- Mantener dos columnas.
- Galería y contenido editorial a la izquierda; tarjeta de compra a la
  derecha.
- Miniaturas verticales a la izquierda de la imagen principal.
- Mantener la tarjeta de compra desplazada unos 50 px hacia abajo
  respecto al borde superior de la imagen principal; la fila de iconos
  permanece por encima de la tarjeta.
- Mantener las proporciones de la referencia: galería total cercana al
  57 % del ancho útil, columna derecha cercana al 42 % y gap horizontal
  de unos 20–24 px en un viewport de escritorio comparable.
- Tarjeta de compra con padding cercano a 30 px.
- Características en tres columnas compactas.
- Selector de tallas en una fila siempre que exista espacio
  suficiente.
- La página no debe exceder el ancho útil ni producir scroll
  horizontal.

### 10.2 Tablet (aprox. 768--1199 px)

- Reducir espacios y padding proporcionalmente.
- Mantener las dos columnas solo cuando galería y tarjeta sigan siendo
  legibles.
- Ajustar el ancho de las miniaturas y el espacio entre columnas.
- Permitir que las tallas y las características envuelvan a otra
  línea.
- Si la composición queda comprimida, pasar a una columna antes de
  forzar tamaños demasiado pequeños.
- Evitar que el nombre, el precio o los botones se solapen.

### 10.3 Móvil (menos de aprox. 768 px)

- Convertir el contenido en una sola columna.
- Mostrar primero la galería, después las características y
  descripción, y luego la tarjeta o sección de compra, conservando una
  secuencia de lectura natural.
- Adaptar las miniaturas a una fila horizontal desplazable si no
  caben.
- Mantener la imagen principal grande, con proporción estable y sin
  recortar el producto.
- Reducir el radio de las esquinas y el padding de la tarjeta de
  manera proporcional, sin eliminar el estilo soft-card.
- Permitir que los botones de talla envuelvan a varias filas.
- Mantener el botón principal a todo el ancho disponible.
- Ajustar la franja de confianza a dos columnas si se leen
  cómodamente; de lo contrario, apilar sus elementos.
- Los iconos del encabezado deben permanecer accesibles sin comprimir
  el contenido.
- No ocultar información esencial.
- No generar scroll horizontal a nivel de página.
- No utilizar un panel fijo inferior de compra salvo que el proyecto
  ya tenga ese patrón y su uso sea compatible con el diseño y la
  lógica existente.

## 11. Componentes y convenciones

Inspeccionar primero qué componentes están instalados y cómo se
utilizan. Reutilizar cuando resulte apropiado:

- `Button`: acción de compra y controles interactivos.
- `Badge`: descuento, si existe.
- `Separator`: solo si hace falta un divisor real.
- `Tooltip`: únicamente cuando aporte claridad y el proyecto ya use
  ese patrón.
- `Skeleton`: carga de imagen, producto o tarjeta, si encaja con la
  aplicación.
- Sistema de notificaciones existente para éxito y errores.
- Componentes de galería, imágenes, carrito, favoritos y variantes ya
  implementados.

Respetar los tokens semánticos, variables CSS, variantes, aliases,
configuración de `components.json` y modo oscuro, si existe. Priorizar
tokens como `background`, `foreground`, `muted`, `muted-foreground`,
`border` y `primary` cuando estén configurados.

No añadir una biblioteca de iconos o componentes si el proyecto ya
dispone de una solución adecuada.

## 12. Estados de interfaz

Contemplar y probar los estados relevantes:

- Carga de los datos del producto.
- Producto no encontrado o error de carga.
- Imagen principal cargando o fallida.
- Cambio de imagen.
- Variante de color seleccionada.
- Talla seleccionada.
- Variante agotada o no disponible.
- Validación de opciones obligatorias.
- Agregado al carrito en proceso.
- Agregado al carrito con éxito.
- Error al agregar al carrito.
- Favorito activo/inactivo, si existe esa funcionalidad.
- Valoración ausente.
- Precio anterior o descuento ausente.
- Descripción o características ausentes.

No dejar espacios vacíos donde se hayan omitido datos opcionales.
Reutilizar los patrones de carga, error y notificaciones existentes. No
presentar como real un estado que no haya sido confirmado por la
aplicación.

## 13. Accesibilidad y rendimiento

- Usar estructura semántica y jerarquía correcta de encabezados.
- Añadir texto alternativo apropiado a las imágenes.
- Dar nombres accesibles a los controles de iconos.
- Mantener indicadores de foco visibles.
- Permitir navegar por miniaturas, colores y tallas mediante teclado.
- Comunicar selección, disponibilidad y errores mediante atributos
  accesibles.
- No depender únicamente del color para comunicar selección o
  agotamiento.
- Mantener contraste suficiente.
- Respetar `prefers-reduced-motion`.
- Reservar espacio para imágenes y evitar saltos de layout.
- Optimizar la carga de imágenes sin reducir su calidad visual
  innecesariamente.
- Evitar errores de consola, imágenes deformadas y desbordamiento
  horizontal.

## 14. Flujo de trabajo para el agente de IA

### Antes de implementar

1.  Inspeccionar el proyecto y localizar la página y los componentes de
    detalle del producto.
2.  Confirmar las versiones y la configuración real de React, Tailwind
    CSS y shadcn/ui.
3.  Identificar la fuente, los tokens de color, los breakpoints y los
    patrones responsive existentes.
4.  Identificar cómo se obtienen producto, imágenes, marca, precio,
    descuentos, valoración, descripción, características, variantes y
    stock.
5.  Revisar la lógica actual del carrito, favoritos, búsqueda y
    navegación.
6.  Identificar los componentes de iconos, galería, notificaciones y
    estados de carga.
7.  Determinar qué afirmaciones comerciales están respaldadas por datos
    reales.

### Durante la implementación

8.  Implementar la composición descrita, priorizando la referencia final
    proporcionada.
9.  Crear o adaptar la galería con miniaturas verticales en escritorio e
    imagen principal amplia.
10. Añadir debajo de la galería las características verificadas y la
    descripción editorial.
11. Crear la tarjeta de compra blanca con esquinas redondeadas y sombra
    suave.
12. Implementar los selectores reales de color y talla.
13. Conectar el botón principal al carrito existente.
14. Conservar solo mensajes de confianza verificados.
15. Eliminar «Devoluciones fáciles» y las pestañas inferiores de
    descripción/detalles.
16. No inventar valoraciones, características, plazos, descuentos,
    imágenes ni variantes.
17. No añadir dependencias innecesarias ni modificar páginas no
    relacionadas.

### Después de implementar

18. Ejecutar lint, typecheck, pruebas y/o build disponibles.
19. Corregir los errores introducidos.
20. Revisar visualmente escritorio, tablet y móvil.
21. Probar el cambio de imágenes y de variantes.
22. Probar validaciones de talla, disponibilidad y agregado al carrito.
23. Verificar que los controles de encabezado y favoritos funcionan si
    se muestran.
24. Comprobar que los datos opcionales ausentes no dejan huecos ni
    contenido ficticio.
25. Informar qué archivos se modificaron, qué comportamiento se conectó
    y qué comprobaciones se ejecutaron.

## 15. Criterios de aceptación

- [ ] La composición se aproxima fielmente a la última referencia:
      galería izquierda y tarjeta de compra derecha.
- [ ] La galería tiene miniaturas verticales a la izquierda de la
      imagen principal en escritorio.
- [ ] La imagen principal es grande, tiene fondo neutro, esquinas
      redondeadas y conserva la proporción del producto.
- [ ] El indicador 360° solo aparece si existe una función real
      asociada.
- [ ] Debajo de la galería aparecen hasta tres características
      verificadas, con icono, título y texto secundario.
- [ ] La descripción editorial y «Leer más» solo se muestran cuando
      hay contenido y una acción real.
- [ ] La tarjeta derecha es blanca, redondeada, tiene sombra suave y
      padding consistente.
- [ ] Marca, nombre, valoración, precio y descuento respetan el orden
      y la jerarquía descritos.
- [ ] No se inventan valoraciones, reseñas, precios, descuentos ni
      textos comerciales.
- [ ] Los colores se representan mediante miniaturas o muestras
      reales, y la variante activa se distingue claramente.
- [ ] Las tallas reflejan la disponibilidad real y la selección activa
      tiene fondo oscuro y texto claro.
- [ ] El botón principal es oscuro, de ancho completo, con icono de
      carrito y conectado al flujo real.
- [ ] La franja inferior contiene solo mensajes de confianza
      verificados: envío disponible y compras seguras cuando correspondan.
- [ ] No aparece «Devoluciones fáciles» ni ningún mensaje equivalente.
- [ ] No aparecen pestañas inferiores «Descripción» y «Detalles del
      producto», ni secciones creadas para reemplazarlas.
- [ ] Búsqueda, favoritos y carrito funcionan realmente si se
      muestran.
- [ ] En tablet y móvil, la composición se adapta sin solapamientos ni
      scroll horizontal.
- [ ] Se reutilizan componentes y tokens existentes y no se instalan
      dependencias innecesarias.
- [ ] No se alteran funcionalidades ajenas al detalle del producto.
- [ ] Se ejecutan las comprobaciones disponibles y se corrigen los
      errores introducidos.

## 16. Instrucción final

Implementa el rediseño directamente en el proyecto existente usando como
referencia visual prioritaria la **última imagen proporcionada por el
usuario**.

La composición objetivo es: fondo blanco roto; galería amplia con
miniaturas verticales a la izquierda; imagen del producto sobre una
superficie suave; tres características debajo; descripción editorial y
enlace «Leer más»; tarjeta de compra blanca y elevada a la derecha;
marca, nombre, valoración real, precio y descuento; miniaturas de color;
tallas ovaladas con selección negra; botón negro de ancho completo; y
una franja inferior con los mensajes de confianza válidos «Envío
disponible» y «Compras seguras».

No reintroduzcas opciones de devolución ni pestañas inferiores. No
inventes contenido ni funcionalidades para que la pantalla parezca
completa. Inspecciona el proyecto, conserva su arquitectura y conecta
todos los controles a la lógica real. El objetivo es replicar la
distribución, jerarquía, proporciones y estilo de la referencia con una
implementación responsive, accesible y funcional.
