import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {createCategoryAction} from '@/admin/actions/categories/create-category.action';
import {
	CATEGORY_ERROR_MESSAGES,
	CategoryError,
} from '@/admin/errors/category.error';

export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createCategoryAction,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['categories']});
			toast.success('Categoría creada correctamente.');
		},
		onError: (error) => {
			toast.error(
				error instanceof CategoryError
					? CATEGORY_ERROR_MESSAGES[error.code]
					: 'No se pudo crear la categoría.',
			);
		},
	});
};
