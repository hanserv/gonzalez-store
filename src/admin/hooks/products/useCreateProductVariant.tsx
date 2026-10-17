import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {createProductVariantAction} from '@/admin/actions/products/create-product-variant.action';
import {
	PRODUCT_VARIANT_ERROR_MESSAGES,
	ProductVariantError,
} from '@/admin/errors/product-variant.error';

export const useCreateProductVariant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createProductVariantAction,
		onSuccess: async (variant) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ['products', variant.productId],
				}),
				queryClient.invalidateQueries({queryKey: ['products']}),
				queryClient.invalidateQueries({queryKey: ['dashboard']}),
			]);
			toast.success('Variante creada correctamente.');
		},
		onError: (error) => {
			toast.error(
				error instanceof ProductVariantError
					? PRODUCT_VARIANT_ERROR_MESSAGES[error.code]
					: 'No se pudo crear la variante.',
			);
		},
	});
};
