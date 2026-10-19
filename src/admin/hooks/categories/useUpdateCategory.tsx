import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {updateCategoryAction} from '@/admin/actions/categories/update-category.action';
import {
	CATEGORY_ERROR_MESSAGES,
	CategoryError,
} from '@/admin/errors/category.error';

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateCategoryAction,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['categories']});
			queryClient.invalidateQueries({queryKey: ['dashboard']});
			toast.success('Categoría actualizada correctamente.');
		},
		onError: (error) => {
			toast.error(
				error instanceof CategoryError
					? CATEGORY_ERROR_MESSAGES[error.code]
					: 'No se pudo actualizar la categoría.',
			);
		},
	});
};
