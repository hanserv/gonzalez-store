import {careerStages} from '@/shop/data/career-stages';
import {CareerTimelineItem} from './CareerTimelineItem';

export const CareerTimeline = () => {
	return (
		<section className='bg-white'>
			<div className='mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24'>
				<header>
					<div>
						<h1 className='text-3xl font-bold  text-center text-neutral-950 md:text-4xl pt-2'>
							La historia de Gonzalez
						</h1>
						<div className='flex align-middle justify-center mt-2 mb-2'>
							<div className='h-1 w-105 bg-gonzalez-red' />
						</div>
					</div>
				</header>
				<div className='relative'>
					{careerStages.map((stage, index) => (
						<CareerTimelineItem
							key={stage.id}
							stage={stage}
							index={index}
							total={careerStages.length}
						/>
					))}
				</div>
			</div>
		</section>
	);
};
