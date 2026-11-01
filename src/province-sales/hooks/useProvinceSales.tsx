import {useQuery} from '@tanstack/react-query';
import {getProvinceSalesAction} from '@/province-sales/actions/get-province-sales.action';

export const useProvinceSales = () =>
	useQuery({
		queryKey: ['province-sales'],
		queryFn: getProvinceSalesAction,
	});
