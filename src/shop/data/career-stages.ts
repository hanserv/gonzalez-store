export type CareerStage = {
	id: string;
	period: string;
	title: string;
	description: string;
	image: string;
	imageAlt: string;
	tags?: string[];
};

export const careerStages: CareerStage[] = [
	{
		id: 'formacion',
		period: 'Nuestra historia',
		title: 'antes del nombre, ya existía la historia.',
		description: `
				Gonzalez Peña no nació de un plan, ni de una fórmula. Nació de una serie de momentos, decisiones y sueños que se fueron construyendo con el tiempo. Esta es la historia de cómo un niño de un barrio humilde, con grandes sueños construye algo más grande que el.
			`,
		image: '/about-me-01.jpeg',
		imageAlt: 'Antes del nombre, ya existía la historia',
	},
	{
		id: 'inicios',
		period: 'El origen',
		title: 'una casa de madera, grandes sueños.',
		description: `Todo comenzó en una humilde casa de madera, donde la falta de comodidades no era un obstáculo, sino una motivación. Fue en ese entorno donde aprendí el valor del trabajo, la disciplina y la importancia de nunca rendirse.`,
		image: '/about-me-02.jpeg',
		imageAlt: 'Una casa de madera, grandes sueños',
	},
	{
		id: 'purga',
		period: 'El primer negocio',
		title: 'el villete que cambió el rumbo.',
		description: `Desde niño trabajé en la purga con mi padre allí me forge y empecé a ver el mundo de otra manera, a mis 15 años mi padre me entregó 2,000 pesos no era solo dinero, era lo único que me quedaba de él y decidí emprender.`,
		image: '/about-me-04.jpeg',
		imageAlt: 'El primer negocio',
	},
	{
		id: 'crecimiento',
		period: 'La formación',
		title: 'el sueño de ser cadete',
		description: `Durante años, intenté ingresar a las instituciones militares del país. Fue un camino difícil, con muchos intentos fallidos, pero cada rechazo me hizo más fuerte. Aprendí que la disciplina, la constancia y la determinación son claves, tanto en la vida militar como en los negocios.
`,
		image: '/about-me-03.jpeg',
		imageAlt: 'El sueño de ser cadete',
	},
	{
		id: 'desafios',
		period: 'La evolución',
		title: 'de la purga a los grandes sueños.',
		description: `Lo que comenzó como un pequeño emprendimiento, hoy es una visión más grande. González Peña no es solo una tienda, es una marca con propósito, creada para inspirar, para ofrecer más que productos y para dejar un legado.`,
		image: '/about-me-05.jpeg',
		imageAlt: 'De la purga a los grandes sueños',
	},
	{
		id: 'cambio',
		period: 'El cambio',
		title: 'de gonzalez sport a gonzalez peña.',
		description:
			'A lo largo de nuestro camino, las adversidades fueron creciendo, al igual que nuestra visión. Hoy, González Sport es parte de la historia que me condujo hasta aquí, mientras que González Peña es una historia que apenas comienza.',
		image: '/about-me-06.jpeg',
		imageAlt: 'De Gonzalez Sport a Gonzalez Peña',
	},
];
