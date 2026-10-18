import {useQuery} from '@tanstack/react-query';
import {getShopCategoriesAction} from '@/shop/actions/catalog/get-shop-categories.action';

export const useShopCategories = () =>
	useQuery({
		queryKey: ['shop', 'categories'],
		queryFn: getShopCategoriesAction,
	});
