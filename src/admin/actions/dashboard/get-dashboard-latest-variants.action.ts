import type {DashboardLatestVariant} from '@/admin/interfaces/dashboard.interface';
import {mapDashboardLatestVariant} from '@/admin/mappers/dashboard.mapper';
import {supabase} from '@/supabase/supabase';

const LATEST_VARIANTS_LIMIT = 5;

export const getDashboardLatestVariantsAction = async (): Promise<
	DashboardLatestVariant[]
> => {
	const {data, error} = await supabase
		.from('product_variants')
		.select(
			'id,name,price,discount_percentage,is_active,created_at,product:products(name,category:categories(name))',
		)
		.order('created_at', {ascending: false})
		.limit(LATEST_VARIANTS_LIMIT);

	if (error) throw error;

	return data.map(mapDashboardLatestVariant);
};
