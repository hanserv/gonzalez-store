import type {Brand} from '@/admin/interfaces/brand.interface';
import {mapBrand} from '@/admin/mappers/brand.mapper';
import {supabase} from '@/supabase/supabase';

export const getBrandsAction = async (): Promise<Brand[]> => {
	const {data, error} = await supabase
		.from('brands')
		.select('*')
		.order('created_at', {ascending: false});

	if (error) throw error;

	return data.map(mapBrand);
};
