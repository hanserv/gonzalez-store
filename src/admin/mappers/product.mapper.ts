import {supabase} from '@/supabase/supabase';
import type {
	Product,
	ProductDetail,
	ProductDetailRow,
	ProductInput,
	ProductListItem,
	ProductListItemRow,
	ProductRow,
} from '@/admin/interfaces/product.interface';
import {mapProductVariant} from '@/admin/mappers/product-variant.mapper';

const PRODUCT_IMAGES_BUCKET = 'product-images';

const getCoverImageUrl = (
	variants: ProductListItemRow['product_variants'],
): string | null => {
	const coverVariant = (variants ?? [])
		.filter((variant) => variant.is_active)
		.slice()
		.sort((first, second) => first.display_order - second.display_order)[0];

	const coverImage = (coverVariant?.variant_images ?? [])
		.slice()
		.sort((first, second) => first.display_order - second.display_order)[0];

	if (!coverImage) return null;

	return supabase.storage
		.from(PRODUCT_IMAGES_BUCKET)
		.getPublicUrl(coverImage.path).data.publicUrl;
};

export const mapProduct = (row: ProductRow): Product => ({
	id: row.id,
	name: row.name,
	brandId: row.brand_id,
	categoryId: row.category_id,
	createdAt: row.created_at,
});

export const mapProductListItem = (
	row: ProductListItemRow,
): ProductListItem => {
	const variants = row.product_variants ?? [];

	return {
		id: row.id,
		name: row.name,
		brandId: row.brand_id,
		categoryId: row.category_id,
		createdAt: row.created_at,
		brandName: row.brand?.name ?? 'Sin marca',
		categoryName: row.category?.name ?? 'Sin categoría',
		variantCount: variants.length,
		activeVariantCount: variants.filter((variant) => variant.is_active).length,
		totalStock: variants.reduce((total, variant) => {
			const variantStock = (variant.variant_sizes ?? []).reduce(
				(stockTotal, size) => stockTotal + size.stock,
				0,
			);

			return total + variantStock;
		}, 0),
		coverImageUrl: getCoverImageUrl(row.product_variants),
	};
};

export const mapProductDetail = (row: ProductDetailRow): ProductDetail => ({
	id: row.id,
	name: row.name,
	brandId: row.brand_id,
	categoryId: row.category_id,
	createdAt: row.created_at,
	brandName: row.brand?.name ?? 'Sin marca',
	categoryName: row.category?.name ?? 'Sin categoría',
	variants: (row.product_variants ?? [])
		.slice()
		.sort((first, second) => first.display_order - second.display_order)
		.map(mapProductVariant),
});

export const prepareProductForSave = (input: ProductInput) => ({
	name: input.name.trim(),
	brand_id: input.brandId,
	category_id: input.categoryId,
});
