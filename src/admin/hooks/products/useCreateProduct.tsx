import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {createProductAction} from '@/admin/actions/products/create-product.action';
import {
	PRODUCT_ERROR_MESSAGES,
	ProductError,
} from '@/admin/errors/product.error';

export const useCreateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createProductAction,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['products']});
			queryClient.invalidateQueries({queryKey: ['dashboard']});
			toast.success('Producto creado correctamente.');
		},
		onError: (error) => {
			toast.error(
				error instanceof ProductError
					? PRODUCT_ERROR_MESSAGES[error.code]
					: 'No se pudo crear el producto.',
			);
		},
	});
};
