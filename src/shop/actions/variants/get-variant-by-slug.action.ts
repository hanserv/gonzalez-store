import type {ShopVariantDetail} from '@/shop/interfaces/variant.interface';
import {mapShopVariantDetail} from '@/shop/mappers/variant.mapper';
import {supabase} from '@/supabase/supabase';

export const getVariantBySlugAction = async (
	slug: string,
): Promise<ShopVariantDetail | null> => {
	const {data, error} = await supabase
		.from('product_variants')
		.select(
			'id,product_id,name,slug,description,price,discount_percentage,is_active,display_order,created_at,product:products(id,name,brand:brands(name),product_variants(id,slug,name,display_order,is_active,variant_images(path,display_order))),variant_images(id,path,display_order),variant_sizes(id,size,stock)',
		)
		.eq('slug', slug)
		.maybeSingle();

	if (error) throw error;

	if (!data) return null;

	return mapShopVariantDetail(data);
};
