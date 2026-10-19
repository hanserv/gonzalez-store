import {Slider as SliderPrimitive} from '@base-ui/react/slider';
import {cn} from 'cn';

function Slider({
	className,
	value,
	...props
}: Omit<SliderPrimitive.Root.Props<number | readonly number[]>, 'children'>) {
	const thumbCount = Array.isArray(value) ? value.length : 1;

	return (
		<SliderPrimitive.Root
			data-slot='slider'
			className={cn(
				'relative flex w-full touch-none select-none items-center',
				className,
			)}
			value={value}
			{...props}
		>
			<SliderPrimitive.Control className='relative flex h-5 w-full items-center'>
				<SliderPrimitive.Track className='relative h-1.5 w-full rounded-full bg-primary/20'>
					<SliderPrimitive.Indicator className='rounded-full bg-primary' />

					{Array.from({length: thumbCount}).map((_, index) => (
						<SliderPrimitive.Thumb
							key={index}
							index={index}
							data-slot='slider-thumb'
							className='block size-4 rounded-full border border-primary/50 bg-background shadow-sm transition-shadow outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
						/>
					))}
				</SliderPrimitive.Track>
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	);
}

export {Slider};
