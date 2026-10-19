import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {reorderVariantImagesAction} from '@/admin/actions/products/reorder-variant-images.action';
import {
	VARIANT_IMAGE_ERROR_MESSAGES,
	VariantImageError,
} from '@/admin/errors/variant-image.error';

export const useReorderVariantImages = (variantId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderedIds: string[]) =>
			reorderVariantImagesAction({orderedIds}),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ['product-variants', variantId],
				}),
				queryClient.invalidateQueries({queryKey: ['products']}),
			]);
		},
		onError: (error) => {
			toast.error(
				error instanceof VariantImageError
					? VARIANT_IMAGE_ERROR_MESSAGES[error.code]
					: 'No se pudo cambiar el orden de las imágenes.',
			);
		},
	});
};
