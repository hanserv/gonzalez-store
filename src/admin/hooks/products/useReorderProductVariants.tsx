import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {reorderProductVariantsAction} from '@/admin/actions/products/reorder-product-variants.action';

export const useReorderProductVariants = (productId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: reorderProductVariantsAction,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({queryKey: ['products', productId]}),
				queryClient.invalidateQueries({queryKey: ['products']}),
			]);
		},
		onError: () => {
			toast.error('No se pudo cambiar el orden de las variantes.');
		},
	});
};
