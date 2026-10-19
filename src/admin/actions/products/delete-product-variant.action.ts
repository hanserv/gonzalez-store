import {
	ProductVariantError,
	toProductVariantError,
} from '@/admin/errors/product-variant.error';
import {PRODUCT_IMAGES_BUCKET} from '@/admin/mappers/product-variant.mapper';
import {supabase} from '@/supabase/supabase';

const VARIANT_IMAGES_FOLDER = 'variants';

export const deleteProductVariantAction = async (id: string): Promise<void> => {
	const {data: images, error: imagesError} = await supabase
		.from('variant_images')
		.select('path')
		.eq('variant_id', id);

	if (imagesError) throw toProductVariantError(imagesError);

	const paths = (images ?? []).map((image) => image.path);

	if (paths.length > 0) {
		const {data: removedImages, error: storageError} = await supabase.storage
			.from(PRODUCT_IMAGES_BUCKET)
			.remove(paths);

		if (storageError) throw new ProductVariantError('delete_failed');

		// Storage devuelve 200 con una lista vacía si RLS no autoriza el borrado
		// (sin error). Sin esta comprobación las filas se borrarían y los
		// archivos quedarían huérfanos en el bucket.
		if (!removedImages || removedImages.length === 0) {
			throw new ProductVariantError('delete_failed');
		}
	}

	// Antes de borrar las filas, confirma que la carpeta quedó vacía. Así un
	// reintento tras un fallo parcial no se bloquea: las filas siguen ahí y
	// los paths se pueden volver a intentar.
	const {data: remainingFiles, error: listError} = await supabase.storage
		.from(PRODUCT_IMAGES_BUCKET)
		.list(`${VARIANT_IMAGES_FOLDER}/${id}`);

	if (listError) throw new ProductVariantError('delete_failed');

	if ((remainingFiles ?? []).length > 0) {
		throw new ProductVariantError('delete_failed');
	}

	const {data, error} = await supabase
		.from('product_variants')
		.delete()
		.eq('id', id)
		.select('id');

	if (error) throw toProductVariantError(error);

	if (data.length === 0) throw new ProductVariantError('not_found');
};
