import {supabase} from '@/supabase/supabase';
import {toBrandError} from '@/admin/errors/brand.error';
import {mapBrand, prepareBrandForSave} from '@/admin/mappers/brand.mapper';
import type {Brand, BrandInput} from '@/admin/interfaces/brand.interface';

export const createBrandAction = async (input: BrandInput): Promise<Brand> => {
	const {data, error} = await supabase
		.from('brands')
		.insert(prepareBrandForSave(input))
		.select()
		.single();

	if (error) throw toBrandError(error);

	return mapBrand(data);
};
