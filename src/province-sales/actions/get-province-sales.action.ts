import {supabase} from '@/supabase/supabase';
import type {ProvinceSales} from '@/province-sales/interfaces/province-sales.interface';
import {mapProvinceSales} from '@/province-sales/mappers/province-sales.mapper';

export const getProvinceSalesAction = async (): Promise<ProvinceSales[]> => {
	const {data, error} = await supabase
		.from('province_sales_summary')
		.select('id, name, slug, lat, lng, total_sales')
		.order('name', {ascending: true});

	if (error) throw error;

	return (data ?? []).map(mapProvinceSales);
};
