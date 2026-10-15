import type {PostgrestError} from '@supabase/supabase-js';

export type CategoryErrorCode =
	| 'duplicate_name'
	| 'duplicate_slug'
	| 'in_use'
	| 'not_found';

export class CategoryError extends Error {
	readonly code: CategoryErrorCode;

	constructor(code: CategoryErrorCode) {
		super(code);
		this.name = 'CategoryError';
		this.code = code;
	}
}

export const CATEGORY_ERROR_MESSAGES: Record<CategoryErrorCode, string> = {
	duplicate_name: 'Ya existe una categoría con ese nombre.',
	duplicate_slug: 'Ya existe una categoría con ese slug.',
	in_use: 'No se puede eliminar: tiene productos asociados.',
	not_found: 'La categoría no existe o no tienes permiso.',
};

// Traduce un error de Postgres a un error de negocio.
// Si no lo reconoce, devuelve el original sin tocarlo.
export const toCategoryError = (error: PostgrestError): Error => {
	if (error.code === '23505') {
		if (error.message.includes('categories_slug_key')) {
			return new CategoryError('duplicate_slug');
		}
		if (error.message.includes('categories_name_key')) {
			return new CategoryError('duplicate_name');
		}
	}

	if (error.code === '23503') return new CategoryError('in_use');
	if (error.code === 'PGRST116') return new CategoryError('not_found');

	return error;
};
