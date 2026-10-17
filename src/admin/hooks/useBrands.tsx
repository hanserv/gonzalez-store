import {useQuery} from '@tanstack/react-query';
import {getBrandsAction} from '@/admin/actions/brands/get-brands.action';

export const useBrands = () =>
	useQuery({
		queryKey: ['brands'],
		queryFn: getBrandsAction,
	});
