import {useQuery} from '@tanstack/react-query';
import {getProductVariantAction} from '@/admin/actions/products/get-product-variant.action';

export const useProductVariant = (id: string) =>
	useQuery({
		queryKey: ['product-variants', id],
		queryFn: () => getProductVariantAction(id),
		retry: false,
	});
