import {buildVariantImageUrl} from '@/admin/mappers/product-variant.mapper';
import type {
	ShopCartVariant,
	ShopCartVariantRow,
} from '@/shop/interfaces/cart.interface';

export const mapShopCartVariant = (
	row: ShopCartVariantRow,
): ShopCartVariant => {
	const coverImage = (row.variant_images ?? [])
		.slice()
		.sort((first, second) => first.display_order - second.display_order)[0];

	return {
		id: row.id,
		slug: row.slug,
		title: `${row.product?.name ?? ''} ${row.name}`.trim(),
		brandName: row.product?.brand?.name ?? null,
		imageUrl: coverImage ? buildVariantImageUrl(coverImage.path) : null,
		price: row.price,
		discountPercentage: row.discount_percentage,
		finalPrice: row.price * (1 - row.discount_percentage / 100),
		sizes: (row.variant_sizes ?? []).map(({id, size, stock}) => ({
			id,
			size,
			stock,
		})),
	};
};
