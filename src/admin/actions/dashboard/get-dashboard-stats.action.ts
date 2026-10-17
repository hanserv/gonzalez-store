import type {DashboardStats} from '@/admin/interfaces/dashboard.interface';
import {mapDashboardStats} from '@/admin/mappers/dashboard.mapper';
import {supabase} from '@/supabase/supabase';

export const getDashboardStatsAction = async (): Promise<DashboardStats> => {
	const {data, error} = await supabase.rpc('get_dashboard_stats');

	if (error) throw error;

	const row = data[0];

	if (!row) throw new Error('get_dashboard_stats returned no rows');

	return mapDashboardStats(row);
};
