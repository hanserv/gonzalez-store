import {VariantImageError} from '@/admin/errors/variant-image.error';
import {supabase} from '@/supabase/supabase';

interface ReorderVariantImagesParams {
	orderedIds: string[];
}

export const reorderVariantImagesAction = async ({
	orderedIds,
}: ReorderVariantImagesParams): Promise<void> => {
	const results = await Promise.all(
		orderedIds.map((id, index) =>
			supabase
				.from('variant_images')
				.update({display_order: index + 1})
				.eq('id', id)
				.select('id'),
		),
	);

	const failed = results.find((result) => result.error);

	if (failed?.error) throw new VariantImageError('reorder_failed');
};
