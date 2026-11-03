import {Link} from 'react-router';
import {buttonVariants} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {Reveal} from '@/shop/components/Reveal';
import {collectionCopy} from '@/shop/data/collection';
import {CollectionRowFeature} from './CollectionRowFeature';
import {CollectionRowOffset} from './CollectionRowOffset';
import {CollectionRowPanorama} from './CollectionRowPanorama';
import {CollectionRowVertical} from './CollectionRowVertical';

export const CollectionSection = () => {
	return (
		<section
			id='coleccion'
			aria-labelledby='coleccion-title'
			className='relative bg-white'
		>
			<div className='relative mx-auto w-full max-w-6xl px-4 pt-12 pb-24 sm:px-6 md:pt-16 lg:px-8 lg:pb-32'>
				<header className='mx-auto max-w-2xl text-center'>
					<Reveal>
						<p className='text-xs font-semibold uppercase tracking-[0.22em] text-gonzalez-red'>
							{collectionCopy.eyebrow}
						</p>
					</Reveal>
					<Reveal delay={100} className='mt-3'>
						<h2
							id='coleccion-title'
							className='text-3xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl'
						>
							{collectionCopy.title}
						</h2>
					</Reveal>
				</header>

				<div className='mt-14 space-y-10 md:mt-16 md:space-y-14'>
					<CollectionRowVertical />
					<CollectionRowFeature />
					<CollectionRowPanorama />
					<CollectionRowOffset />
				</div>

				<Reveal delay={150} className='mt-14 flex justify-center md:mt-16'>
					<Link
						to='/store'
						className={cn(
							buttonVariants({size: 'lg'}),
							'h-11 rounded-full bg-neutral-950 px-8 text-sm text-white hover:bg-neutral-800',
						)}
					>
						{collectionCopy.ctaLabel}
					</Link>
				</Reveal>
			</div>
		</section>
	);
};
