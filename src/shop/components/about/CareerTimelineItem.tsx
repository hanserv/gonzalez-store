import {cn} from '@/lib/utils';
import type {CareerStage} from '@/shop/data/career-stages';

interface CareerTimelineItemProps {
	stage: CareerStage;
	index: number;
	total: number;
}

export const CareerTimelineItem = ({stage, index}: CareerTimelineItemProps) => {
	const isImageRight = index % 2 === 0;

	return (
		<div className='relative grid grid-cols-1 items-center gap-8 py-12 md:gap-12 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-0 lg:py-24'>
			{/* Línea central y nodo (solo escritorio) */}
			<div
				className='absolute left-6 top-0 hidden h-full w-px -translate-x-1/2 bg-foreground/10 lg:left-1/2 lg:block'
				aria-hidden='true'
			/>
			<div
				className='absolute left-6 top-1/2 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gonzalez-red lg:left-1/2 lg:block'
				aria-hidden='true'
			/>

			{/* Línea lateral y nodo (móvil/tablet) */}
			<div
				className='absolute left-6 top-0 h-full w-px -translate-x-1/2 bg-foreground/10 lg:hidden'
				aria-hidden='true'
			/>
			<div
				className='absolute left-6 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gonzalez-red lg:hidden'
				aria-hidden='true'
			/>

			{/* Columna texto */}
			<div
				className={cn(
					'relative ml-12 lg:ml-0 lg:row-start-1',
					isImageRight
						? 'lg:col-start-1 lg:justify-self-end lg:pr-6'
						: 'lg:col-start-3 lg:justify-self-start lg:pl-6',
				)}
			>
				<div
					className={cn(
						'w-full max-w-md rounded-lg bg-white p-6 shadow-xs ring-1 ring-foreground/10',
						isImageRight ? 'lg:text-right' : 'lg:text-left',
					)}
				>
					<div
						className={cn(
							'mb-3 flex items-center gap-3 text-sm',
							isImageRight ? 'lg:justify-end' : 'lg:justify-start',
						)}
					>
						<span className='tabular-nums text-gonzalez-red'>
							{stage.period}
						</span>
						{stage.tags?.length ? (
							<span className='hidden items-center gap-2 sm:flex'>
								{stage.tags.map((tag) => (
									<span
										key={tag}
										className='rounded-full border border-foreground/15 px-2 py-0.5 text-xs text-neutral-600'
									>
										{tag}
									</span>
								))}
							</span>
						) : null}
					</div>
					<h3 className='mb-4 text-xl font-semibold font-cinzel tracking-tight text-neutral-900 sm:text-2xl lg:text-3xl'>
						{stage.title}
					</h3>
					<p className='text-base leading-relaxed text-neutral-600'>
						{stage.description}
					</p>
				</div>
			</div>

			{/* Columna imagen */}
			<div
				className={cn(
					'relative ml-12 lg:ml-0 lg:row-start-1',
					isImageRight
						? 'lg:col-start-3 lg:justify-self-start lg:pl-6'
						: 'lg:col-start-1 lg:justify-self-end lg:pr-6',
				)}
			>
				<div className='w-full max-w-[400px] overflow-hidden rounded-xl ring-1 ring-foreground/10'>
					<div className='aspect-[4/3] w-full'>
						<img
							src={stage.image}
							alt={stage.imageAlt}
							className='h-full w-full object-cover'
							loading='lazy'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
