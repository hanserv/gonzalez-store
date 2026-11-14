import {useQuery} from '@tanstack/react-query';
import {getTopViewedProductsAction} from '@/admin/actions/dashboard/get-top-viewed-products.action';

export const useDashboardTopViewedProducts = () =>
	useQuery({
		queryKey: ['dashboard', 'top-viewed-products'],
		queryFn: getTopViewedProductsAction,
		refetchOnWindowFocus: true,
	});
