import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {updateProductVariantAction} from '@/admin/actions/products/update-product-variant.action';
import {
	PRODUCT_VARIANT_ERROR_MESSAGES,
	ProductVariantError,
} from '@/admin/errors/product-variant.error';

export const useUpdateProductVariant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProductVariantAction,
		onSuccess: async (variant) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ['product-variants', variant.id],
				}),
				queryClient.invalidateQueries({
					queryKey: ['products', variant.productId],
				}),
				queryClient.invalidateQueries({queryKey: ['products']}),
				queryClient.invalidateQueries({queryKey: ['dashboard']}),
			]);
			toast.success('Variante actualizada correctamente.');
		},
		onError: (error) => {
			toast.error(
				error instanceof ProductVariantError
					? PRODUCT_VARIANT_ERROR_MESSAGES[error.code]
					: 'No se pudo actualizar la variante.',
			);
		},
	});
};
