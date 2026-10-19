import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {deleteVariantImageAction} from '@/admin/actions/products/delete-variant-image.action';
import {
	VARIANT_IMAGE_ERROR_MESSAGES,
	VariantImageError,
} from '@/admin/errors/variant-image.error';

interface DeleteVariantImageVariables {
	id: string;
	path: string;
}

export const useDeleteVariantImage = (variantId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({id, path}: DeleteVariantImageVariables) =>
			deleteVariantImageAction({id, variantId, path}),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ['product-variants', variantId],
				}),
				queryClient.invalidateQueries({queryKey: ['products']}),
			]);
			toast.success('Imagen eliminada.');
		},
		onError: (error) => {
			toast.error(
				error instanceof VariantImageError
					? VARIANT_IMAGE_ERROR_MESSAGES[error.code]
					: 'No se pudo eliminar la imagen.',
			);
		},
	});
};
