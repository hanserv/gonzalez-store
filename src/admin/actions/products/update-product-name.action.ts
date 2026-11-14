import {ProductError, toProductError} from '@/admin/errors/product.error';
import {supabase} from '@/supabase/supabase';

interface UpdateProductNameParams {
	id: string;
	name: string;
}

export const updateProductNameAction = async ({
	id,
	name,
}: UpdateProductNameParams): Promise<void> => {
	const {data, error} = await supabase
		.from('products')
		.update({name: name.trim()})
		.eq('id', id)
		.select('id');

	if (error) throw toProductError(error);

	if (data.length === 0) throw new ProductError('not_found');
};
