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
		coverImageUrl: null,
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
