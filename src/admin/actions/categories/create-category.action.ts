import {supabase} from '@/supabase/supabase';
import {toCategoryError} from '@/admin/errors/category.error';
import {
	mapCategory,
	prepareCategoryForSave,
} from '@/admin/mappers/category.mapper';
import type {
	Category,
	CategoryInput,
} from '@/admin/interfaces/category.interface';

export const createCategoryAction = async (
	input: CategoryInput,
): Promise<Category> => {
	const {data, error} = await supabase
		.from('categories')
		.insert(prepareCategoryForSave(input))
		.select()
		.single();

	if (error) throw toCategoryError(error);

	return mapCategory(data);
};
