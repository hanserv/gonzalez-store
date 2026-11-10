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
	ctaLabel: 'Ver tienda',
};

export const collectionVerticalRow: CollectionImage[] = [
	{
		src: '/coleccion/coleccion-f1-1.jpeg',
		alt: '',
		width: 900,
		height: 1200,
		sizes: '(min-width: 640px) 33vw, 78vw',
	},
	{
		src: '/coleccion/coleccion-f1-2.jpeg',
		alt: '',
		width: 900,
		height: 1200,
		sizes: '(min-width: 640px) 33vw, 78vw',
	},
	{
		src: '/coleccion/coleccion-f1-3.jpeg',
		alt: '',
		width: 900,
		height: 1200,
		sizes: '(min-width: 640px) 33vw, 78vw',
	},
];

export const collectionFeatureRow = {
	large: {
		src: '/coleccion/coleccion-f2-1.jpeg',
		alt: '',
		width: 1440,
		height: 900,
		sizes: '(min-width: 768px) 66vw, 100vw',
	} satisfies CollectionImage,
	small: [
		{
			src: '/coleccion/coleccion-f2-2.jpeg',
			alt: '',
			width: 720,
			height: 450,
			sizes: '(min-width: 768px) 33vw, 50vw',
		},
		{
			src: '/coleccion/coleccion-f2-3.jpeg',
			alt: '',
			width: 720,
			height: 450,
			sizes: '(min-width: 768px) 33vw, 50vw',
		},
	] satisfies CollectionImage[],
};

export const collectionPanorama: CollectionImage = {
	src: 'gonzalez-logo-white.png',
	alt: '',
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
			src: '/coleccion/coleccion-f4-1.jpeg',
			alt: '',
			width: 1000,
			height: 1000,
			sizes: '(min-width: 768px) 50vw, 100vw',
		},
	},
	{
		id: 'estilo-propio',
		title: 'Estilo propio',
		description: 'Piezas pensadas para moverte sin prisa.',
		image: {
			src: '/coleccion/coleccion-f4-2.jpeg',
			alt: '',
			width: 1000,
			height: 1000,
			sizes: '(min-width: 768px) 50vw, 100vw',
		},
	},
];
