// TODO: Mucha data repetida. Fix them.

export interface DashboardStats {
	totalProducts: number;
	activeProducts: number;
	inactiveProducts: number;
	onSaleProducts: number;
	outOfStockProducts: number;
	totalCategories: number;
}

export interface RecentProduct {
	id: string;
	name: string;
	category: string;
	price: number;
	isActive: boolean;
	createdAt: string;
}

export interface TopViewedProduct {
	id: string;
	name: string;
	category: string;
	views: number;
}

export interface DashboardData {
	stats: DashboardStats;
	recentProducts: RecentProduct[];
	topViewedProducts: TopViewedProduct[];
}
