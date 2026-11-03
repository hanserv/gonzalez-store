import {useEffect, useRef, useState} from 'react';
import type {ComponentProps} from 'react';
import {cn} from '@/lib/utils';

export type RevealDirection = 'up' | 'left' | 'right';

const REVEAL_THRESHOLD = 0.18;

const hiddenTransforms: Record<RevealDirection, string> = {
	up: 'translate-y-6',
	left: 'translate-y-6 lg:translate-y-0 lg:-translate-x-8',
	right: 'translate-y-6 lg:translate-y-0 lg:translate-x-8',
};

interface RevealProps extends ComponentProps<'div'> {
	direction?: RevealDirection;
	delay?: number;
	scale?: boolean;
}

export const Reveal = ({
	direction = 'up',
	delay = 0,
	scale = false,
	children,
	className,
	style,
	...props
}: RevealProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const [isRevealed, setIsRevealed] = useState(() => {
		if (typeof window === 'undefined') return false;

		return (
			window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
			typeof IntersectionObserver === 'undefined'
		);
	});

	useEffect(() => {
		const element = ref.current;
		if (!element || typeof IntersectionObserver === 'undefined') return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;

				setIsRevealed(true);
				observer.disconnect();
			},
			{threshold: REVEAL_THRESHOLD},
		);

		observer.observe(element);

		return () => observer.disconnect();
	}, []);

	return (
		<div
			{...props}
			ref={ref}
			style={{...style, transitionDelay: `${delay}ms`}}
			className={cn(
				scale
					? cn(
							'transition-[opacity,scale] duration-700 ease-out motion-reduce:transition-none',
							isRevealed ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
						)
					: cn(
							'transition-[opacity,translate,scale] duration-700 ease-out motion-reduce:transition-none',
							isRevealed
								? 'translate-x-0 translate-y-0 opacity-100'
								: cn('opacity-0', hiddenTransforms[direction]),
						),
				className,
			)}
		>
			{children}
		</div>
	);
};
