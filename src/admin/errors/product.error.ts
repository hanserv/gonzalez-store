import type {PostgrestError} from '@supabase/supabase-js';

export type ProductErrorCode = 'duplicate_name' | 'not_found';

export class ProductError extends Error {
	readonly code: ProductErrorCode;

	constructor(code: ProductErrorCode) {
		super(code);
		this.name = 'ProductError';
		this.code = code;
	}
}

export const PRODUCT_ERROR_MESSAGES: Record<ProductErrorCode, string> = {
	duplicate_name: 'Ya existe un producto con ese nombre para esa marca.',
	not_found: 'El producto no existe o no tienes permiso.',
};

export const toProductError = (error: PostgrestError): Error => {
	if (
		error.code === '23505' &&
		error.message.includes('products_brand_id_name_key')
	) {
		return new ProductError('duplicate_name');
	}

	if (error.code === 'PGRST116') return new ProductError('not_found');

	return error;
};
