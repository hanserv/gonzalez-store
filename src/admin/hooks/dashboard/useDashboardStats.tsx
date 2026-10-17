import {useQuery} from '@tanstack/react-query';
import {getDashboardStatsAction} from '@/admin/actions/dashboard/get-dashboard-stats.action';

export const useDashboardStats = () =>
	useQuery({
		queryKey: ['dashboard', 'stats'],
		queryFn: getDashboardStatsAction,
	});
