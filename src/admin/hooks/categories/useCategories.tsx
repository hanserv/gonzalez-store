import {useQuery} from '@tanstack/react-query';
import {getCategoriesAction} from '@/admin/actions/categories/get-categories.action';

export const useCategories = () =>
	useQuery({
		queryKey: ['categories'],
		queryFn: getCategoriesAction,
	});
