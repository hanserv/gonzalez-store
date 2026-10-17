import {toProductError} from '@/admin/errors/product.error';
import {mapProductDetail} from '@/admin/mappers/product.mapper';
import type {ProductDetail} from '@/admin/interfaces/product.interface';
import {supabase} from '@/supabase/supabase';

export const getProductAction = async (id: string): Promise<ProductDetail> => {
	const {data, error} = await supabase
		.from('products')
		.select(
			'id,name,brand_id,category_id,created_at,brand:brands(name),category:categories(name),product_variants(id,product_id,name,slug,description,price,discount_percentage,is_active,display_order,created_at,variant_images(id,path,display_order),variant_sizes(id,size,stock))',
		)
		.eq('id', id)
		.single();

	if (error) throw toProductError(error);

	return mapProductDetail(data);
};
