import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {uploadVariantImagesAction} from '@/admin/actions/products/upload-variant-images.action';
import {
	VARIANT_IMAGE_ERROR_MESSAGES,
	VariantImageError,
} from '@/admin/errors/variant-image.error';

export const useUploadVariantImages = (variantId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (files: File[]) =>
			uploadVariantImagesAction({variantId, files}),
		onSuccess: async (images) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ['product-variants', variantId],
				}),
				queryClient.invalidateQueries({queryKey: ['products']}),
			]);
			toast.success(
				images.length === 1
					? 'Imagen subida.'
					: `${images.length} imágenes subidas.`,
			);
		},
		onError: (error) => {
			toast.error(
				error instanceof VariantImageError
					? VARIANT_IMAGE_ERROR_MESSAGES[error.code]
					: 'No se pudieron subir las imágenes.',
			);
		},
	});
};
