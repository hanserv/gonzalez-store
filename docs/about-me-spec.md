# Spec: Timeline de carrera para About Me (React + Tailwind CSS + shadcn/ui)

## 1. Objetivo

Implementar en el proyecto real una sección de portfolio/About Me que cuente la evolución académica y profesional mediante una timeline vertical moderna y editorial.

La referencia visual exacta es la **opción 5 del collage original de seis diseños**, titulada **“Formación, experiencia y nuevos desafíos”**.

No crear una infografía compacta ni una lista de tarjetas pequeñas. Cada etapa debe sentirse como un bloque amplio, con una fotografía destacada, texto legible y espacio vertical generoso. Una línea central conecta visualmente los hitos.

Este documento define el resultado visual, la estructura, el comportamiento y los criterios de aceptación.

**Importante:** no inventar datos biográficos, empleos, fechas, tecnologías, instituciones ni logros. Reutilizar contenido real si ya existe; de lo contrario, utilizar placeholders claramente identificables y fáciles de reemplazar.

## 2. Stack obligatorio

- **Framework:** React.
- **Estilos:** Tailwind CSS.
- **Componentes UI:** shadcn/ui.
- Mantener el sistema de build, las versiones, la estructura de carpetas y las convenciones existentes.
- No migrar el proyecto ni reemplazar su configuración.
- No añadir dependencias innecesarias.
- Si el proyecto usa TypeScript, mantener TypeScript. Si utiliza JavaScript, mantener JavaScript.
- Reutilizar componentes, tokens, fuentes y convenciones existentes.
- Inspeccionar primero la configuración de shadcn/ui y los componentes disponibles antes de implementar.

### Uso de shadcn/ui

- Reutilizar los componentes shadcn/ui existentes cuando sean apropiados.
- Respetar sus variantes, tokens, configuración y convenciones.
- No instalar ni regenerar componentes automáticamente sin comprobar primero cuáles están disponibles.
- No forzar componentes como `Card`, `Badge` o `Separator` si no contribuyen al diseño.
- La timeline puede construirse con componentes React propios y utilidades Tailwind cuando shadcn/ui no ofrezca un componente adecuado.
- Importar los componentes desde las rutas reales del proyecto; no asumir aliases ni rutas que no existan.
- Mantener compatibilidad con el tema claro/oscuro si el proyecto ya lo soporta.

## 3. Concepto visual de referencia

La composición debe seguir el diseño **“Formación, experiencia y nuevos desafíos”**.

Características principales:

- Estética clara, moderna, profesional y editorial.
- Fondo blanco, blanco roto o el fondo claro definido por el tema existente.
- Encabezado con título destacado y subtítulo breve.
- Bloques horizontales grandes apilados verticalmente.
- Imágenes amplias y protagonistas.
- Texto distribuido de forma equilibrada respecto a las imágenes.
- Una línea vertical fina que conecta los diferentes hitos.
- Nodos pequeños alineados con cada etapa.
- Alternancia entre imágenes y textos en escritorio.

La distribución inicial será:

1. Primera etapa: imagen a la izquierda y texto a la derecha.
2. Segunda etapa: texto a la izquierda e imagen a la derecha.
3. Tercera etapa: imagen a la izquierda y texto a la derecha.
4. Cuarta etapa: texto a la izquierda e imagen a la derecha.

La implementación debe soportar cualquier cantidad de etapas, no solamente cuatro.

Evitar:

- Tarjetas pequeñas con apariencia de infografía.
- Sombras excesivas.
- Bordes gruesos.
- Colores demasiado llamativos.
- Iconos decorativos innecesarios.
- Apariencia de dashboard administrativo.
- Animaciones exageradas.
- Espacios demasiado reducidos entre etapas.

La línea y los nodos sirven para orientar visualmente al usuario, pero no deben competir con las imágenes ni con los títulos.

## 4. Estructura de la sección

### 4.1. Encabezado

Antes de la timeline, incluir:

