import {toProductVariantError} from '@/admin/errors/product-variant.error';
import {
	mapProductVariant,
	prepareProductVariantForSave,
	prepareProductVariantSizesForSave,
} from '@/admin/mappers/product-variant.mapper';
import type {
	ProductVariant,
	ProductVariantInput,
} from '@/admin/interfaces/product-variant.interface';
import {supabase} from '@/supabase/supabase';

export const createProductVariantAction = async (
	input: ProductVariantInput,
): Promise<ProductVariant> => {
	const {data, error} = await supabase
		.from('product_variants')
		.insert(prepareProductVariantForSave(input))
		.select(
			'id,product_id,name,slug,description,price,discount_percentage,is_active,display_order,created_at,variant_images(id,path,display_order),variant_sizes(id,size,stock)',
		)
		.single();

	if (error) throw toProductVariantError(error);

	const variant = mapProductVariant(data);

	const {error: sizesError} = await supabase.from('variant_sizes').insert(
		prepareProductVariantSizesForSave(input.sizes).map((size) => ({
			variant_id: variant.id,
			...size,
		})),
	);

	if (sizesError) throw sizesError;

	const {data: refreshedVariant, error: refreshError} = await supabase
		.from('product_variants')
		.select(
			'id,product_id,name,slug,description,price,discount_percentage,is_active,display_order,created_at,variant_images(id,path,display_order),variant_sizes(id,size,stock)',
		)
		.eq('id', variant.id)
		.single();

	if (refreshError) throw toProductVariantError(refreshError);

	return mapProductVariant(refreshedVariant);
};
