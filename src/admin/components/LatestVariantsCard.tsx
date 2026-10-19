import {Loader2} from 'lucide-react';
import {useDashboardLatestVariants} from '@/admin/hooks/dashboard/useDashboardLatestVariants';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {cn} from '@/lib/utils';

const currency = new Intl.NumberFormat('es-DO', {
	style: 'currency',
	currency: 'DOP',
	maximumFractionDigits: 0,
});

const date = new Intl.DateTimeFormat('es-DO', {day: 'numeric', month: 'short'});

const LATEST_VARIANTS_SKELETON_ROWS = 5;

const RowSkeleton = () => (
	<div className='flex items-center justify-between gap-3 py-3'>
		<div className='flex min-w-0 flex-col gap-1.5'>
			<Skeleton className='h-4 w-40' />
			<Skeleton className='h-3 w-24' />
		</div>

		<div className='flex shrink-0 flex-col items-end gap-1.5'>
			<Skeleton className='h-4 w-16' />
			<Skeleton className='h-4 w-14' />
		</div>
	</div>
);

export const LatestVariantsCard = () => {
	const {
		data: variants = [],
		isLoading,
		isError,
		refetch,
		isRefetching,
	} = useDashboardLatestVariants();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Últimas variantes agregadas</CardTitle>
			</CardHeader>

			<CardContent>
				{isLoading && (
					<div className='flex flex-col divide-y'>
						{Array.from(
							{length: LATEST_VARIANTS_SKELETON_ROWS},
							(_, index) => <RowSkeleton key={index} />,
						)}
					</div>
				)}

				{isError && (
					<div className='flex flex-col items-center gap-3 py-6 text-center'>
						<p className='text-sm text-muted-foreground'>
							No se pudieron cargar las últimas variantes.
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

				{!isLoading && !isError && variants.length === 0 && (
					<p className='text-sm text-muted-foreground'>
						Aún no hay variantes.
					</p>
				)}

				{!isLoading && !isError && variants.length > 0 && (
					<ul className='divide-y'>
						{variants.map((variant) => {
							const meta = [
								variant.categoryName,
								date.format(new Date(variant.createdAt)),
							]
								.filter(Boolean)
								.join(' · ');

							return (
								<li
									key={variant.id}
									className='flex items-center justify-between gap-3 py-3'
								>
									<div className='min-w-0'>
										<p className='truncate text-sm font-medium'>
											{variant.title}
										</p>
										<p className='truncate text-xs text-muted-foreground'>
											{meta}
										</p>
									</div>

									<div className='flex shrink-0 flex-col items-end gap-1'>
										<span className='text-sm font-semibold'>
											{currency.format(variant.finalPrice)}
										</span>
										<span
											className={cn(
												'rounded-full px-2 py-0.5 text-xs font-medium',
												variant.isActive
													? 'bg-green-100 text-green-700'
													: 'bg-muted text-muted-foreground',
											)}
										>
											{variant.isActive ? 'Activa' : 'Inactiva'}
										</span>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</CardContent>
		</Card>
	);
};
