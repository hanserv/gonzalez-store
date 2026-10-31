import {Link} from 'react-router';
import {Trash2} from 'lucide-react';
import type {CartItem} from '@/shop/interfaces/cart.interface';
import {buildCartLineId} from '@/shop/lib/cart';
import {formatCurrency} from '@/shop/lib/format';
import {QuantityStepper} from './QuantityStepper';

interface CartLineItemProps {
	item: CartItem;
	onQuantityChange: (lineId: string, quantity: number) => void;
	onRemove: (lineId: string) => void;
	onNavigate: () => void;
}

export const CartLineItem = ({
	item,
	onQuantityChange,
	onRemove,
	onNavigate,
}: CartLineItemProps) => {
	const lineId = buildCartLineId(item.variantId, item.size);
	const hasDiscount = item.price > item.finalPrice;

	return (
		<li className='flex gap-3'>
			<div className='size-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 p-1.5'>
				{item.imageUrl ? (
					<img
						src={item.imageUrl}
						alt={item.title}
						loading='lazy'
						className='size-full object-contain'
					/>
				) : null}
			</div>

			<div className='flex min-w-0 flex-1 flex-col gap-2'>
				<div className='flex items-start justify-between gap-2'>
					<div className='min-w-0'>
						<Link
							to={`/product/${item.slug}`}
							onClick={onNavigate}
							className='line-clamp-2 text-sm font-semibold text-neutral-900 hover:underline'
						>
							{item.title}
						</Link>

						{item.brandName && (
							<p className='mt-0.5 text-[11px] tracking-wider text-neutral-500 uppercase'>
								{item.brandName}
							</p>
						)}

						{item.size && (
							<p className='mt-0.5 text-xs text-neutral-500'>
								Talla {item.size}
							</p>
						)}
					</div>

					<button
						type='button'
						onClick={() => onRemove(lineId)}
						aria-label={`Quitar ${item.title} del carrito`}
						className='rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900'
					>
						<Trash2 className='size-4' />
					</button>
				</div>

				<div className='flex items-end justify-between gap-2'>
					<div className='flex flex-col'>
						<span className='text-sm font-semibold text-neutral-900'>
							{formatCurrency(item.finalPrice * item.quantity)}
						</span>
						{hasDiscount && (
							<span className='text-xs text-neutral-400 line-through'>
								{formatCurrency(item.price * item.quantity)}
							</span>
						)}
					</div>

					<QuantityStepper
						quantity={item.quantity}
						stockLimit={item.stockLimit}
						label={item.title}
						onChange={(quantity) => onQuantityChange(lineId, quantity)}
					/>
				</div>
			</div>
		</li>
	);
};
