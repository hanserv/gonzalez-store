import type {ShopCatalogItem} from '@/shop/interfaces/catalog.interface';
import {mapShopCatalogItem} from '@/shop/mappers/catalog.mapper';
import {supabase} from '@/supabase/supabase';

export const getCatalogAction = async (): Promise<ShopCatalogItem[]> => {
	const {data, error} = await supabase
		.from('products')
		.select(
			'id,name,brand_id,category_id,is_popular,brand:brands(name),product_variants!inner(id,slug,name,price,discount_percentage,is_active,display_order,variant_images(path,display_order))',
		)
		.order('created_at', {ascending: false});

	if (error) throw error;

	return data
		.map(mapShopCatalogItem)
		.filter((item) => item.activeVariantCount > 0);
};
