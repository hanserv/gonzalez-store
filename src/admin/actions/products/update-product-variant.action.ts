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

interface UpdateProductVariantParams {
	id: string;
	input: ProductVariantInput;
}

export const updateProductVariantAction = async ({
	id,
	input,
}: UpdateProductVariantParams): Promise<ProductVariant> => {
	const {error: updateError} = await supabase
		.from('product_variants')
		.update(prepareProductVariantForSave(input))
		.eq('id', id);

	if (updateError) throw toProductVariantError(updateError);

	const {error: deleteSizesError} = await supabase
		.from('variant_sizes')
		.delete()
		.eq('variant_id', id);

	if (deleteSizesError) throw deleteSizesError;

	const {error: insertSizesError} = await supabase.from('variant_sizes').insert(
		prepareProductVariantSizesForSave(input.sizes).map((size) => ({
			variant_id: id,
			...size,
		})),
	);

	if (insertSizesError) throw insertSizesError;

	const {data, error} = await supabase
		.from('product_variants')
		.select(
			'id,product_id,name,slug,description,price,discount_percentage,is_active,display_order,created_at,variant_images(id,path,display_order),variant_sizes(id,size,stock)',
		)
		.eq('id', id)
		.single();

	if (error) throw toProductVariantError(error);

	return mapProductVariant(data);
};
