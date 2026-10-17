import type {Brand} from '@/admin/interfaces/brand.interface';
import {toBrandError} from '@/admin/errors/brand.error';
import {mapBrand} from '@/admin/mappers/brand.mapper';
import {supabase} from '@/supabase/supabase';

export const getBrandAction = async (id: string): Promise<Brand> => {
	const {data, error} = await supabase
		.from('brands')
		.select('*')
		.eq('id', id)
		.single();

	if (error) throw toBrandError(error);

	return mapBrand(data);
};
