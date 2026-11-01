import type {ShopCartVariant} from '@/shop/interfaces/cart.interface';
import {mapShopCartVariant} from '@/shop/mappers/cart.mapper';
import {supabase} from '@/supabase/supabase';

export const getCartVariantsAction = async (
	variantIds: string[],
): Promise<ShopCartVariant[]> => {
	if (variantIds.length === 0) return [];

	const {data, error} = await supabase
		.from('product_variants')
		.select(
			'id,name,slug,price,discount_percentage,product:products(name,brand:brands(name)),variant_images(path,display_order),variant_sizes(id,size,stock)',
		)
		.in('id', variantIds)
		.eq('is_active', true);

	if (error) throw error;

	return (data ?? []).map(mapShopCartVariant);
};
