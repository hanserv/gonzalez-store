import {useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import {getCartVariantsAction} from '@/shop/actions/cart/get-cart-variants.action';
import {useCartStore} from '@/shop/stores/cart.store';

export const useCartValidation = (enabled: boolean) => {
	const items = useCartStore((state) => state.items);
	const variantIds = useMemo(
		() => [...new Set(items.map((item) => item.variantId))].sort(),
		[items],
	);

	return useQuery({
		queryKey: ['shop', 'cart-validation', variantIds],
		queryFn: () => getCartVariantsAction(variantIds),
		enabled: enabled && variantIds.length > 0,
		staleTime: 0,
	});
};
