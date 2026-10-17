import {toProductError} from '@/admin/errors/product.error';
import {mapProductListItem} from '@/admin/mappers/product.mapper';
import type {ProductListItem} from '@/admin/interfaces/product.interface';
import {supabase} from '@/supabase/supabase';

export const getProductsAction = async (): Promise<ProductListItem[]> => {
	const {data, error} = await supabase
		.from('products')
		.select(
			'id,name,brand_id,category_id,created_at,brand:brands(name),category:categories(name),product_variants(is_active,display_order,variant_images(path,display_order),variant_sizes(stock))',
		)
		.order('created_at', {ascending: false});

	if (error) throw toProductError(error);

	return (data ?? []).map(mapProductListItem);
};
