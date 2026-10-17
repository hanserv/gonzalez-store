import type {DashboardData} from '@/admin/interfaces/dashboard.interface';
import {dashboardStatsMock} from '@/mocks/dashboard-stats.mock';
import {recentProductsMock} from '@/mocks/recent-products.mock';
import {topViewedProductsMock} from '@/mocks/top-viewed-products.mock';

const data: DashboardData = {
	stats: dashboardStatsMock,
	recentProducts: recentProductsMock,
	topViewedProducts: topViewedProductsMock,
};

// TODO: Tanstack useQuery
// TODO: reemplazar por useQuery({queryKey: ['dashboard'], queryFn: getDashboardAction})
export const useDashboardData = () => ({
	data,
	isLoading: false,
});
