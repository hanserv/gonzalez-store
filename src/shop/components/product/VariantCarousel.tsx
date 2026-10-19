import {useEffect, useState} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import type {ShopVariantImage} from '@/shop/interfaces/variant.interface';
import {cn} from '@/lib/utils';

interface VariantCarouselProps {
	images: ShopVariantImage[];
	alt: string;
}

export const VariantCarousel = ({images, alt}: VariantCarouselProps) => {
	const [emblaRef, emblaApi] = useEmblaCarousel();
	const [selectedIndex, setSelectedIndex] = useState(0);

	useEffect(() => {
		if (!emblaApi) return;

		const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

		emblaApi.on('select', onSelect);
		onSelect();

		return () => {
			emblaApi.off('select', onSelect);
		};
	}, [emblaApi]);

	if (images.length === 0) {
		return <div className='aspect-square w-full rounded-xl bg-neutral-200' />;
	}

	return (
		<div className='relative'>
			<div className='overflow-hidden rounded-xl' ref={emblaRef}>
				<div className='flex'>
					{images.map((image) => (
						<div className='min-w-0 flex-[0_0_100%]' key={image.id}>
							<img
								src={image.url}
								alt={alt}
								className='aspect-square w-full bg-neutral-100 object-cover'
							/>
						</div>
					))}
				</div>
			</div>

			{images.length > 1 && (
				<>
					<button
						type='button'
						onClick={() => emblaApi?.scrollPrev()}
						aria-label='Imagen anterior'
						className='absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-neutral-900 shadow-md transition-colors hover:bg-white'
					>
						<ChevronLeft className='size-5' />
					</button>

					<button
						type='button'
						onClick={() => emblaApi?.scrollNext()}
						aria-label='Imagen siguiente'
						className='absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-neutral-900 shadow-md transition-colors hover:bg-white'
					>
						<ChevronRight className='size-5' />
					</button>

					<div className='absolute inset-x-0 bottom-3 flex justify-center gap-2'>
						{images.map((image, index) => (
							<button
								type='button'
								key={image.id}
								onClick={() => emblaApi?.scrollTo(index)}
								aria-label={`Ir a la imagen ${index + 1}`}
								className={cn(
									'size-2.5 rounded-full transition-colors',
									index === selectedIndex
										? 'bg-neutral-900'
										: 'bg-white/70 hover:bg-white',
								)}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
};
