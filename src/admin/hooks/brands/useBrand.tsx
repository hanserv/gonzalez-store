import {useQuery} from '@tanstack/react-query';
import {getBrandAction} from '@/admin/actions/brands/get-brand.action';

export const useBrand = (id: string) =>
	useQuery({
		queryKey: ['brands', id],
		queryFn: () => getBrandAction(id),
		retry: false,
	});
