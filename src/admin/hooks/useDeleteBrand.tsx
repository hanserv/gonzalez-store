import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {deleteBrandAction} from '@/admin/actions/brands/delete-brand.action';
import {BRAND_ERROR_MESSAGES, BrandError} from '@/admin/errors/brand.error';

export const useDeleteBrand = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteBrandAction,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['brands']});
			toast.success('Marca eliminada correctamente.');
		},
		onError: (error) => {
			toast.error(
				error instanceof BrandError
					? BRAND_ERROR_MESSAGES[error.code]
					: 'No se pudo eliminar la marca.',
			);
		},
	});
};
