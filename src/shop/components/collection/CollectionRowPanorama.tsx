import {Reveal} from '@/shop/components/Reveal';
import {collectionPanorama} from '@/shop/data/collection';
import {CollectionPhoto} from './CollectionPhoto';

export const CollectionRowPanorama = () => {
	return (
		<Reveal className='min-w-0'>
			<CollectionPhoto
				image={collectionPanorama}
				aspectClassName='aspect-[4/3] sm:aspect-[21/9]'
				imageClassName='absolute top-1/2 left-1/2 h-16 w-24 -translate-x-1/2 -translate-y-1/2 object-contain sm:h-20 sm:w-32 lg:h-24 lg:w-40'
			/>
		</Reveal>
	);
};
