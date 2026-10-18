import {useRef, useState} from 'react';
import {Link} from 'react-router';
import {Star} from 'lucide-react';
import type {ShopCatalogItem} from '@/shop/interfaces/catalog.interface';
import {CardDivider} from '@/shop/components/catalog/CardDivider';
import {formatCurrency} from '@/shop/lib/format';
import {cn} from '@/lib/utils';

const MAX_VISIBLE_SWATCHES = 6;

export const ProductCard = ({item}: {item: ShopCatalogItem}) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const hasPreloaded = useRef(false);

	const displayedVariant = item.variants[activeIndex] ?? item.variants[0];

	const preloadImages = () => {
		if (hasPreloaded.current) return;
		hasPreloaded.current = true;

		for (const variant of item.variants) {
			if (variant.coverImageUrl) {
				const image = new Image();
				image.src = variant.coverImageUrl;
			}
		}
	};

	if (!displayedVariant) return null;

	const hasDiscount = displayedVariant.discountPercentage > 0;
	const visibleVariants = item.variants.slice(0, MAX_VISIBLE_SWATCHES);
	const hiddenVariantCount = item.variants.length - visibleVariants.length;

	return (
		<div
			className={cn(
				'group relative overflow-hidden rounded-2xl bg-white shadow-xs ring-1 ring-foreground/10 transition-shadow hover:shadow-md',
				item.isPopular && 'ring-gonzalez-golden/70',
			)}
			onMouseEnter={preloadImages}
		>
			<Link to={`/product/${displayedVariant.slug}`} className='block'>
				<div className='relative aspect-square overflow-hidden bg-white p-6'>
					{displayedVariant.coverImageUrl ? (
						<img
							src={displayedVariant.coverImageUrl}
							alt={item.name}
							loading='lazy'
							className='size-full object-contain transition-transform duration-500 ease-out group-hover:scale-110'
						/>
					) : null}

					{item.isPopular && (
						<span className='pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-linear-to-br from-[#e7d3a1] via-gonzalez-golden to-[#b8934a] px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-neutral-950 uppercase shadow-sm ring-1 ring-white/50'>
							<Star className='size-3 fill-current' strokeWidth={0} />
							Popular
						</span>
					)}

					{hasDiscount && (
						<span className='pointer-events-none absolute top-3 right-3 rounded-full bg-neutral-950/75 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-white uppercase backdrop-blur-sm'>
							-{displayedVariant.discountPercentage}%
						</span>
					)}
				</div>

				<CardDivider />

				<div className='flex items-end justify-between gap-3 p-4'>
					<div className='min-w-0'>
						{item.brandName && (
							<p className='text-[11px] font-semibold tracking-wider text-neutral-500 uppercase'>
								{item.brandName}
							</p>
						)}

						<h3 className='mt-1 text-[15px] leading-snug font-semibold text-neutral-900'>
							{item.name}
						</h3>

						<p className='mt-0.5 hidden text-sm text-neutral-500 md:block'>
							{displayedVariant.name}
						</p>

						{item.activeVariantCount > 1 && (
							<p className='mt-1 text-xs text-neutral-500'>
								{item.activeVariantCount} variantes
							</p>
						)}
					</div>

					<div className='shrink-0 text-right'>
						<p className='text-xl font-bold text-neutral-900'>
							{formatCurrency(displayedVariant.finalPrice)}
						</p>
						{hasDiscount && (
							<p className='text-sm text-neutral-400 line-through'>
								{formatCurrency(displayedVariant.price)}
							</p>
						)}
					</div>
				</div>
			</Link>

			{item.variants.length > 1 && (
				<div className='pointer-events-none absolute inset-x-0 top-0 hidden aspect-square opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 md:block'>
					<div className='absolute inset-x-0 bottom-3 flex translate-y-2 justify-center px-3 transition-transform duration-200 group-focus-within:translate-y-0 group-hover:translate-y-0'>
						<div
							className='pointer-events-none flex items-center gap-1.5 rounded-full bg-white p-1.5 shadow-lg ring-1 ring-black/5 group-focus-within:pointer-events-auto group-hover:pointer-events-auto'
							onMouseLeave={() => setActiveIndex(0)}
						>
							{visibleVariants.map((variant, index) => (
								<Link
									key={variant.id}
									to={`/product/${variant.slug}`}
									aria-label={`Ver ${item.name} ${variant.name}`}
									onMouseEnter={() => setActiveIndex(index)}
									onFocus={() => setActiveIndex(index)}
									className={cn(
										'size-7 shrink-0 overflow-hidden rounded-full bg-neutral-100 ring-2 transition-all duration-150',
										index === activeIndex
											? 'ring-neutral-900'
											: 'ring-transparent hover:ring-neutral-300',
									)}
								>
									{variant.coverImageUrl ? (
										<img
											src={variant.coverImageUrl}
											alt=''
											loading='lazy'
											className='size-full object-contain p-0.5'
										/>
									) : null}
								</Link>
							))}

							{hiddenVariantCount > 0 && (
								<span
									aria-hidden
									className='grid size-7 shrink-0 place-items-center rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-600'
								>
									+{hiddenVariantCount}
								</span>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
