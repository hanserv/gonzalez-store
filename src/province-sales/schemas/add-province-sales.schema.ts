import {z} from 'zod';

export const addProvinceSalesSchema = z.object({
	provinceId: z.coerce
		.number('Selecciona una provincia.')
		.int('La provincia es inválida.')
		.positive('Selecciona una provincia.'),
	quantity: z.preprocess(
		(value) => {
			if (value === '' || value === null || value === undefined) {
				return undefined;
			}

			return typeof value === 'string' ? value.trim() : value;
		},
		z.coerce
			.number('La cantidad debe ser un número.')
			.int('La cantidad debe ser un número entero.')
			.refine((value) => value !== 0, 'La cantidad no puede ser 0.'),
	),
	note: z
		.string()
		.trim()
		.max(200, 'La nota no puede superar 200 caracteres')
		.default(''),
});

export type AddProvinceSalesFormValues = z.infer<typeof addProvinceSalesSchema>;
export type AddProvinceSalesFormInput = z.input<typeof addProvinceSalesSchema>;
