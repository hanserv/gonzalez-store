import {buildVariantImageUrl} from '@/admin/mappers/product-variant.mapper';
import type {
	ShopCatalogItem,
	ShopCatalogItemRow,
	ShopCatalogVariant,
} from '@/shop/interfaces/catalog.interface';

type CatalogVariantRow = NonNullable<
	ShopCatalogItemRow['product_variants']
>[number];

const mapCatalogVariant = (row: CatalogVariantRow): ShopCatalogVariant => {
	const coverImage = (row.variant_images ?? [])
		.slice()
		.sort((first, second) => first.display_order - second.display_order)[0];

	return {
		id: row.id,
		slug: row.slug,
		name: row.name,
		price: row.price,
		discountPercentage: row.discount_percentage,
		finalPrice: row.price * (1 - row.discount_percentage / 100),
		coverImageUrl: coverImage ? buildVariantImageUrl(coverImage.path) : null,
	};
};

export const mapShopCatalogItem = (row: ShopCatalogItemRow): ShopCatalogItem => {
	const variants = (row.product_variants ?? [])
		.filter((variant) => variant.is_active)
		.slice()
		.sort((first, second) => first.display_order - second.display_order)
		.map(mapCatalogVariant);

	return {
		id: row.id,
		name: row.name,
		brandId: row.brand_id,
		brandName: row.brand?.name ?? null,
		categoryId: row.category_id,
		isPopular: row.is_popular,
		activeVariantCount: variants.length,
		variants,
	};
};
