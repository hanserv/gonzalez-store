import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {createProvinceSalesEntryAction} from '@/province-sales/actions/create-province-sales-entry.action';
import {
	PROVINCE_SALES_ERROR_MESSAGES,
	ProvinceSalesError,
} from '@/province-sales/errors/province-sales.error';

export const useAddProvinceSales = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createProvinceSalesEntryAction,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['province-sales']});
			toast.success('Ventas registradas.');
		},
		onError: (error) => {
			toast.error(
				error instanceof ProvinceSalesError
					? PROVINCE_SALES_ERROR_MESSAGES[error.code]
					: 'No se pudieron registrar las ventas.',
			);
		},
	});
};
