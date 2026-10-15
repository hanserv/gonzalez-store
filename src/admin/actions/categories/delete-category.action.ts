import {supabase} from '@/supabase/supabase';
import {CategoryError, toCategoryError} from '@/admin/errors/category.error';

export const deleteCategoryAction = async (id: string): Promise<void> => {
	const {data, error} = await supabase
		.from('categories')
		.delete()
		.eq('id', id)
		.select('id');

	if (error) throw toCategoryError(error);

	// Si el id no existe o RLS lo bloquea, Supabase devuelve 0 filas
	if (data.length === 0) throw new CategoryError('not_found');
};
