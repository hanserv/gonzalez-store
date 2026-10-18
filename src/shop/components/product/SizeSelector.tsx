import type {ShopVariantSize} from '@/shop/interfaces/variant.interface';
import {cn} from '@/lib/utils';

interface SizeSelectorProps {
	sizes: ShopVariantSize[];
	selectedSize: string | null;
	onSelect: (size: string) => void;
}

export const SizeSelector = ({
	sizes,
	selectedSize,
	onSelect,
}: SizeSelectorProps) => {
	if (sizes.length === 0) {
		return (
			<p className='rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600'>
				Este producto no tiene tallas disponibles.
			</p>
		);
	}

	return (
		<div className='flex flex-wrap gap-2'>
			{sizes.map((size) => {
				const isOutOfStock = size.stock <= 0;
				const isSelected = selectedSize === size.size;

				return (
					<button
						type='button'
						key={size.id}
						disabled={isOutOfStock}
						onClick={() => onSelect(size.size)}
						aria-pressed={isSelected}
						className={cn(
							'min-w-14 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
							isOutOfStock
								? 'cursor-not-allowed border-neutral-200 text-neutral-300 line-through'
								: isSelected
									? 'border-neutral-900 bg-neutral-900 text-white'
									: 'border-neutral-300 text-neutral-900 hover:border-neutral-900',
						)}
					>
						{size.size}
					</button>
				);
			})}
		</div>
	);
};
