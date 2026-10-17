import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {toggleProductVariantActiveAction} from '@/admin/actions/products/toggle-product-variant-active.action';
import {
	PRODUCT_VARIANT_ERROR_MESSAGES,
	ProductVariantError,
} from '@/admin/errors/product-variant.error';

export const useToggleProductVariantActive = (productId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: toggleProductVariantActiveAction,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({queryKey: ['products', productId]}),
				queryClient.invalidateQueries({queryKey: ['products']}),
			]);
			toast.success('Estado de la variante actualizado.');
		},
		onError: (error) => {
			toast.error(
				error instanceof ProductVariantError
					? PRODUCT_VARIANT_ERROR_MESSAGES[error.code]
					: 'No se pudo actualizar el estado de la variante.',
			);
		},
	});
};
