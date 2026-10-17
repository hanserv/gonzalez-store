import {z} from 'zod';

export const brandSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'El nombre debe tener al menos 2 caracteres')
		.max(60, 'El nombre no puede superar 60 caracteres'),
	slug: z
		.string()
		.trim()
		.toLowerCase()
		.min(2, 'El slug debe tener al menos 2 caracteres')
		.max(80, 'El slug no puede superar 80 caracteres')
		.regex(
			/^[a-z0-9]+(-[a-z0-9]+)*$/,
			'Solo minúsculas, números y guiones. Ejemplo: nike-air',
		),
	description: z
		.string()
		.trim()
		.max(300, 'La descripción no puede superar 300 caracteres'),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
