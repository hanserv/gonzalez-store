import {X} from 'lucide-react';

interface FilterChipProps {
	label: string;
	onRemove: () => void;
}

export const FilterChip = ({label, onRemove}: FilterChipProps) => (
	<span className='inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white py-1 pr-1 pl-3 text-sm text-neutral-700'>
		{label}
		<button
			type='button'
			onClick={onRemove}
			aria-label={`Quitar filtro ${label}`}
			className='rounded-full p-0.5 text-neutral-400 transition-colors hover:text-neutral-900'
		>
			<X className='size-3.5' />
		</button>
	</span>
);
