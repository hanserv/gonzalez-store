'use client';

import {motion, stagger, useAnimate} from 'motion/react';
import * as React from 'react';
import {cn} from '@/lib/utils';

type TextGenerateEffectProps = Omit<React.ComponentProps<'div'>, 'children'> & {
	words: string;
	filter?: boolean;
	duration?: number;
	staggerDelay?: number;
};

function TextGenerateEffect({
	ref,
	words,
	className,
	filter = true,
	duration = 0.8,
	staggerDelay = 0.06,
	...props
}: TextGenerateEffectProps) {
	const [scope, animate] = useAnimate();
	const wordsArray = React.useMemo(() => words.split(' '), [words]);

	React.useEffect(() => {
		if (scope.current) {
			animate(
				'[data-letter]',
				{
					opacity: 1,
					filter: filter ? 'blur(0px)' : 'none',
				},
				{
					duration,
					delay: stagger(staggerDelay),
				},
			);
		}
	}, [animate, duration, filter, scope, staggerDelay]);

	return (
		<div
			className={cn('font-bold', className)}
			data-slot='text-generate-effect'
			ref={ref}
			{...props}
		>
			<motion.div ref={scope}>
				{wordsArray.map((word, wordIdx) => (
					<React.Fragment key={`${word}-${wordIdx}`}>
						<span className='inline-block whitespace-nowrap'>
							{Array.from(word).map((letter, letterIdx) => (
								<motion.span
									data-letter
									className='opacity-0 will-change-transform'
									key={`${letter}-${letterIdx}`}
									style={{
										filter: filter ? 'blur(4px)' : 'none',
									}}
								>
									{letter}
								</motion.span>
							))}
						</span>
						{wordIdx < wordsArray.length - 1 && ' '}
					</React.Fragment>
				))}
			</motion.div>
		</div>
	);
}

export {TextGenerateEffect, type TextGenerateEffectProps};
export default TextGenerateEffect;
