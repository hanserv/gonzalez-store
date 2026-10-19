import {Skeleton} from '@/components/ui/skeleton';
import {CardDivider} from '@/shop/components/catalog/CardDivider';

export const ProductCardSkeleton = () => (
	<div className='overflow-hidden rounded-2xl bg-white shadow-xs ring-1 ring-foreground/10'>
		<Skeleton className='aspect-square w-full rounded-none' />

		<CardDivider />

		<div className='flex items-end justify-between gap-3 p-4'>
			<div className='w-full space-y-2.5'>
				<Skeleton className='h-3 w-16' />
				<Skeleton className='h-4 w-3/4' />
			</div>

			<Skeleton className='h-6 w-20 shrink-0' />
		</div>
	</div>
);
