import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {deleteCategoryAction} from '@/admin/actions/categories/delete-category.action';
import {
	CATEGORY_ERROR_MESSAGES,
	CategoryError,
} from '@/admin/errors/category.error';

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCategoryAction,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['categories']});
			queryClient.invalidateQueries({queryKey: ['dashboard']});
			toast.success('Categoría eliminada correctamente.');
		},
		onError: (error) => {
			toast.error(
				error instanceof CategoryError
					? CATEGORY_ERROR_MESSAGES[error.code]
					: 'No se pudo eliminar la categoría.',
			);
		},
	});
};
