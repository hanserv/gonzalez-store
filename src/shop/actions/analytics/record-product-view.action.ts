import {supabase} from '@/supabase/supabase';

const VIEW_DEDUPE_WINDOW_MS = 5 * 60 * 1000;
const VIEW_STORAGE_PREFIX = 'gonzalez-product-view';
const viewsInFlight = new Set<string>();

const getStorageKey = (productId: string) =>
	`${VIEW_STORAGE_PREFIX}-${productId}`;

const wasRecentlyViewed = (productId: string) => {
	try {
		const lastViewedAt = Number(localStorage.getItem(getStorageKey(productId)));

		return (
			Number.isFinite(lastViewedAt) &&
			Date.now() - lastViewedAt < VIEW_DEDUPE_WINDOW_MS
		);
	} catch {
		return true;
	}
};

const markAsViewed = (productId: string) => {
	try {
		localStorage.setItem(getStorageKey(productId), String(Date.now()));
	} catch {
		// Storage may be unavailable; analytics is optional.
	}
};

export const recordProductViewAction = async (
	variantId: string,
	productId: string,
): Promise<void> => {
	if (navigator.webdriver) return;
	if (wasRecentlyViewed(productId)) return;
	if (viewsInFlight.has(productId)) return;

	viewsInFlight.add(productId);

	try {
		const {data} = await supabase.auth.getSession();

		if (data.session) return;

		markAsViewed(productId);

		const {error} = await supabase.rpc('record_product_view', {
			p_variant_id: variantId,
		});

		if (error) throw error;
	} catch {
		// Analytics must never break the store.
	} finally {
		viewsInFlight.delete(productId);
	}
};
