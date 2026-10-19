import {AlertTriangle, FolderTree, Percent, ShoppingBag} from 'lucide-react';
import {useDashboardStats} from '@/admin/hooks/dashboard/useDashboardStats';
import {DashboardErrorCard} from '@/admin/components/DashboardErrorCard';
import {StatCard} from '@/admin/components/StatCard';
import {VariantStatusCard} from '@/admin/components/VariantStatusCard';
import {Card} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';

const StatCardSkeleton = () => (
	<Card className='gap-3 py-5 shadow-none'>
		<div className='flex items-center justify-between gap-3 px-5'>
			<Skeleton className='h-4 w-28' />
			<Skeleton className='size-4' />
		</div>

		<div className='px-5'>
			<Skeleton className='h-8 w-16' />
		</div>
	</Card>
);

const StatsSkeleton = () => (
	<>
		<section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
			<StatCardSkeleton />
			<StatCardSkeleton />
			<StatCardSkeleton />
			<StatCardSkeleton />
		</section>

		<Card>
			<div className='flex flex-col gap-3 px-6'>
				<Skeleton className='h-4 w-48' />
				<Skeleton className='h-2 w-full' />
				<div className='flex justify-between'>
					<Skeleton className='h-4 w-20' />
					<Skeleton className='h-4 w-20' />
				</div>
			</div>
		</Card>
	</>
);

export const DashboardStatsSection = () => {
	const {
		data: stats,
		isLoading,
		isError,
		refetch,
		isRefetching,
	} = useDashboardStats();

	if (isLoading) return <StatsSkeleton />;

	if (isError) {
		return (
			<DashboardErrorCard
				message='No se pudieron cargar las estadísticas.'
				onRetry={refetch}
				isRetrying={isRefetching}
			/>
		);
	}

	if (!stats) return <StatsSkeleton />;

	return (
		<>
			<section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
				<StatCard
					icon={ShoppingBag}
					label='Total de productos'
					value={stats.totalProducts}
				/>
				<StatCard
					icon={Percent}
					label='Productos en oferta'
					value={stats.productsOnSale}
				/>
				<StatCard
					icon={AlertTriangle}
					label='Variantes agotadas'
					value={stats.soldOutVariants}
					hint={
						stats.soldOutVariants > 0
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

			<VariantStatusCard
				active={stats.activeVariants}
				inactive={stats.inactiveVariants}
			/>
		</>
	);
};
