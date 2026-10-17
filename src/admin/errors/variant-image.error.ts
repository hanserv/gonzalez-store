export type VariantImageErrorCode =
	| 'invalid_type'
	| 'too_large'
	| 'active_variant'
	| 'upload_failed'
	| 'delete_failed'
	| 'reorder_failed'
	| 'not_found';

export class VariantImageError extends Error {
	readonly code: VariantImageErrorCode;

	constructor(code: VariantImageErrorCode) {
		super(code);
		this.name = 'VariantImageError';
		this.code = code;
	}
}

export const VARIANT_IMAGE_ERROR_MESSAGES: Record<VariantImageErrorCode, string> = {
	invalid_type: 'Formato no permitido. Usa jpeg, png o webp.',
	too_large: 'La imagen supera el límite de 6 MB.',
	active_variant:
		'No puedes eliminar la última imagen de una variante activa. Desactívala primero.',
	upload_failed: 'No se pudo subir la imagen.',
	delete_failed: 'No se pudo eliminar la imagen.',
	reorder_failed: 'No se pudo cambiar el orden de las imágenes.',
	not_found: 'La imagen no existe o no tienes permiso.',
};
