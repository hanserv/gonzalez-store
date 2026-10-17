import {mapProductListItem} from '@/admin/mappers/product.mapper';
import type {ProductListItem} from '@/admin/interfaces/product.interface';
import {supabase} from '@/supabase/supabase';

export const getProductsAction = async (): Promise<ProductListItem[]> => {
	const {data, error} = await supabase
		.from('products')
		.select(
			'id,name,brand_id,category_id,created_at,brand:brands(name),category:categories(name),product_variants(is_active,variant_sizes(stock))',
		)
		.order('created_at', {ascending: false});

	if (error) throw error;

	return (data ?? []).map(mapProductListItem);
};
