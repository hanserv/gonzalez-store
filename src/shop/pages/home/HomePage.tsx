import {HeroSection} from '@/shop/components/HeroSection';
import {ProvinceSalesSection} from '@/shop/components/sales-map/ProvinceSalesSection';

export const HomePage = () => {
	return (
		<>
			<HeroSection />
			<section className='bg-white px-6 pb-16 pt-6 md:pt-10'>
				<div className='mx-auto max-w-6xl'>
					<div className='mb-6 text-center'>
						<h2 className='text-3xl font-bold text-neutral-950 md:text-4xl'>
							Ventas por provincia
						</h2>
					</div>
					<ProvinceSalesSection />
				</div>
			</section>
		</>
	);
};
