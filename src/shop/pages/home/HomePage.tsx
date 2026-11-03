import {CollectionSection} from '@/shop/components/collection/CollectionSection';
import {HeroSection} from '@/shop/components/HeroSection';
import {ProvinceSalesSection} from '@/shop/components/sales-map/ProvinceSalesSection';

export const HomePage = () => {
	return (
		<>
			<HeroSection />
			<CollectionSection />
			<section className='bg-gray-50 px-6 pb-16 pt-6 md:pt-10'>
				<div className='mx-auto max-w-6xl'>
					<div className='mb-6 text-center'>
						<p className='text-xs font-semibold uppercase tracking-[0.22em] text-gonzalez-red'>
							Nuestro alcance
						</p>
						<h2 className='mt-3 text-3xl font-bold text-neutral-950 md:text-4xl'>
							Ventas por provincia
						</h2>
					</div>
					<ProvinceSalesSection />
				</div>
			</section>
		</>
	);
};
