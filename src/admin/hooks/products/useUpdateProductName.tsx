import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {updateProductNameAction} from '@/admin/actions/products/update-product-name.action';
import {
	PRODUCT_ERROR_MESSAGES,
	ProductError,
} from '@/admin/errors/product.error';

export const useUpdateProductName = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProductNameAction,
		onSuccess: async (_data, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ['products', variables.id],
				}),
				queryClient.invalidateQueries({queryKey: ['products']}),
				queryClient.invalidateQueries({queryKey: ['dashboard']}),
			]);
			toast.success('Nombre del producto actualizado.');
		},
		onError: (error) => {
			toast.error(
				error instanceof ProductError
					? PRODUCT_ERROR_MESSAGES[error.code]
					: 'No se pudo actualizar el nombre del producto.',
			);
		},
	});
};
