import type {PostgrestError} from '@supabase/supabase-js';

export type ProvinceSalesErrorCode =
	| 'not_authorized'
	| 'invalid_quantity'
	| 'not_found';

export class ProvinceSalesError extends Error {
	readonly code: ProvinceSalesErrorCode;

	constructor(code: ProvinceSalesErrorCode) {
		super(code);
		this.name = 'ProvinceSalesError';
		this.code = code;
	}
}

export const PROVINCE_SALES_ERROR_MESSAGES: Record<
	ProvinceSalesErrorCode,
	string
> = {
	not_authorized: 'No tienes permiso para registrar ventas.',
	invalid_quantity: 'La cantidad no es válida.',
	not_found: 'La provincia ya no existe.',
};

export const toProvinceSalesError = (error: PostgrestError): Error => {
	if (error.code === '42501') return new ProvinceSalesError('not_authorized');
	if (error.code === '23514') return new ProvinceSalesError('invalid_quantity');

	if (
		error.code === '23503' &&
		error.message.includes('province_sales_entries_province_id_fkey')
	) {
		return new ProvinceSalesError('not_found');
	}

	return error;
};
