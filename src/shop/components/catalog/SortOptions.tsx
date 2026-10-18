import {Check} from 'lucide-react';
import {
	CATALOG_SORT_OPTIONS,
	type CatalogSortValue,
} from './catalog-filters';
import {cn} from '@/lib/utils';

interface SortOptionsProps {
	value: CatalogSortValue;
	onChange: (value: CatalogSortValue) => void;
}

export const SortOptions = ({value, onChange}: SortOptionsProps) => (
	<div className='flex flex-col gap-2'>
		{CATALOG_SORT_OPTIONS.map((option) => {
			const isSelected = option.value === value;

			return (
				<button
					type='button'
					key={option.value}
					onClick={() => onChange(option.value)}
					aria-pressed={isSelected}
					className={cn(
						'flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors',
						isSelected
							? 'border-neutral-900 bg-neutral-900 text-white'
							: 'border-neutral-200 text-neutral-700 hover:border-neutral-400',
					)}
				>
					{option.label}
					{isSelected && <Check className='size-4 shrink-0' />}
				</button>
			);
		})}
	</div>
);