- Un eyebrow opcional: `MI TRAYECTORIA`.
- Título principal: **“Formación, experiencia y nuevos desafíos”**.
- Subtítulo de una o dos líneas que presente las etapas más importantes de la evolución académica y profesional.

El encabezado debe tener espacio suficiente antes del primer hito.

El título puede alinearse a la izquierda para mantener la estética editorial. No es obligatorio centrarlo.

Si el proyecto ya tiene contenido aprobado, respetarlo. Si no existe, utilizar texto provisional fácil de modificar.

### 4.2. Hitos de la timeline

Cada etapa debe admitir los siguientes campos:

1. Número de orden opcional: `01`, `02`, `03`, etc.
2. Fecha o rango temporal.
3. Título de la etapa.
4. Descripción narrativa.
5. Imagen representativa.
6. Etiquetas opcionales de tecnologías, habilidades o categoría.
7. Nodo asociado a la línea vertical.

Las etiquetas solo deben mostrarse cuando exista información real que aportar.

La cantidad de etapas debe ser dinámica. Añadir o eliminar hitos no debe requerir modificar manualmente la estructura visual del componente.

### 4.3. Composición de cada etapa

Cada etapa debe ser visualmente amplia y equilibrada.

En escritorio:

- Utilizar dos columnas de proporciones aproximadamente iguales.
- Mostrar una imagen grande en una columna y el contenido en la otra.
- Alternar la posición de las columnas entre etapas.
- Alinear verticalmente la imagen y el contenido textual.
- Mantener suficiente separación entre la línea central y los elementos de contenido.

Imágenes:

- Preferiblemente horizontales, con relación 16:9 o 4:3.
- Utilizar `object-cover`.
- Aplicar esquinas suavemente redondeadas.
- Mantener una proporción consistente entre imágenes.
- Evitar deformaciones.
- Reservar el espacio de la imagen antes de cargarla para reducir los cambios de layout.

Contenido:

- Mostrar la fecha como información secundaria.
- Dar protagonismo al título.
- Utilizar descripciones legibles con un ancho de línea cómodo.
- Permitir etiquetas opcionales cuando aporten contexto.
- Evitar párrafos demasiado largos.

No es obligatorio envolver cada etapa en una tarjeta con borde. La composición debe sentirse abierta y editorial, como en la referencia.

Si se utilizan fondos o tarjetas sutiles, no deben restar protagonismo a las imágenes.

La alternancia debe resolverse mediante una clase basada en el índice o una propiedad de configuración, evitando duplicar todo el markup.

## 5. Línea central y nodos

Implementar la línea y los nodos mediante elementos HTML decorativos y CSS/Tailwind, no mediante una imagen estática.

Requisitos:

- Línea vertical fina, aproximadamente de 1 a 2 píxeles.
- Color neutro suave, como gris azulado claro.
- Nodo circular pequeño por cada hito.
- Color del nodo basado en el acento del tema existente.
- Alineación visual consistente entre los nodos y las etapas.
- La línea debe comenzar cerca del primer nodo y terminar cerca del último.
- No debe atravesar textos ni imágenes.
- Los elementos decorativos deben utilizar `aria-hidden="true"` cuando corresponda.

En escritorio, reservar un canal central suficiente para la línea y los nodos.

No utilizar caracteres de texto ni imágenes estáticas para simular la línea.

Evitar mediciones complejas del DOM cuando una solución CSS estable sea suficiente.

La línea debe adaptarse a distintas cantidades de hitos y no depender de alturas fijas que se rompan cuando cambie la descripción de una etapa.

## 6. Diseño responsive

### 6.1. Escritorio: 1024 px o más

- Mantener la línea central.
- Alternar imágenes y textos entre izquierda y derecha.
- Reservar un canal central para la línea y los nodos.
- Utilizar un ancho máximo aproximado de `max-w-6xl`, o el equivalente del proyecto.
- Mantener imágenes amplias y columnas equilibradas.
- Conservar separaciones verticales generosas.
- Evitar que los textos y las imágenes se estiren demasiado en monitores grandes.

