import {toProductVariantError} from '@/admin/errors/product-variant.error';
import {mapProductVariant} from '@/admin/mappers/product-variant.mapper';
import type {ProductVariant} from '@/admin/interfaces/product-variant.interface';
import {supabase} from '@/supabase/supabase';

export const getProductVariantAction = async (
	id: string,
): Promise<ProductVariant> => {
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
