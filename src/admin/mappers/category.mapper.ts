import type {
	Category,
	CategoryInput,
	CategoryRow,
} from '@/admin/interfaces/category.interface';

export const mapCategory = (row: CategoryRow): Category => ({
	id: row.id,
	name: row.name,
	slug: row.slug,
	description: row.description,
	createdAt: row.created_at,
});

// payload para insert/update
export const prepareCategoryForSave = (input: CategoryInput) => ({
	name: input.name.trim(),
	slug: input.slug.trim().toLowerCase(),
	description: input.description?.trim() || null,
});
