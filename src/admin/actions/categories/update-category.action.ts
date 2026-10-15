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

interface UpdateCategoryParams {
	id: string;
	input: CategoryInput;
}

export const updateCategoryAction = async ({
	id,
	input,
}: UpdateCategoryParams): Promise<Category> => {
	const {data, error} = await supabase
		.from('categories')
		.update(prepareCategoryForSave(input))
		.eq('id', id)
		.select()
		.single();

	if (error) throw toCategoryError(error);

	return mapCategory(data);
};
