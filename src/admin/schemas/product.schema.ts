import {z} from 'zod';

export const productNameSchema = z
	.string()
	.trim()
	.min(2, 'El nombre debe tener al menos 2 caracteres')
	.max(80, 'El nombre no puede superar 80 caracteres');

export const productNameFormSchema = z.object({name: productNameSchema});

export const productSchema = z.object({
	name: productNameSchema,
	brandId: z.string().min(1, 'Debes seleccionar una marca'),
	categoryId: z.string().min(1, 'Debes seleccionar una categoría'),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductNameFormValues = z.infer<typeof productNameFormSchema>;
