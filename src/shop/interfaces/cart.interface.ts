import type {ShopVariantSize} from '@/shop/interfaces/variant.interface';

export interface CartItem {
	variantId: string;
	size: string | null;
	slug: string;
	title: string;
	brandName: string | null;
	imageUrl: string | null;
	price: number;
	finalPrice: number;
	quantity: number;
	stockLimit: number | null;
}

export interface ShopCartVariant {
	id: string;
	slug: string;
	title: string;
	brandName: string | null;
	imageUrl: string | null;
	price: number;
	discountPercentage: number;
	finalPrice: number;
	sizes: ShopVariantSize[];
}

export interface ShopCartVariantRow {
	id: string;
	name: string;
	slug: string;
	price: number;
	discount_percentage: number;
	product: {
		name: string;
		brand: {name: string} | null;
	} | null;
	variant_images: Array<{
		path: string;
		display_order: number;
	}> | null;
	variant_sizes: Array<{
		id: string;
		size: string;
		stock: number;
	}> | null;
}

export interface AddCartItemResult {
	quantity: number;
	added: boolean;
	clamped: boolean;
}

export interface CartReconcileResult {
	removed: number;
	updated: number;
	clamped: number;
}
