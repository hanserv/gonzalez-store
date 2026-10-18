import {Link} from 'react-router';
import type {ShopVariantSibling} from '@/shop/interfaces/variant.interface';
import {cn} from '@/lib/utils';

interface SiblingVariantsProps {
	currentVariantId: string;
	siblings: ShopVariantSibling[];
}

export const SiblingVariants = ({
	currentVariantId,
	siblings,
}: SiblingVariantsProps) => {
	if (siblings.length === 0) return null;

	return (
		<div>
			<p className='mb-2 text-sm font-medium text-neutral-700'>Otros colores</p>

			<div className='flex flex-wrap gap-3'>
				{siblings.map((sibling) => (
					<Link
						key={sibling.id}
						to={`/product/${sibling.slug}`}
						aria-current={sibling.id === currentVariantId}
						className={cn(
							'flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm transition-colors',
							sibling.id === currentVariantId
								? 'border-neutral-900 text-neutral-900'
								: 'border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900',
						)}
					>
						<span className='size-7 overflow-hidden rounded-full bg-neutral-100'>
							{sibling.coverImageUrl ? (
								<img
									src={sibling.coverImageUrl}
									alt=''
									loading='lazy'
									className='size-full object-cover'
								/>
							) : null}
						</span>
						{sibling.name}
					</Link>
				))}
			</div>
		</div>
	);
};
