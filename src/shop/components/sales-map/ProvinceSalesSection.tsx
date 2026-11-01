import {lazy, Suspense, useMemo} from 'react';
import {TrendingUp} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {Skeleton} from '@/components/ui/skeleton';
import type {ProvinceSales} from '@/province-sales/interfaces/province-sales.interface';
import {formatSalesCount} from '@/province-sales/lib/format';
import {useProvinceSales} from '@/province-sales/hooks/useProvinceSales';

const SalesMap = lazy(() => import('./SalesMap'));

const sortProvinces = (provinces: ProvinceSales[]) =>
	[...provinces].sort(
		(a, b) => b.totalSales - a.totalSales || a.name.localeCompare(b.name, 'es'),
	);

const ProvinceSalesBreakdownDialog = ({
	provinces,
}: {
	provinces: ProvinceSales[];
}) => {
	const totalGeneral = provinces.reduce(
		(sum, province) => sum + province.totalSales,
		0,
	);

	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button variant='default' className='rounded-full px-5'>
						Ver desglose
					</Button>
				}
			/>
			<DialogContent className='max-w-xl rounded-2xl p-0 sm:max-w-xl'>
				<DialogHeader className='border-b border-gray-200 px-5 py-4'>
					<DialogTitle className='text-left text-lg font-semibold'>
						Desglose por provincia
					</DialogTitle>
				</DialogHeader>

				<div className='max-h-[70vh] overflow-y-auto px-5 py-4'>
					<div className='mb-4 flex items-center justify-between gap-3 rounded-xl bg-gonzalez-bone px-3 py-2'>
						<span className='text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground'>
							Total general
						</span>
						<span className='text-sm font-semibold tabular-nums'>
							{formatSalesCount(totalGeneral)}
						</span>
					</div>

					{provinces.length === 0 ? (
						<p className='px-3 py-4 text-sm text-muted-foreground'>
							Aún no hay provincias registradas.
						</p>
					) : (
						<>
							<div className='mb-2 flex items-center justify-between gap-4 px-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground'>
								<span>Provincia</span>
								<span>Ventas</span>
							</div>
							<div className='space-y-2'>
								{provinces.map((province) => (
									<div
										key={province.id}
										className='flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-3 py-2.5'
									>
										<span className='text-sm text-foreground'>
											{province.name}
										</span>
										<span className='text-sm font-medium tabular-nums text-foreground'>
											{formatSalesCount(province.totalSales)}
										</span>
									</div>
								))}
							</div>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

const ProvinceSalesSummary = ({provinces}: {provinces: ProvinceSales[]}) => {
	const totalGeneral = provinces.reduce(
		(sum, province) => sum + province.totalSales,
		0,
	);

	return (
		<div className='flex flex-wrap items-center justify-end gap-x-6 gap-y-3 px-1'>
			<div>
				<div className='flex items-center gap-3'>
					<p className='text-5xl font-bold tabular-nums tracking-tight text-foreground sm:text-6xl'>
						{formatSalesCount(totalGeneral)}
					</p>
					<span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-gonzalez-red sm:size-11'>
						<TrendingUp
							className='size-4 text-white sm:size-5'
							strokeWidth={2.5}
						/>
					</span>
				</div>
				<p className='mt-1 text-base text-muted-foreground'>Ventas totales</p>
			</div>

			<ProvinceSalesBreakdownDialog provinces={provinces} />
		</div>
	);
};

export const ProvinceSalesSection = () => {
	const {
		data: provinces = [],
		isLoading,
		isError,
		refetch,
	} = useProvinceSales();
	const sortedProvinces = useMemo(() => sortProvinces(provinces), [provinces]);

	if (isLoading) {
		return (
			<div className='flex flex-col gap-6'>
				<Skeleton className='h-[360px] w-full rounded-xl bg-white md:h-[480px]' />
				<div className='flex flex-wrap items-center justify-end gap-x-6 gap-y-3 px-1'>
					<div className='space-y-2'>
						<Skeleton className='h-14 w-36 bg-muted/70' />
						<Skeleton className='h-4 w-24 bg-muted/70' />
					</div>
					<Skeleton className='h-10 w-32 rounded-full bg-muted/70' />
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className='rounded-xl border border-gray-200 bg-white p-6 text-center shadow-xs'>
				<p className='mb-3 text-sm text-muted-foreground'>
					No pudimos cargar las ventas por provincia.
				</p>
				<Button variant='outline' onClick={() => refetch()}>
					Reintentar
				</Button>
			</div>
		);
	}

	if (sortedProvinces.length === 0) {
		return (
			<div className='rounded-xl border border-gray-200 bg-white p-6 text-center shadow-xs'>
				<p className='text-sm text-muted-foreground'>
					Aún no hay provincias registradas.
				</p>
			</div>
		);
	}

	return (
		<div className='flex flex-col gap-6'>
			<Suspense
				fallback={
					<Skeleton className='h-[360px] w-full rounded-xl bg-white md:h-[480px]' />
				}
			>
				<SalesMap provinces={sortedProvinces} />
			</Suspense>
			<ProvinceSalesSummary provinces={sortedProvinces} />
		</div>
	);
};
