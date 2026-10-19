import {VariantImageError} from '@/admin/errors/variant-image.error';
import {PRODUCT_IMAGES_BUCKET} from '@/admin/mappers/product-variant.mapper';
import {supabase} from '@/supabase/supabase';

interface DeleteVariantImageParams {
	id: string;
	variantId: string;
	path: string;
}

export const deleteVariantImageAction = async ({
	id,
	variantId,
	path,
}: DeleteVariantImageParams): Promise<void> => {
	const {count, error: countError} = await supabase
		.from('variant_images')
		.select('id', {count: 'exact', head: true})
		.eq('variant_id', variantId);

	if (countError) throw new VariantImageError('delete_failed');

	if (count === 1) {
		const {data: variant, error: variantError} = await supabase
			.from('product_variants')
			.select('is_active')
			.eq('id', variantId)
			.single();

		if (variantError) throw new VariantImageError('delete_failed');

		if (variant?.is_active) throw new VariantImageError('active_variant');
	}

	const {data: removedImages, error: storageError} = await supabase.storage
		.from(PRODUCT_IMAGES_BUCKET)
		.remove([path]);

	if (storageError) throw new VariantImageError('delete_failed');

	// Storage devuelve 200 con una lista vacía si RLS no autoriza el borrado
	// (sin error). Sin esta comprobación la fila se borraría y el archivo
	// quedaría huérfano en el bucket.
	if (!removedImages || removedImages.length === 0) {
		throw new VariantImageError('delete_failed');
	}

	const {data, error} = await supabase
		.from('variant_images')
		.delete()
		.eq('id', id)
		.select('id');

	if (error) throw new VariantImageError('delete_failed');

	if (data.length === 0) throw new VariantImageError('not_found');
};
