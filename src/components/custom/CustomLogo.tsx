// src/components/custom/CustomLogo.tsx
import {Link} from 'react-router';
import {cn} from '@/lib/utils';
import type {ReactNode} from 'react';

interface Props {
	title?: ReactNode;
	subtitle?: string;
	url?: string;
	logoSrc?: string;
	subtitleClassName?: string;
	onClick?: () => void;
}

export const CustomLogo = ({
	title = 'gonzalez',
	subtitle,
	url = '/',
	logoSrc,
	subtitleClassName,
	onClick,
}: Props) => {
	return (
		<Link
			to={url}
			onClick={onClick}
			className='group flex items-center gap-2 whitespace-nowrap'
		>
			{logoSrc && (
				<img
					src={logoSrc}
					alt=''
					aria-hidden='true'
					draggable={false}
					className='h-8 w-auto select-none object-contain transition-all duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 group-hover:drop-shadow-lg motion-reduce:transition-none motion-reduce:group-hover:transform-none'
				/>
			)}

			<span className='font-cinzel font-bold text-xl m-0 whitespace-nowrap tracking-widest'>
				{title}
			</span>

			{subtitle && (
				<p
					className={cn(
						'text-muted-foreground m-0 whitespace-nowrap',
						subtitleClassName,
					)}
				>
					{subtitle}
				</p>
			)}
		</Link>
	);
};
