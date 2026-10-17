import {z} from 'zod';

export const productSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'El nombre debe tener al menos 2 caracteres')
		.max(80, 'El nombre no puede superar 80 caracteres'),
	brandId: z.string().min(1, 'Debes seleccionar una marca'),
	categoryId: z.string().min(1, 'Debes seleccionar una categoría'),
});

export type ProductFormValues = z.infer<typeof productSchema>;
