import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import type {
	AddCartItemResult,
	CartItem,
	CartReconcileResult,
	ShopCartVariant,
} from '@/shop/interfaces/cart.interface';
import {buildCartLineId} from '@/shop/lib/cart';

interface CartState {
	items: CartItem[];
	isOpen: boolean;
	openCart: () => void;
	closeCart: () => void;
	setCartOpen: (open: boolean) => void;
	addItem: (item: CartItem) => AddCartItemResult;
	removeItem: (lineId: string) => void;
	updateQuantity: (lineId: string, quantity: number) => void;
	reconcileItems: (variants: ShopCartVariant[]) => CartReconcileResult;
	clearCart: () => void;
}

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			items: [],
			isOpen: false,

			openCart: () => set({isOpen: true}),
			closeCart: () => set({isOpen: false}),
			setCartOpen: (open) => set({isOpen: open}),

			addItem: (item) => {
				const lineId = buildCartLineId(item.variantId, item.size);
				const current = get().items.find(
					(entry) =>
						buildCartLineId(entry.variantId, entry.size) === lineId,
				);

				if (!current) {
					const max = item.stockLimit ?? Number.POSITIVE_INFINITY;
					const quantity = Math.min(item.quantity, max);

					if (quantity <= 0) {
						return {quantity: 0, added: false, clamped: true};
					}

					set({
						items: [...get().items, {...item, quantity}],
					});

					return {
						quantity,
						added: true,
						clamped: quantity < item.quantity,
					};
				}

				const max =
					item.stockLimit ??
					current.stockLimit ??
					Number.POSITIVE_INFINITY;
				const requested = current.quantity + item.quantity;
				const quantity = Math.min(requested, max);

				if (quantity <= current.quantity) {
					return {quantity: current.quantity, added: false, clamped: true};
				}

				set({
					items: get().items.map((entry) =>
						entry === current
							? {
									...entry,
									quantity,
									stockLimit: item.stockLimit ?? entry.stockLimit,
								}
							: entry,
					),
				});

				return {
					quantity,
					added: true,
					clamped: quantity < requested,
				};
			},

			removeItem: (lineId) =>
				set({
					items: get().items.filter(
						(entry) =>
							buildCartLineId(entry.variantId, entry.size) !== lineId,
					),
				}),

			updateQuantity: (lineId, quantity) =>
				set({
					items: get().items.map((entry) => {
						if (
							buildCartLineId(entry.variantId, entry.size) !== lineId
						) {
							return entry;
						}

						const max = entry.stockLimit ?? Number.POSITIVE_INFINITY;

						return {
							...entry,
							quantity: Math.max(1, Math.min(quantity, max)),
						};
					}),
				}),

			reconcileItems: (variants) => {
				const variantMap = new Map(
					variants.map((variant) => [variant.id, variant]),
				);
				let removed = 0;
				let updated = 0;
				let clamped = 0;
				let changed = false;

				const items = get().items.flatMap((item) => {
					const variant = variantMap.get(item.variantId);

					if (!variant) {
						removed++;
						changed = true;
						return [];
					}

					let stockLimit: number | null = null;

					if (variant.sizes.length > 0) {
						const sizeRow = item.size
							? variant.sizes.find((size) => size.size === item.size)
							: undefined;

						if (!sizeRow || sizeRow.stock <= 0) {
							removed++;
							changed = true;
							return [];
						}

						stockLimit = sizeRow.stock;
					}

					const quantity =
						stockLimit === null
							? item.quantity
							: Math.min(item.quantity, stockLimit);

					const nextItem: CartItem = {
						...item,
						title: variant.title,
						slug: variant.slug,
						brandName: variant.brandName,
						imageUrl: variant.imageUrl,
						price: variant.price,
						finalPrice: variant.finalPrice,
						quantity,
						stockLimit,
					};

					const priceChanged =
						item.price !== variant.price ||
						item.finalPrice !== variant.finalPrice;
					const detailsChanged =
						item.title !== variant.title ||
						item.slug !== variant.slug ||
						item.brandName !== variant.brandName ||
						item.imageUrl !== variant.imageUrl;
					const stockChanged = item.stockLimit !== stockLimit;
					const quantityChanged = item.quantity !== quantity;

					if (priceChanged || detailsChanged) updated++;
					if (quantityChanged) clamped++;
					if (
						priceChanged ||
						detailsChanged ||
						stockChanged ||
						quantityChanged
					) {
						changed = true;
					}

					return [nextItem];
				});

				if (changed) set({items});

				return {removed, updated, clamped};
			},

			clearCart: () => set({items: []}),
		}),
		{
			name: 'gonzalez-cart',
			version: 1,
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({items: state.items}),
		},
	),
);

export const selectCartCount = (state: CartState) =>
	state.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartSubtotal = (state: CartState) =>
	state.items.reduce(
		(total, item) => total + item.finalPrice * item.quantity,
		0,
	);

export const selectCartSavings = (state: CartState) =>
	state.items.reduce(
		(total, item) =>
			total + Math.max(0, item.price - item.finalPrice) * item.quantity,
		0,
	);
