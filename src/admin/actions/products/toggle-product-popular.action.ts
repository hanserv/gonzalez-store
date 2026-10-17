import {ProductError, toProductError} from '@/admin/errors/product.error';
import {supabase} from '@/supabase/supabase';

interface ToggleProductPopularParams {
	id: string;
	isPopular: boolean;
}

export const toggleProductPopularAction = async ({
	id,
	isPopular,
}: ToggleProductPopularParams): Promise<void> => {
	const {data, error} = await supabase
		.from('products')
		.update({is_popular: isPopular})
		.eq('id', id)
		.select('id');

	if (error) throw toProductError(error);

	if (data.length === 0) throw new ProductError('not_found');
};
