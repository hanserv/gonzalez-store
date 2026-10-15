import type {Category} from '@/admin/interfaces/category.interface';
import {mapCategory} from '@/admin/mappers/category.mapper';
import {supabase} from '@/supabase/supabase';

export const getCategoriesAction = async (): Promise<Category[]> => {
	const {data, error} = await supabase
		.from('categories')
		.select('*')
		.order('created_at', {ascending: false});

	if (error) throw error;

	return data.map(mapCategory);
};
