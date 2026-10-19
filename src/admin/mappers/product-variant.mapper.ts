import {supabase} from '@/supabase/supabase';
import type {
	ProductVariant,
	ProductVariantDetailRow,
	ProductVariantInput,
	ProductVariantImage,
	ProductVariantSize,
} from '@/admin/interfaces/product-variant.interface';

export const PRODUCT_IMAGES_BUCKET = 'product-images';

interface VariantImageRowShape {
	id: string;
	path: string;
	display_order: number;
}

export const buildVariantImageUrl = (path: string) =>
	supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;

export const mapVariantImage = ({
	id,
	path,
	display_order,
}: VariantImageRowShape): ProductVariantImage => ({
	id,
	path,
	url: buildVariantImageUrl(path),
	displayOrder: display_order,
});

const mapVariantSize = ({
	id,
	size,
	stock,
}: NonNullable<
	ProductVariantDetailRow['variant_sizes']
>[number]): ProductVariantSize => ({
	id,
	size,
	stock,
});

export const mapProductVariant = (
	row: ProductVariantDetailRow,
): ProductVariant => ({
	id: row.id,
	productId: row.product_id,
	name: row.name,
	slug: row.slug,
	description: row.description,
	price: row.price,
	discountPercentage: row.discount_percentage,
	isActive: row.is_active,
	displayOrder: row.display_order,
	createdAt: row.created_at,
	images: (row.variant_images ?? [])
		.slice()
		.sort((first, second) => first.display_order - second.display_order)
		.map(mapVariantImage),
	sizes: (row.variant_sizes ?? []).slice().map(mapVariantSize),
});

export const prepareProductVariantForSave = (input: ProductVariantInput) => ({
	product_id: input.productId,
	name: input.name.trim(),
	slug: input.slug.trim().toLowerCase(),
	description: input.description?.trim() || null,
	price: input.price,
	discount_percentage: input.discountPercentage,
	is_active: input.isActive,
	...(input.displayOrder !== undefined
		? {display_order: input.displayOrder}
		: {}),
});

export const prepareProductVariantSizesForSave = (
	sizes: Array<{size: string; stock: number}>,
) =>
	sizes.map((size) => ({
		size: size.size.trim(),
		stock: size.stock,
	}));
