import type {Tables} from '@/supabase/database.types';

export type ProductVariantRow = Tables<'product_variants'>;
export type VariantImageRow = Tables<'variant_images'>;
export type VariantSizeRow = Tables<'variant_sizes'>;

export interface ProductVariantImage {
	id: string;
	path: string;
	url: string;
	displayOrder: number;
}

export interface ProductVariantSize {
	id?: string;
	size: string;
	stock: number;
}

export interface ProductVariant {
	id: string;
	productId: string;
	name: string;
	slug: string;
	description: string | null;
	price: number;
	discountPercentage: number;
	isActive: boolean;
	displayOrder: number;
	createdAt: string;
	images: ProductVariantImage[];
	sizes: ProductVariantSize[];
}

export interface ProductVariantInput {
	productId: string;
	name: string;
	slug: string;
	description: string;
	price: number;
	discountPercentage: number;
	isActive: boolean;
	displayOrder: number;
	sizes: Array<{size: string; stock: number}>;
}

export interface ProductVariantDetailRow {
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
