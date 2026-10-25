import {Link} from 'react-router';
import type {ShopVariantSibling} from '@/shop/interfaces/variant.interface';
import {cn} from '@/lib/utils';

interface SiblingVariantsProps {
	currentVariantId: string;
	siblings: ShopVariantSibling[];
}

export const SiblingVariants = ({currentVariantId, siblings}: SiblingVariantsProps) => {
	if (siblings.length === 0) return null;

	return (
		<div className='flex flex-wrap gap-2'>
			{siblings.map((sibling) => {
				const isActive = sibling.id === currentVariantId;

				return (
					<Link
						key={sibling.id}
						to={`/product/${sibling.slug}`}
						aria-current={isActive}
						className={cn(
							'h-12 w-12 overflow-hidden rounded-xl bg-[#F1F3F5] p-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111418]',
							isActive ? 'ring-2 ring-[#111418]' : 'ring-1 ring-[#E5E7EB]',
						)}
					>
						{sibling.coverImageUrl ? (
							<img
								src={sibling.coverImageUrl}
								alt={sibling.name}
								loading='lazy'
								className='h-full w-full object-contain'
							/>
						) : (
							<div className='h-full w-full' />
						)}
					</Link>
				);
			})}
		</div>
	);
};
