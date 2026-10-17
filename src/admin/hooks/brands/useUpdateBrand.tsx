import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {updateBrandAction} from '@/admin/actions/brands/update-brand.action';
import {BRAND_ERROR_MESSAGES, BrandError} from '@/admin/errors/brand.error';

export const useUpdateBrand = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateBrandAction,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['brands']});
			toast.success('Marca actualizada correctamente.');
		},
		onError: (error) => {
			toast.error(
				error instanceof BrandError
					? BRAND_ERROR_MESSAGES[error.code]
					: 'No se pudo actualizar la marca.',
			);
		},
	});
};
