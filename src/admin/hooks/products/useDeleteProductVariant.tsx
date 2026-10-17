import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {deleteProductVariantAction} from '@/admin/actions/products/delete-product-variant.action';
import {
	PRODUCT_VARIANT_ERROR_MESSAGES,
	ProductVariantError,
} from '@/admin/errors/product-variant.error';

export const useDeleteProductVariant = (productId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProductVariantAction,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['products', productId],
			});
			toast.success('Variante eliminada.');
		},
		onError: (error) => {
			toast.error(
				error instanceof ProductVariantError
					? PRODUCT_VARIANT_ERROR_MESSAGES[error.code]
					: 'No se pudo eliminar la variante.',
			);
		},
	});
};
