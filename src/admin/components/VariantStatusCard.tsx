import {Card, CardContent} from '@/components/ui/card';

interface VariantStatusCardProps {
	active: number;
	inactive: number;
}

export const VariantStatusCard = ({
	active,
	inactive,
}: VariantStatusCardProps) => {
	const total = active + inactive;
	const activePercent = total === 0 ? 0 : Math.round((active / total) * 100);

	return (
		<Card>
			<CardContent className='flex flex-col gap-3'>
				<div className='flex items-baseline justify-between'>
					<p className='text-sm text-muted-foreground'>
						Variantes activas vs. inactivas
					</p>
					<p className='text-sm font-semibold'>{activePercent}% activas</p>
				</div>

				<div
					className='h-2 w-full overflow-hidden rounded-full bg-muted'
					role='progressbar'
					aria-valuenow={activePercent}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label='Porcentaje de variantes activas'
				>
					<div
						className='h-full rounded-full bg-black transition-all'
						style={{width: `${activePercent}%`}}
					/>
				</div>

				<div className='flex justify-between text-sm'>
					<span>
						<span className='font-bold'>{active}</span> activas
					</span>
					<span className='text-muted-foreground'>
						<span className='font-bold'>{inactive}</span> inactivas
					</span>
				</div>
			</CardContent>
		</Card>
	);
};
