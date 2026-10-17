import type {
	Brand,
	BrandInput,
	BrandRow,
} from '@/admin/interfaces/brand.interface';

export const mapBrand = (row: BrandRow): Brand => ({
	id: row.id,
	name: row.name,
	slug: row.slug,
	description: row.description,
	createdAt: row.created_at,
});

// payload for insert/update
export const prepareBrandForSave = (input: BrandInput) => ({
	name: input.name.trim(),
	slug: input.slug.trim().toLowerCase(),
	description: input.description?.trim() || null,
});
