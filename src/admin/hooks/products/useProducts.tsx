import {useQuery} from '@tanstack/react-query';
import {getProductsAction} from '@/admin/actions/products/get-products.action';

export const useProducts = () =>
	useQuery({
		queryKey: ['products'],
		queryFn: getProductsAction,
	});
