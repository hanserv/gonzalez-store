import {Reveal} from '@/shop/components/Reveal';
import {collectionOffsetRow} from '@/shop/data/collection';
import {CollectionPhoto} from './CollectionPhoto';

export const CollectionRowOffset = () => {
	return (
		<div className='grid gap-10 md:grid-cols-2 md:gap-5'>
			{collectionOffsetRow.map((item, index) => (
				<Reveal
					key={item.id}
					delay={index * 130}
					className={index === 1 ? 'min-w-0 md:mt-20' : 'min-w-0'}
				>
					<figure>
						<CollectionPhoto
							image={item.image}
							aspectClassName='aspect-square'
						/>
						<figcaption className='mt-4 text-center'>
							<h3 className='text-xl font-semibold text-neutral-950 md:text-2xl'>
								{item.title}
							</h3>
							<p className='mt-1 text-sm leading-relaxed text-neutral-600'>
								{item.description}
							</p>
						</figcaption>
					</figure>
				</Reveal>
			))}
		</div>
	);
};
