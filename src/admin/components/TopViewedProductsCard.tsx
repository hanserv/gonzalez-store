import {Link} from 'react-router';
import {Eye, Loader2, RefreshCw} from 'lucide-react';
import {useDashboardTopViewedProducts} from '@/admin/hooks/dashboard/useDashboardTopViewedProducts';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';

const TOP_VIEWED_SKELETON_ROWS = 5;

const RowSkeleton = () => (
	<div className='flex flex-col gap-2 py-3'>
		<div className='flex items-center justify-between gap-3'>
			<Skeleton className='h-4 w-40' />
			<Skeleton className='h-4 w-12' />
		</div>
		<Skeleton className='h-1.5 w-full' />
	</div>
);

export const TopViewedProductsCard = () => {
	const {
		data: products = [],
		isLoading,
		isError,
		isFetching,
		refetch,
		isRefetching,
	} = useDashboardTopViewedProducts();

	const maxViews = Math.max(...products.map((product) => product.views), 1);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Productos más vistos</CardTitle>
				<CardDescription>Visitas, últimos 30 días</CardDescription>
				<CardAction>
					<Button
						variant='ghost'
						size='icon'
						aria-label='Actualizar productos más vistos'
						onClick={() => void refetch()}
						disabled={isFetching}
					>
						<RefreshCw className={isFetching ? 'animate-spin' : undefined} />
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent>
				{isLoading && (
					<div className='flex flex-col divide-y'>
						{Array.from(
							{length: TOP_VIEWED_SKELETON_ROWS},
							(_, index) => (
								<RowSkeleton key={index} />
							),
						)}
					</div>
				)}

				{isError && (
					<div className='flex flex-col items-center gap-3 py-6 text-center'>
						<p className='text-sm text-muted-foreground'>
							No se pudieron cargar los productos más vistos.
						</p>
						<Button
							variant='outline'
							size='sm'
							onClick={() => void refetch()}
							disabled={isRefetching}
						>
							{isRefetching && <Loader2 className='animate-spin' />}
							Reintentar
						</Button>
					</div>
				)}

				{!isLoading && !isError && products.length === 0 && (
					<p className='text-sm text-muted-foreground'>
						Aún no hay visitas registradas en los últimos 30 días.
					</p>
				)}

				{!isLoading && !isError && products.length > 0 && (
					<ol className='flex flex-col divide-y'>
						{products.map((product, index) => (
							<li key={product.id}>
								<Link
									to={`/admin/products/${product.id}`}
									className='group flex flex-col gap-1.5 py-3'
								>
									<div className='flex items-center justify-between gap-3'>
										<p className='truncate text-sm font-medium group-hover:underline'>
											<span className='mr-2 text-muted-foreground'>
												{index + 1}.
											</span>
											{product.name}
										</p>
										<span className='flex shrink-0 items-center gap-1 text-sm text-muted-foreground'>
											<Eye className='size-4' />
											{product.views.toLocaleString('es-DO')}
										</span>
									</div>
									<div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
										<div
											className='h-full rounded-full bg-black'
											style={{width: `${(product.views / maxViews) * 100}%`}}
										/>
									</div>
								</Link>
							</li>
						))}
					</ol>
				)}
			</CardContent>
		</Card>
	);
};
