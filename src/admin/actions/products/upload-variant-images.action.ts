import {VariantImageError} from '@/admin/errors/variant-image.error';
import {
	PRODUCT_IMAGES_BUCKET,
	mapVariantImage,
} from '@/admin/mappers/product-variant.mapper';
import type {ProductVariantImage} from '@/admin/interfaces/product-variant.interface';
import {getImageValidationError, compressImageToWebp} from '@/lib/image';
import {supabase} from '@/supabase/supabase';

interface UploadVariantImagesParams {
	variantId: string;
	files: File[];
}

export const uploadVariantImagesAction = async ({
	variantId,
	files,
}: UploadVariantImagesParams): Promise<ProductVariantImage[]> => {
	if (files.length === 0) return [];

	for (const file of files) {
		const validationError = getImageValidationError(file);

		if (validationError) throw new VariantImageError(validationError);
	}

	const {data: lastImage, error: lastImageError} = await supabase
		.from('variant_images')
		.select('display_order')
		.eq('variant_id', variantId)
		.order('display_order', {ascending: false})
		.limit(1)
		.maybeSingle();

	if (lastImageError) throw new VariantImageError('upload_failed');

	let nextOrder = (lastImage?.display_order ?? 0) + 1;
	const uploadedImages: ProductVariantImage[] = [];

	for (const file of files) {
		const blob = await compressImageToWebp(file);
		const path = `variants/${variantId}/${crypto.randomUUID()}.webp`;

		const {error: uploadError} = await supabase.storage
			.from(PRODUCT_IMAGES_BUCKET)
			.upload(path, blob, {
				contentType: 'image/webp',
				cacheControl: '31536000',
				upsert: false,
			});

		if (uploadError) throw new VariantImageError('upload_failed');

		const {data, error} = await supabase
			.from('variant_images')
			.insert({variant_id: variantId, path, display_order: nextOrder})
			.select('id,path,display_order')
			.single();

		if (error) {
			await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([path]);
			throw new VariantImageError('upload_failed');
		}

		nextOrder += 1;
		uploadedImages.push(mapVariantImage(data));
	}

	return uploadedImages;
};
