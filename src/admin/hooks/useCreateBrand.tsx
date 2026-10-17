import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {createBrandAction} from '@/admin/actions/brands/create-brand.action';
import {BRAND_ERROR_MESSAGES, BrandError} from '@/admin/errors/brand.error';

export const useCreateBrand = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createBrandAction,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['brands']});
			toast.success('Marca creada correctamente.');
		},
		onError: (error) => {
			toast.error(
				error instanceof BrandError
					? BRAND_ERROR_MESSAGES[error.code]
					: 'No se pudo crear la marca.',
			);
		},
	});
};
