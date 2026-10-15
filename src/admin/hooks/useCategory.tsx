import {useQuery} from '@tanstack/react-query';
import {getCategoryAction} from '@/admin/actions/categories/get-category.action';

export const useCategory = (id: string) =>
	useQuery({
		queryKey: ['categories', id],
		queryFn: () => getCategoryAction(id),
		retry: false,
	});
