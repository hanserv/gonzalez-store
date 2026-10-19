import {useQuery} from '@tanstack/react-query';
import {getProductAction} from '@/admin/actions/products/get-product.action';

export const useProduct = (id: string) =>
	useQuery({
		queryKey: ['products', id],
		queryFn: () => getProductAction(id),
		retry: false,
	});
