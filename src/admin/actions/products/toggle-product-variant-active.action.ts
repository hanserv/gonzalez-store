import {
	ProductVariantError,
	toProductVariantError,
} from '@/admin/errors/product-variant.error';
import {supabase} from '@/supabase/supabase';

interface ToggleProductVariantActiveParams {
	id: string;
	isActive: boolean;
}

export const toggleProductVariantActiveAction = async ({
	id,
	isActive,
}: ToggleProductVariantActiveParams): Promise<void> => {
	if (isActive) {
		const {count, error: imageCountError} = await supabase
			.from('variant_images')
			.select('id', {count: 'exact', head: true})
			.eq('variant_id', id);

		if (imageCountError) throw toProductVariantError(imageCountError);

		if (!count) throw new ProductVariantError('image_required');
	}

	const {data, error} = await supabase
		.from('product_variants')
		.update({is_active: isActive})
		.eq('id', id)
		.select('id');

	if (error) throw toProductVariantError(error);

	if (data.length === 0) throw new ProductVariantError('not_found');
};
