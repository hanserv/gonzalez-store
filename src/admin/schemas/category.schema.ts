import {z} from 'zod';

export const categorySchema = z.object({
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
			'Solo minúsculas, números y guiones. Ejemplo: ropa-deportiva',
		),
	description: z
		.string()
		.trim()
		.max(300, 'La descripción no puede superar 300 caracteres'),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
