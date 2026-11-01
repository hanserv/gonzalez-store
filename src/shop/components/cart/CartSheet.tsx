import {useEffect} from 'react';
import {Loader2, MessageCircle} from 'lucide-react';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import {useCartValidation} from '@/shop/hooks/cart/useCartValidation';
import {
	buildCartLineId,
	buildCartUpdateMessage,
	buildWhatsAppCartUrl,
} from '@/shop/lib/cart';
import {formatCurrency} from '@/shop/lib/format';
import {
	selectCartCount,
	selectCartSavings,
	selectCartSubtotal,
	useCartStore,
} from '@/shop/stores/cart.store';
import {CartEmptyState} from './CartEmptyState';
import {CartLineItem} from './CartLineItem';

export const CartSheet = () => {
	const items = useCartStore((state) => state.items);
	const isOpen = useCartStore((state) => state.isOpen);
	const setCartOpen = useCartStore((state) => state.setCartOpen);
	const closeCart = useCartStore((state) => state.closeCart);
	const removeItem = useCartStore((state) => state.removeItem);
	const updateQuantity = useCartStore((state) => state.updateQuantity);
	const reconcileItems = useCartStore((state) => state.reconcileItems);
	const count = useCartStore(selectCartCount);
	const subtotal = useCartStore(selectCartSubtotal);
	const savings = useCartStore(selectCartSavings);

	const {data, isFetching, isError} = useCartValidation(isOpen);

	useEffect(() => {
		if (!data) return;

		const summary = reconcileItems(data);
		const message = buildCartUpdateMessage(summary);

		if (message) toast.info(message);
	}, [data, reconcileItems]);

	const whatsappUrl = buildWhatsAppCartUrl(items);

	return (
		<Sheet open={isOpen} onOpenChange={setCartOpen}>
			<SheetContent
				side='right'
				className='w-full! gap-0 sm:max-w-md!'
				overlayClassName='bg-black/40 supports-backdrop-filter:backdrop-blur-md'
				lang='es'
				translate='no'
			>
				<SheetHeader className='border-b border-neutral-100'>
					<SheetTitle className='text-lg'>Tu carrito</SheetTitle>
					<SheetDescription>
						{count === 0
							? 'Aún no has agregado artículos.'
							: `${count} ${count === 1 ? 'artículo' : 'artículos'}`}
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<CartEmptyState onNavigate={closeCart} />
				) : (
					<div className='min-h-0 flex-1 overflow-y-auto px-4 py-4'>
						<ul className='flex flex-col gap-4'>
							{items.map((item) => (
								<CartLineItem
									key={buildCartLineId(item.variantId, item.size)}
									item={item}
									onQuantityChange={updateQuantity}
									onRemove={removeItem}
									onNavigate={closeCart}
								/>
							))}
						</ul>
					</div>
				)}

				{items.length > 0 && (
					<SheetFooter className='border-t border-neutral-100'>
						<div className='flex items-center justify-between text-sm'>
							<span className='text-neutral-600'>Subtotal</span>
							<span className='text-base font-semibold text-neutral-900'>
								{formatCurrency(subtotal)}
							</span>
						</div>

						{savings > 0 && (
							<div className='flex items-center justify-between text-xs text-neutral-500'>
								<span>Ahorras</span>
								<span>{formatCurrency(savings)}</span>
							</div>
						)}

						<Button
							type='button'
							className='mt-1 h-11 w-full rounded-full bg-neutral-900 text-white hover:bg-neutral-800'
							disabled={!whatsappUrl || isFetching}
							onClick={() => {
								if (!whatsappUrl) return;
								window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
							}}
						>
							{isFetching ? (
								<Loader2 className='animate-spin' />
							) : (
								<MessageCircle />
							)}
							{isFetching ? 'Actualizando...' : 'Finalizar por WhatsApp'}
						</Button>

						{!whatsappUrl && (
							<p className='text-center text-xs text-neutral-500'>
								Falta configurar el número de WhatsApp de la tienda.
							</p>
						)}

						{isError && (
							<p className='text-center text-xs text-neutral-500'>
								No pudimos verificar la disponibilidad. Puedes continuar con tu
								pedido.
							</p>
						)}
					</SheetFooter>
				)}
			</SheetContent>
		</Sheet>
	);
};
