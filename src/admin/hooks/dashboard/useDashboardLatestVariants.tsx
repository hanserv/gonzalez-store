import {useQuery} from '@tanstack/react-query';
import {getDashboardLatestVariantsAction} from '@/admin/actions/dashboard/get-dashboard-latest-variants.action';

export const useDashboardLatestVariants = () =>
	useQuery({
		queryKey: ['dashboard', 'latest-variants'],
		queryFn: getDashboardLatestVariantsAction,
	});
