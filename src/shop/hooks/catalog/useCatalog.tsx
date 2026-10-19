import {useQuery} from '@tanstack/react-query';
import {getCatalogAction} from '@/shop/actions/catalog/get-catalog.action';

export const useCatalog = () =>
	useQuery({
		queryKey: ['shop', 'catalog'],
		queryFn: getCatalogAction,
	});
