import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {toggleProductPopularAction} from '@/admin/actions/products/toggle-product-popular.action';
import {
	PRODUCT_ERROR_MESSAGES,
	ProductError,
} from '@/admin/errors/product.error';

export const useToggleProductPopular = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: toggleProductPopularAction,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({queryKey: ['products']}),
				queryClient.invalidateQueries({queryKey: ['dashboard']}),
			]);
			toast.success('Estado popular actualizado.');
		},
		onError: (error) => {
			toast.error(
				error instanceof ProductError
					? PRODUCT_ERROR_MESSAGES[error.code]
					: 'No se pudo actualizar el estado popular.',
			);
		},
	});
};
