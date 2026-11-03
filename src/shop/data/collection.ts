export type CollectionImage = {
	src: string;
	alt: string;
	width: number;
	height: number;
	sizes?: string;
	srcSet?: string;
	avifSrcSet?: string;
	webpSrcSet?: string;
};

export type CollectionOffsetItem = {
	id: string;
	title: string;
	description: string;
	image: CollectionImage;
};

export const collectionCopy = {
	eyebrow: 'Colección',
	title: 'Cada par cuenta una historia',
	panoramaPhrase: 'El juego empieza en los pies.',
	ctaLabel: 'Ver tienda',
};

export const collectionVerticalRow: CollectionImage[] = [
	{
		src: '/coleccion/coleccion-f1-1.svg',
		alt: 'Tenis de la colección sobre una superficie clara',
		width: 900,
		height: 1200,
		sizes: '(min-width: 640px) 33vw, 78vw',
	},
	{
		src: '/coleccion/coleccion-f1-2.svg',
		alt: 'Detalle de la suela y el acabado de un par de tenis',
		width: 900,
		height: 1200,
		sizes: '(min-width: 640px) 33vw, 78vw',
	},
	{
		src: '/coleccion/coleccion-f1-3.svg',
		alt: 'Tenis en movimiento vistos desde un ángulo lateral',
		width: 900,
		height: 1200,
		sizes: '(min-width: 640px) 33vw, 78vw',
	},
];

export const collectionFeatureRow = {
	large: {
		src: '/coleccion/coleccion-f2-1.svg',
		alt: 'Tenis de la colección en una composición horizontal',
		width: 1440,
		height: 900,
		sizes: '(min-width: 768px) 66vw, 100vw',
	} satisfies CollectionImage,
	small: [
		{
			src: '/coleccion/coleccion-f2-2.svg',
			alt: 'Detalle del empeine de un tenis de la colección',
			width: 720,
			height: 450,
			sizes: '(min-width: 768px) 33vw, 50vw',
		},
		{
			src: '/coleccion/coleccion-f2-3.svg',
			alt: 'Detalle del cordón y la lengüeta de un tenis',
			width: 720,
			height: 450,
			sizes: '(min-width: 768px) 33vw, 50vw',
		},
	] satisfies CollectionImage[],
};

export const collectionPanorama: CollectionImage = {
	src: '/coleccion/coleccion-f3-1.svg',
	alt: 'Panorámica de la colección con varios pares de tenis',
	width: 2100,
	height: 900,
	sizes: '100vw',
};

export const collectionOffsetRow: CollectionOffsetItem[] = [
	{
		id: 'estilo-de-calle',
		title: 'Estilo de calle',
		description: 'Siluetas que acompañan el día a día.',
		image: {
			src: '/coleccion/coleccion-f4-1.svg',
			alt: 'Tenis de estilo urbano de la colección',
			width: 1000,
			height: 1000,
			sizes: '(min-width: 768px) 50vw, 100vw',
		},
	},
	{
		id: 'ritmo-propio',
		title: 'Ritmo propio',
		description: 'Piezas pensadas para moverte sin prisa.',
		image: {
			src: '/coleccion/coleccion-f4-2.svg',
			alt: 'Tenis de ritmo diario de la colección',
			width: 1000,
			height: 1000,
			sizes: '(min-width: 768px) 50vw, 100vw',
		},
	},
];
