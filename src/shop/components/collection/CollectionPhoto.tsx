import type {ReactNode} from 'react';
import {cn} from '@/lib/utils';
import type {CollectionImage} from '@/shop/data/collection';

interface CollectionPhotoProps {
	image: CollectionImage;
	aspectClassName: string;
	className?: string;
	imageClassName?: string;
	children?: ReactNode;
}

export const CollectionPhoto = ({
	image,
	aspectClassName,
	className,
	imageClassName,
	children,
}: CollectionPhotoProps) => {
	return (
		<div
			className={cn(
				'group relative w-full min-w-0 overflow-hidden rounded-xl bg-neutral-100',
				aspectClassName,
				className,
			)}
		>
			<picture className='block h-full w-full'>
				{image.avifSrcSet ? (
					<source
						type='image/avif'
						srcSet={image.avifSrcSet}
						sizes={image.sizes}
					/>
				) : null}
				{image.webpSrcSet ? (
					<source
						type='image/webp'
						srcSet={image.webpSrcSet}
						sizes={image.sizes}
					/>
				) : null}
				<img
					src={image.src}
					srcSet={image.srcSet}
					sizes={image.sizes}
					alt={image.alt}
					width={image.width}
					height={image.height}
					loading='lazy'
					decoding='async'
					className={cn(
						'h-full w-full object-cover transition-transform duration-500 ease-out motion-reduce:transition-none',
						'can-hover:motion-safe:group-hover:scale-105',
						imageClassName,
					)}
				/>
			</picture>
			{children}
		</div>
	);
};
