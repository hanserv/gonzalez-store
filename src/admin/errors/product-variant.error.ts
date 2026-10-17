import type {PostgrestError} from '@supabase/supabase-js';

export type ProductVariantErrorCode =
	| 'duplicate_name'
	| 'duplicate_slug'
	| 'image_required'
	| 'not_found';

export class ProductVariantError extends Error {
	readonly code: ProductVariantErrorCode;

	constructor(code: ProductVariantErrorCode) {
		super(code);
		this.name = 'ProductVariantError';
		this.code = code;
	}
}

export const PRODUCT_VARIANT_ERROR_MESSAGES: Record<
	ProductVariantErrorCode,
	string
> = {
	duplicate_name: 'Ya existe una variante con ese nombre en este producto.',
	duplicate_slug: 'Ya existe una variante con ese slug.',
	image_required: 'No puedes activar una variante sin al menos una imagen.',
	not_found: 'La variante no existe o no tienes permiso.',
};

export const toProductVariantError = (error: PostgrestError): Error => {
	if (error.code === '23505') {
		if (error.message.includes('product_variants_slug_key')) {
			return new ProductVariantError('duplicate_slug');
		}

		if (error.message.includes('product_variants_product_id_name_key')) {
			return new ProductVariantError('duplicate_name');
		}
	}

	if (error.code === 'PGRST116') return new ProductVariantError('not_found');

	return error;
};
