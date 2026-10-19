import {ProductError, toProductError} from '@/admin/errors/product.error';
import {supabase} from '@/supabase/supabase';

export const deleteProductAction = async (id: string): Promise<void> => {
	const {data, error} = await supabase
		.from('products')
		.delete()
		.eq('id', id)
		.select('id');

	if (error) throw toProductError(error);

	if (data.length === 0) throw new ProductError('not_found');
};
