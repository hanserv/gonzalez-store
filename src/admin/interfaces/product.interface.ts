import type {Tables} from '@/supabase/database.types';
import type {
	ProductVariant,
	ProductVariantDetailRow,
} from '@/admin/interfaces/product-variant.interface';

export type ProductRow = Tables<'products'>;

export interface Product {
	id: string;
	name: string;
	brandId: string;
	categoryId: string;
	createdAt: string;
}

export interface ProductInput {
	name: string;
	brandId: string;
	categoryId: string;
}

export interface ProductListItem extends Product {
	brandName: string;
	categoryName: string;
	variantCount: number;
	activeVariantCount: number;
	totalStock: number;
	coverImageUrl: string | null;
}

export interface ProductListItemRow {
	id: string;
	name: string;
	brand_id: string;
	category_id: string;
	created_at: string;
	brand: {name: string} | null;
	category: {name: string} | null;
	product_variants: Array<{
		is_active: boolean;
		display_order: number;
		variant_images: Array<{path: string; display_order: number}> | null;
		variant_sizes: Array<{stock: number}> | null;
	}> | null;
}

export interface ProductDetail {
	id: string;
	name: string;
	brandId: string;
	categoryId: string;
	brandName: string;
	categoryName: string;
	createdAt: string;
	variants: ProductVariant[];
}

export interface ProductDetailRow {
	id: string;
	name: string;
	brand_id: string;
	category_id: string;
	created_at: string;
	brand: {name: string} | null;
	category: {name: string} | null;
	product_variants: ProductVariantDetailRow[] | null;
}
