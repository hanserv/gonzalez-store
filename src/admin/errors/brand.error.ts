import type {PostgrestError} from '@supabase/supabase-js';

export type BrandErrorCode =
	| 'duplicate_name'
	| 'duplicate_slug'
	| 'in_use'
	| 'not_found';

export class BrandError extends Error {
	readonly code: BrandErrorCode;

	constructor(code: BrandErrorCode) {
		super(code);
		this.name = 'BrandError';
		this.code = code;
	}
}

export const BRAND_ERROR_MESSAGES: Record<BrandErrorCode, string> = {
	duplicate_name: 'Ya existe una marca con ese nombre.',
	duplicate_slug: 'Ya existe una marca con ese slug.',
	in_use: 'No se puede eliminar: tiene productos asociados.',
	not_found: 'La marca no existe o no tienes permiso.',
};

// Traduce un error de Postgres a un error de negocio.
// Si no lo reconoce, devuelve el original sin tocarlo.
export const toBrandError = (error: PostgrestError): Error => {
	if (error.code === '23505') {
		if (error.message.includes('brands_slug_key')) {
			return new BrandError('duplicate_slug');
		}
		if (error.message.includes('brands_name_key')) {
			return new BrandError('duplicate_name');
		}
	}

	if (error.code === '23503') return new BrandError('in_use');
	if (error.code === 'PGRST116') return new BrandError('not_found');

	return error;
};
