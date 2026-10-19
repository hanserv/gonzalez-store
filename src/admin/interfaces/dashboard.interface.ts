import type {Database} from '@/supabase/database.types';

// The single row returned by the get_dashboard_stats() RPC.
// It comes typed from the generated Database, not as Json.
export type DashboardStatsRow =
	Database['public']['Functions']['get_dashboard_stats']['Returns'][number];

export interface DashboardStats {
	totalProducts: number;
	productsOnSale: number;
	soldOutVariants: number;
	totalCategories: number;
	activeVariants: number;
	inactiveVariants: number;
}

export interface DashboardLatestVariantRow {
	id: string;
	name: string;
	price: number;
	discount_percentage: number;
	is_active: boolean;
	created_at: string;
	product: {
		name: string;
		category: {name: string} | null;
	} | null;
}

export interface DashboardLatestVariant {
	id: string;
	title: string;
	categoryName: string;
	createdAt: string;
	finalPrice: number;
	isActive: boolean;
}

export interface TopViewedProduct {
	id: string;
	name: string;
	category: string;
	views: number;
}
