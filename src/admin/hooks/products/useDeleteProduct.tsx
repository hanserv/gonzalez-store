import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {deleteProductAction} from '@/admin/actions/products/delete-product.action';
import {
	PRODUCT_ERROR_MESSAGES,
	ProductError,
} from '@/admin/errors/product.error';

export const useDeleteProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProductAction,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['products']});
			toast.success('Producto eliminado correctamente.');
		},
		onError: (error) => {
			toast.error(
				error instanceof ProductError
					? PRODUCT_ERROR_MESSAGES[error.code]
					: 'No se pudo eliminar el producto.',
			);
		},
	});
};
