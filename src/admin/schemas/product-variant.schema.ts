import {z} from 'zod';

const productVariantSizeSchema = z.object({
	size: z
		.string()
		.trim()
		.min(1, 'La talla es obligatoria')
		.max(10, 'La talla no puede superar 10 caracteres'),
	stock: z.coerce
		.number()
		.int('El stock debe ser un número entero')
		.min(0, 'El stock no puede ser negativo'),
});

export const productVariantSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'El nombre debe tener al menos 2 caracteres')
		.max(80, 'El nombre no puede superar 80 caracteres'),
	slug: z
		.string()
		.trim()
		.toLowerCase()
		.min(2, 'El slug debe tener al menos 2 caracteres')
		.max(100, 'El slug no puede superar 100 caracteres')
		.regex(
			/^[a-z0-9]+(-[a-z0-9]+)*$/,
			'Solo minúsculas, números y guiones. Ejemplo: black-gold',
		),
	description: z
		.string()
		.trim()
		.max(300, 'La descripción no puede superar 300 caracteres'),
	price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
	discountPercentage: z.coerce
		.number()
		.min(0, 'El descuento no puede ser negativo')
		.max(100, 'El descuento no puede superar 100'),
	isActive: z.boolean(),
	sizes: z
		.array(productVariantSizeSchema)
		.min(1, 'Debes agregar al menos una talla'),
});

export type ProductVariantFormValues = z.infer<typeof productVariantSchema>;
export type ProductVariantFormInput = z.input<typeof productVariantSchema>;