### 6.2. Tablet: 768–1023 px

- Conservar la alternancia si hay espacio suficiente.
- Reducir proporcionalmente el tamaño de las imágenes y la tipografía.
- Si el eje central compromete la legibilidad, utilizar una línea lateral.
- No permitir solapamientos ni comprimir excesivamente el contenido.

### 6.3. Móvil: menos de 768 px

Cambiar la composición a una sola columna.

- Colocar la línea vertical cerca del margen izquierdo.
- Situar los nodos junto a la línea.
- Colocar todos los hitos a la derecha de la línea.
- Mostrar la imagen y el texto en vertical, normalmente con la imagen arriba y el contenido debajo.
- No mantener la línea en el centro si reduce demasiado el espacio disponible.
- Mantener imágenes de ancho completo dentro del bloque.
- Evitar el scroll horizontal.
- Mantener márgenes laterales suficientes.
- Reducir tipografía y espacios con moderación.

Aunque la composición cambie a una columna, los hitos deben seguir sintiéndose amplios y bien separados.

## 7. Dirección visual, Tailwind CSS y shadcn/ui

Primero inspeccionar los estilos, tokens y componentes existentes.

### 7.1. Uso de Tailwind CSS

Las siguientes clases sirven como referencia inicial:

- Fondo: `bg-slate-50` o blanco.
- Texto principal: `text-slate-900`.
- Texto secundario: `text-slate-600`.
- Línea: `bg-slate-300`.
- Nodo: `bg-blue-500`, o el color primario existente.
- Imagen: `w-full object-cover rounded-xl`.
- Contenedor: `mx-auto w-full max-w-6xl`.
- Padding horizontal: `px-4 sm:px-6 lg:px-8`.
- Separación vertical: escalas amplias como `py-12`, `md:py-16` o `gap-y-16`.

Estos valores son orientativos. La prioridad es mantener la coherencia con el sistema de diseño del proyecto.

Utilizar las utilidades responsive de Tailwind para adaptar la composición a cada tamaño de pantalla.

Evitar listas de clases innecesariamente complejas o duplicadas. Extraer componentes cuando mejore la legibilidad.

### 7.2. Tokens semánticos de shadcn/ui

Si el proyecto utiliza los tokens semánticos habituales de shadcn/ui, priorizarlos frente a colores fijos.

Por ejemplo:

- `bg-background`
- `text-foreground`
- `text-muted-foreground`
- `border-border`
- `bg-primary`
- `text-primary-foreground`

La elección exacta debe adaptarse a los tokens que realmente existan en el proyecto.

No asumir que todas las variables o clases están configuradas.

Si el sitio soporta modo oscuro, asegurar que el contraste y los fondos de la timeline se adapten al tema sin romper la referencia visual.

### 7.3. Configuración que debe inspeccionarse

Antes de modificar estilos, revisar cuando existan:

- `components.json`
- Configuración de Tailwind CSS.
- Variables CSS del tema.
- Aliases de importación.
- Directorio de componentes shadcn/ui.
- Componentes reutilizables existentes.
- Configuración de fuentes y colores.

No reemplazar la configuración actual por una nueva.

## 8. Modelo de datos y arquitectura React

Separar los datos de la presentación.

Crear un array de etapas y renderizarlo con `.map()`.

Modelo conceptual en TypeScript:

```ts
type CareerStage = {
	id: string;
	period: string;
	title: string;
	description: string;
	image: string;
	imageAlt: string;
	tags?: string[];
};

const careerStages: CareerStage[] = [
	{
		id: 'formacion',
		period: 'AÑO — AÑO',
		title: 'Formación académica',
		description:
			'Descripción breve y personal de lo aprendido o conseguido en esta etapa.',
		image: '/images/career/formacion.jpg',
		imageAlt: 'Descripción significativa de la imagen',
		tags: [],
	},
];
```

