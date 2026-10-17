import {toBrandError} from '@/admin/errors/brand.error';
import {mapBrand, prepareBrandForSave} from '@/admin/mappers/brand.mapper';
import type {Brand, BrandInput} from '@/admin/interfaces/brand.interface';
import {supabase} from '@/supabase/supabase';

interface UpdateBrandParams {
	id: string;
	input: BrandInput;
}

export const updateBrandAction = async ({
	id,
	input,
}: UpdateBrandParams): Promise<Brand> => {
	const {data, error} = await supabase
		.from('brands')
		.update(prepareBrandForSave(input))
		.eq('id', id)
		.select()
		.single();

	if (error) throw toBrandError(error);

	return mapBrand(data);
};
