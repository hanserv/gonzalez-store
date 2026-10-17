import {toProductVariantError} from '@/admin/errors/product-variant.error';
import {supabase} from '@/supabase/supabase';

interface ReorderProductVariantsParams {
	orderedIds: string[];
}

export const reorderProductVariantsAction = async ({
	orderedIds,
}: ReorderProductVariantsParams): Promise<void> => {
	const results = await Promise.all(
		orderedIds.map((id, index) =>
			supabase
				.from('product_variants')
				.update({display_order: index + 1})
				.eq('id', id)
				.select('id'),
		),
	);

	const failed = results.find((result) => result.error);

	if (failed?.error) throw toProductVariantError(failed.error);
};