Si el proyecto utiliza JavaScript, adaptar el modelo a JavaScript sin introducir TypeScript únicamente para esta sección.

### Componentes sugeridos

Si encajan con la arquitectura existente, crear:

- `CareerTimeline`: contiene el encabezado, la línea y la lista de etapas.
- `CareerTimelineItem`: representa una etapa individual.

Requisitos:

- Utilizar una `key` estable basada en `stage.id`.
- Alternar la composición mediante el índice (`index % 2`) o una propiedad `side`.
- Evitar duplicar el markup de cada etapa.
- No utilizar `dangerouslySetInnerHTML`.
- No añadir estado React si no existe una necesidad de interacción.
- Mantener la semántica HTML correcta.
- Mantener un orden lógico de lectura en el DOM, aunque las columnas se alternen visualmente.

La estructura de datos debe permitir modificar, agregar, eliminar o reordenar etapas sin rehacer el componente.

## 9. Imágenes y contenido

- Reutilizar imágenes reales existentes en el proyecto cuando sean apropiadas.
- Si no existen imágenes, preparar rutas y placeholders claramente reemplazables.
- No presentar fotografías de stock como si representaran hechos reales de la vida del propietario.
- No inventar fechas, universidades, empresas, cargos, tecnologías ni logros.
- Los siguientes títulos son ejemplos reemplazables:
  1. Formación académica.
  2. Primeros pasos profesionales.
  3. Especialización y crecimiento.
  4. Nuevos desafíos.

Las descripciones deben ser personales, concretas y relativamente breves.

Para las imágenes:

- Usar texto alternativo significativo cuando la imagen aporte información.
- Usar `alt=""` cuando sea puramente decorativa.
- Definir dimensiones o relación de aspecto para reducir los saltos de layout.
- Utilizar `loading="lazy"` en imágenes que no sean prioritarias para la carga inicial.
- Reutilizar el sistema de imágenes optimizadas del proyecto, si existe.

## 10. Animaciones e interacciones

La sección debe ser completamente comprensible y funcional sin animaciones.

### 10.1. Entrada al hacer scroll (opcional)

Se puede animar la aparición de los hitos mediante:

- Transición de opacidad.
- Desplazamiento vertical pequeño.
- Duración aproximada de 400–700 ms.

Evitar rebotes, desplazamientos grandes y efectos que distraigan.

El contenido no debe permanecer oculto si falla el JavaScript.

Respetar `prefers-reduced-motion: reduce`.

### 10.2. Línea progresiva (opcional)

Se puede implementar una animación sutil para que la línea parezca dibujarse al avanzar por la página.

- La línea debe seguir siendo visible sin JavaScript.
- No provocar cambios de layout.
- Evitar cálculos frágiles basados en tamaños específicos.
- Evitar listeners de scroll costosos.
- Si se necesita detectar visibilidad, preferir `IntersectionObserver` o las soluciones que ya utilice el proyecto.

### 10.3. Hover (opcional)

Se puede aplicar una transición discreta a las imágenes, como un cambio de escala muy pequeño.

No revelar contenido esencial únicamente mediante hover.

La experiencia debe seguir siendo equivalente en dispositivos táctiles.

No añadir botones, enlaces ni controles que no tengan una acción real definida.

## 11. Accesibilidad y rendimiento

- Utilizar estructura semántica con un encabezado claro para la sección.
- Mantener un orden lógico de lectura en el DOM.
- Proporcionar textos alternativos adecuados.
- Garantizar contraste suficiente en fechas, descripciones y etiquetas.
- No comunicar el orden de las etapas únicamente mediante color.
- Ocultar los elementos decorativos de los lectores de pantalla cuando corresponda.
- Respetar `prefers-reduced-motion`.
- Evitar errores de consola.
- Evitar imágenes rotas, scroll horizontal y cambios inesperados de layout.
- No depender de las animaciones para hacer visible el contenido.
- Evitar efectos que degraden el rendimiento en dispositivos móviles.

