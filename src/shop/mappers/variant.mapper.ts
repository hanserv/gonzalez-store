import {buildVariantImageUrl} from '@/admin/mappers/product-variant.mapper';
import type {
	ShopVariant,
	ShopVariantDetail,
	ShopVariantRow,
	ShopVariantSibling,
} from '@/shop/interfaces/variant.interface';

const mapSibling = (
	row: NonNullable<
		NonNullable<ShopVariantRow['product']>['product_variants']
	>[number],
): ShopVariantSibling => {
	const coverImage = (row.variant_images ?? [])
		.slice()
		.sort((first, second) => first.display_order - second.display_order)[0];

	return {
		id: row.id,
		slug: row.slug,
		name: row.name,
		coverImageUrl: coverImage ? buildVariantImageUrl(coverImage.path) : null,
	};
};

export const mapShopVariant = (row: ShopVariantRow): ShopVariant => ({
	id: row.id,
	slug: row.slug,
	title: `${row.product?.name ?? ''} ${row.name}`.trim(),
	description: row.description,
	price: row.price,
	discountPercentage: row.discount_percentage,
	finalPrice: row.price * (1 - row.discount_percentage / 100),
	isActive: row.is_active,
	images: (row.variant_images ?? [])
		.slice()
		.sort((first, second) => first.display_order - second.display_order)
		.map((image) => ({
			id: image.id,
			url: buildVariantImageUrl(image.path),
			displayOrder: image.display_order,
		})),
	sizes: (row.variant_sizes ?? []).map((size) => ({
		id: size.id,
		size: size.size,
		stock: size.stock,
	})),
	productId: row.product?.id ?? row.product_id,
	brandName: row.product?.brand?.name ?? null,
});

export const mapShopVariantDetail = (row: ShopVariantRow): ShopVariantDetail => ({
	variant: mapShopVariant(row),
	siblings: (row.product?.product_variants ?? [])
		.filter((sibling) => sibling.id !== row.id && sibling.is_active)
		.slice()
		.sort((first, second) => first.display_order - second.display_order)
		.map(mapSibling),
});
