import {toProductError} from '@/admin/errors/product.error';
import {
	mapProduct,
	prepareProductForSave,
} from '@/admin/mappers/product.mapper';
import type {Product, ProductInput} from '@/admin/interfaces/product.interface';
import {supabase} from '@/supabase/supabase';

export const createProductAction = async (
	input: ProductInput,
): Promise<Product> => {
	const {data, error} = await supabase
		.from('products')
		.insert(prepareProductForSave(input))
		.select()
		.single();

	if (error) throw toProductError(error);

	return mapProduct(data);
};
