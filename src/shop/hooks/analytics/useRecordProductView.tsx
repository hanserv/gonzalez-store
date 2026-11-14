import {useEffect} from 'react';
import {recordProductViewAction} from '@/shop/actions/analytics/record-product-view.action';

export const useRecordProductView = (
	variantId: string | undefined,
	productId: string | undefined,
) => {
	useEffect(() => {
		if (!variantId || !productId) return;

		void recordProductViewAction(variantId, productId);
	}, [variantId, productId]);
};
