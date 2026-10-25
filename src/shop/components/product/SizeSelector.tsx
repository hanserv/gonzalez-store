import type {ShopVariantSize} from '@/shop/interfaces/variant.interface';
import {cn} from '@/lib/utils';

interface SizeSelectorProps {
	sizes: ShopVariantSize[];
	selectedSize: string | null;
	onSelect: (size: string) => void;
}

export const SizeSelector = ({sizes, selectedSize, onSelect}: SizeSelectorProps) => {
	if (sizes.length === 0) {
		return (
			<p className='rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] px-4 py-3 text-sm text-[#6B7280]'>
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
							'h-9 min-w-[44px] rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111418]',
							isOutOfStock
								? 'cursor-not-allowed bg-[#F1F3F5] text-[#9CA3AF] line-through'
								: isSelected
									? 'bg-[#111418] text-white'
									: 'bg-[#F1F3F5] text-[#111418] hover:bg-[#E9ECEF]',
						)}
					>
						{size.size}
					</button>
				);
			})}
		</div>
	);
};
