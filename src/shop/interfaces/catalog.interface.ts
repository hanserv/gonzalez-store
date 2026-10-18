export interface ShopCatalogVariant {
	id: string;
	slug: string;
	name: string;
	price: number;
	discountPercentage: number;
	finalPrice: number;
	coverImageUrl: string | null;
}

export interface ShopCatalogItem {
	id: string;
	name: string;
	brandId: string;
	brandName: string | null;
	categoryId: string;
	isPopular: boolean;
	activeVariantCount: number;
	variants: ShopCatalogVariant[];
}

export interface ShopCatalogItemRow {
	id: string;
	name: string;
	brand_id: string;
	category_id: string;
	is_popular: boolean;
	brand: {name: string} | null;
	product_variants: Array<{
		id: string;
		slug: string;
		name: string;
		price: number;
		discount_percentage: number;
		is_active: boolean;
		display_order: number;
		variant_images: Array<{path: string; display_order: number}> | null;
	}> | null;
}

export interface ShopFilterOption {
	id: string;
	name: string;
}
