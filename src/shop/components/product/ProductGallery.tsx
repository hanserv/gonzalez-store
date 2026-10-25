import {useEffect, useState} from 'react';
import type {ShopVariantImage} from '@/shop/interfaces/variant.interface';
import {cn} from '@/lib/utils';

interface ProductGalleryProps {
	images: ShopVariantImage[];
	alt: string;
}

export const ProductGallery = ({images, alt}: ProductGalleryProps) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	useEffect(() => {
		setSelectedIndex(0);
	}, [images]);

	if (images.length === 0) {
		return (
			<div className='aspect-square w-full rounded-2xl bg-[#F1F3F5]' />
		);
	}

	const currentImage = images[selectedIndex];

	return (
		<div className='flex flex-col gap-3 lg:flex-row lg:items-start'>
			{images.length > 1 && (
				<div className='order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible lg:pb-0'>
					{images.map((image, index) => {
						const isActive = index === selectedIndex;

						return (
							<button
								key={image.id}
								type='button'
								onClick={() => setSelectedIndex(index)}
								aria-label={`Ver imagen ${index + 1}`}
								aria-pressed={isActive}
								className={cn(
									'h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F1F3F5] p-0.5 lg:h-[64px] lg:w-[64px] lg:rounded-xl lg:p-1',
									isActive ? 'ring-2 ring-[#111418]' : 'ring-1 ring-[#E5E7EB]',
								)}
							>
								<img
									src={image.url}
									alt=''
									loading='lazy'
									className='h-full w-full object-contain'
								/>
							</button>
						);
					})}
				</div>
			)}

			<div className='order-1 relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F1F3F5] lg:order-2'>
				<img
					src={currentImage.url}
					alt={alt}
					className='h-full w-full object-contain p-4 md:p-6'
				/>
			</div>
		</div>
	);
};
