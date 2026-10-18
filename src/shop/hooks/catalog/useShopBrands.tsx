import {useQuery} from '@tanstack/react-query';
import {getShopBrandsAction} from '@/shop/actions/catalog/get-shop-brands.action';

export const useShopBrands = () =>
	useQuery({
		queryKey: ['shop', 'brands'],
		queryFn: getShopBrandsAction,
	});
