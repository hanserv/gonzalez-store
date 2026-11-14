import type {TopViewedProduct} from '@/admin/interfaces/dashboard.interface';
import {mapDashboardTopViewedProduct} from '@/admin/mappers/dashboard.mapper';
import {supabase} from '@/supabase/supabase';

const TOP_VIEWED_DAYS = 30;
const TOP_VIEWED_LIMIT = 5;

export const getTopViewedProductsAction = async (): Promise<
	TopViewedProduct[]
> => {
	const {data, error} = await supabase.rpc('get_top_viewed_products', {
		p_days: TOP_VIEWED_DAYS,
		p_limit: TOP_VIEWED_LIMIT,
	});

	if (error) throw error;

	return data.map(mapDashboardTopViewedProduct);
};
