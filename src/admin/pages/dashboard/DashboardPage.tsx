import {AlertTriangle, FolderTree, Percent, ShoppingBag} from 'lucide-react';
import {useDashboardData} from '@/admin/hooks/dashboard/useDashboardData';
import {StatCard} from '@/admin/components/StatCard';
import {ProductStatusCard} from '@/admin/components/ProductStatusCard';
import {RecentProductsCard} from '@/admin/components/RecentProductsCard';
import {TopViewedProductsCard} from '@/admin/components/TopViewedProductsCard';
import {AdminTitle} from '@/admin/components/AdminTitle';

export const DashboardPage = () => {
	const {data} = useDashboardData();
	const {stats, recentProducts, topViewedProducts} = data;

	return (
		<div className='flex flex-col gap-5'>
			<AdminTitle title='Dashboard' subtitle='Resumen general de la tienda' />

			{/* counters */}
			<section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
				<StatCard
					icon={ShoppingBag}
					label='Total de productos'
					value={stats.totalProducts}
				/>
				<StatCard
					icon={Percent}
					label='Productos en oferta'
					value={stats.onSaleProducts}
				/>
				<StatCard
					icon={AlertTriangle}
					label='Productos agotados'
					value={stats.outOfStockProducts}
					hint={
						stats.outOfStockProducts > 0
							? 'Requieren reposición'
							: 'Todo en stock'
					}
				/>
				<StatCard
					icon={FolderTree}
					label='Total de categorías'
					value={stats.totalCategories}
				/>
			</section>

			{/* actives vs inactives */}
			<ProductStatusCard
				active={stats.activeProducts}
				inactive={stats.inactiveProducts}
			/>

			{/* lists */}
			<section className='grid gap-4 lg:grid-cols-2'>
				<RecentProductsCard products={recentProducts} />
				<TopViewedProductsCard products={topViewedProducts} />
			</section>
		</div>
	);
};
