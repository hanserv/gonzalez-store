import type {
	DashboardLatestVariant,
	DashboardLatestVariantRow,
	DashboardStats,
	DashboardStatsRow,
} from '@/admin/interfaces/dashboard.interface';

export const mapDashboardStats = (row: DashboardStatsRow): DashboardStats => ({
	totalProducts: row.total_products,
	productsOnSale: row.products_on_sale,
	soldOutVariants: row.sold_out_variants,
	totalCategories: row.total_categories,
	activeVariants: row.active_variants,
	inactiveVariants: row.inactive_variants,
});

export const mapDashboardLatestVariant = (
	row: DashboardLatestVariantRow,
): DashboardLatestVariant => {
	const title = `${row.product?.name ?? ''} ${row.name}`.trim();

	return {
		id: row.id,
		title,
		categoryName: row.product?.category?.name ?? '',
		createdAt: row.created_at,
		finalPrice: row.price * (1 - row.discount_percentage / 100),
		isActive: row.is_active,
	};
};
