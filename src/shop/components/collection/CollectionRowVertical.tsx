import {Reveal} from '@/shop/components/Reveal';
import {collectionVerticalRow} from '@/shop/data/collection';
import {CollectionPhoto} from './CollectionPhoto';

export const CollectionRowVertical = () => {
	return (
		<div
			role='group'
			aria-label='Galería de la colección'
			tabIndex={0}
			className='-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden'
		>
			{collectionVerticalRow.map((image, index) => (
				<Reveal
					key={image.src}
					delay={index * 130}
					className='w-[78%] shrink-0 snap-start sm:w-auto'
				>
					<CollectionPhoto image={image} aspectClassName='aspect-[3/4]' />
				</Reveal>
			))}
		</div>
	);
};
