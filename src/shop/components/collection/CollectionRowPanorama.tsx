import {Reveal} from '@/shop/components/Reveal';
import {collectionCopy, collectionPanorama} from '@/shop/data/collection';
import {CollectionPhoto} from './CollectionPhoto';

export const CollectionRowPanorama = () => {
	return (
		<Reveal className='min-w-0'>
			<CollectionPhoto
				image={collectionPanorama}
				aspectClassName='aspect-[4/3] sm:aspect-[21/9]'
			>
				<div
					aria-hidden='true'
					className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5'
				/>
				<p className='absolute inset-x-0 bottom-0 max-w-2xl p-6 text-balance text-2xl font-semibold leading-tight text-white sm:p-8 sm:text-3xl lg:p-10 lg:text-4xl'>
					{collectionCopy.panoramaPhrase}
				</p>
			</CollectionPhoto>
		</Reveal>
	);
};
