import {Reveal} from '@/shop/components/Reveal';
import {collectionFeatureRow} from '@/shop/data/collection';
import {CollectionPhoto} from './CollectionPhoto';

export const CollectionRowFeature = () => {
	return (
		<div className='grid gap-5 md:grid-cols-[2fr_1fr]'>
			<Reveal className='min-w-0'>
				<CollectionPhoto
					image={collectionFeatureRow.large}
					aspectClassName='aspect-[16/10]'
				/>
			</Reveal>

			<div className='relative min-w-0 md:h-full'>
				<div className='grid grid-cols-2 gap-5 md:absolute md:inset-0 md:grid-cols-1 md:grid-rows-2'>
					{collectionFeatureRow.small.map((image, index) => (
						<Reveal
							key={image.src}
							delay={(index + 1) * 130}
							className='min-h-0 min-w-0 md:h-full'
						>
							<CollectionPhoto
								image={image}
								aspectClassName='aspect-[16/10]'
								className='md:aspect-auto md:h-full'
							/>
						</Reveal>
					))}
				</div>
			</div>
		</div>
	);
};
