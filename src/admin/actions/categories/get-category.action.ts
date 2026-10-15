import {supabase} from '@/supabase/supabase';
import {toCategoryError} from '@/admin/errors/category.error';
import {mapCategory} from '@/admin/mappers/category.mapper';
import type {Category} from '@/admin/interfaces/category.interface';

export const getCategoryAction = async (id: string): Promise<Category> => {
	const {data, error} = await supabase
		.from('categories')
		.select('*')
		.eq('id', id)
		.single();

	if (error) throw toCategoryError(error);

	return mapCategory(data);
};
