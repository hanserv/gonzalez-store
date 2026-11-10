export interface ShopVariantImage {
	id: string;
	url: string;
	displayOrder: number;
}

export interface ShopVariantSize {
	id: string;
	size: string;
	stock: number;
}

export interface ShopVariantSibling {
	id: string;
	slug: string;
	name: string;
	coverImageUrl: string | null;
}

export interface ShopVariant {
	id: string;
	slug: string;
	name: string;
	title: string;
	description: string | null;
	price: number;
	discountPercentage: number;
	finalPrice: number;
	isActive: boolean;
	images: ShopVariantImage[];
	sizes: ShopVariantSize[];
	productId: string;
	brandName: string | null;
}

export interface ShopVariantDetail {
	variant: ShopVariant;
	siblings: ShopVariantSibling[];
}

export interface ShopVariantRow {
	id: string;
	product_id: string;
	name: string;
	slug: string;
	description: string | null;
	price: number;
	discount_percentage: number;
	is_active: boolean;
	display_order: number;
	created_at: string;
	product: {
		id: string;
		name: string;
		brand: {name: string} | null;
		product_variants: Array<{
			id: string;
			slug: string;
			name: string;
			display_order: number;
			is_active: boolean;
			variant_images: Array<{path: string; display_order: number}> | null;
		}> | null;
	} | null;
	variant_images: Array<{
		id: string;
		path: string;
		display_order: number;
	}> | null;
	variant_sizes: Array<{
		id: string;
		size: string;
		stock: number;
	}> | null;
}