## 12. Flujo de trabajo obligatorio para el agente

Antes de implementar:

1. Inspeccionar el proyecto para confirmar las versiones de React y Tailwind CSS.
2. Revisar la configuración de shadcn/ui, `components.json` si existe, aliases, variables CSS y componentes disponibles.
3. Identificar la página About Me y el lugar adecuado para integrar la sección.
4. Determinar si el proyecto utiliza TypeScript o JavaScript.
5. Identificar los tokens de color, las fuentes, los contenedores y los patrones responsive existentes.
6. Localizar contenido e imágenes reales que puedan utilizarse sin inventar datos.

Durante la implementación:

7. Integrar la sección en la página existente.
8. Separar los datos de los componentes visuales.
9. Reutilizar los componentes shadcn/ui existentes cuando aporten valor.
10. Usar componentes React propios y Tailwind para la estructura específica de la timeline.
11. No añadir dependencias innecesarias.
12. No modificar páginas ni comportamientos ajenos a esta sección.

Después de implementar:

13. Ejecutar los comandos de lint, typecheck, tests o build disponibles en el proyecto.
14. Corregir los errores introducidos por el cambio.
15. Revisar escritorio, tablet y móvil.
16. Verificar la alineación de la línea, los nodos, las imágenes y los textos.
17. Informar qué archivos se modificaron, qué comprobaciones se ejecutaron y qué contenido o imágenes siguen siendo placeholders.

No migrar tecnologías ni reemplazar archivos de configuración completos sin necesidad.

## 13. Criterios de aceptación

La implementación se considera terminada cuando:

- [ ] El título de la sección es “Formación, experiencia y nuevos desafíos”.
- [ ] La implementación utiliza React y Tailwind CSS, respetando la configuración existente de shadcn/ui.
- [ ] Se reutilizan los tokens y componentes shadcn/ui existentes cuando aportan valor.
- [ ] Cada etapa admite periodo, título, descripción e imagen.
- [ ] Los hitos son bloques amplios con espacio vertical generoso.
- [ ] El diseño no parece una infografía ni una lista de tarjetas pequeñas.
- [ ] En escritorio, las imágenes y los textos alternan entre izquierda y derecha.
- [ ] Una línea vertical central conecta nodos visibles para cada hito.
- [ ] La línea no atraviesa textos ni imágenes.
- [ ] En móvil, el diseño cambia a una columna con línea lateral.
- [ ] No existe scroll horizontal en móvil.
- [ ] Las imágenes mantienen un recorte consistente y no se deforman.
- [ ] Los hitos se generan desde datos sin duplicar markup.
- [ ] No se han inventado datos personales ni se presentan placeholders como hechos.
- [ ] Las animaciones son sutiles, opcionales y respetan la reducción de movimiento.
- [ ] El diseño es coherente con el resto del sitio y su tema.
- [ ] No se han añadido dependencias innecesarias.
- [ ] No se han modificado secciones no relacionadas.
- [ ] Se han ejecutado las comprobaciones disponibles y corregido los errores introducidos.

## 14. Instrucción final

Implementa la sección directamente en el proyecto existente. No entregues solamente un mockup o una explicación.

La referencia visual obligatoria es la **opción 5 del collage original, “Formación, experiencia y nuevos desafíos”**.

El resultado debe tener:

- Bloques grandes con imágenes protagonistas.
- Texto alternado entre izquierda y derecha.
- Una línea vertical central con nodos conectores.
- Estética editorial moderna.
- Espaciado vertical generoso.
- Adaptación responsive mediante una línea lateral en móvil.
- Integración coherente con React, Tailwind CSS y shadcn/ui.

Si hay decisiones no especificadas, elegir la solución más sencilla, accesible, responsive y coherente con la arquitectura existente.

No inventar datos biográficos ni rehacer partes del sitio que no sean necesarias para integrar esta sección.
