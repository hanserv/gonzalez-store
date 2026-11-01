import {useState} from 'react';
import {Link, useParams} from 'react-router';
import {ArrowLeft, ShoppingBag, ShoppingCart, ShieldCheck, Truck} from 'lucide-react';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {useVariantBySlug} from '@/shop/hooks/variants/useVariantBySlug';
import {formatCurrency} from '@/shop/lib/format';
import {useCartStore} from '@/shop/stores/cart.store';
import {ProductGallery} from '@/shop/components/product/ProductGallery';
import {SiblingVariants} from '@/shop/components/product/SiblingVariants';
import {SizeSelector} from '@/shop/components/product/SizeSelector';

const ProductSkeleton = () => (
	<section className='min-h-svh bg-[#F7F8FA] px-4 pt-24 pb-16 sm:px-6 lg:px-10'>
		<div className='mx-auto max-w-[1180px]'>
			<div className='mb-6 flex items-center justify-between'>
				<Skeleton className='h-8 w-24' />
				<div className='flex gap-3'>
					<Skeleton className='h-9 w-9 rounded-full' />
					<Skeleton className='h-9 w-9 rounded-full' />
					<Skeleton className='h-9 w-9 rounded-full' />
				</div>
			</div>
			<div className='grid gap-8 lg:grid-cols-[57%_1fr] lg:items-start'>
				<Skeleton className='h-[560px] w-full rounded-2xl' />
				<Skeleton className='h-[580px] w-full rounded-3xl' />
			</div>
		</div>
	</section>
);

export const ProductPage = () => {
	const {slug} = useParams();
	const {data, isLoading, isError, refetch} = useVariantBySlug(slug);
	const addItem = useCartStore((state) => state.addItem);
	const openCart = useCartStore((state) => state.openCart);
	const items = useCartStore((state) => state.items);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [sizeError, setSizeError] = useState<string | null>(null);

	if (isLoading) return <ProductSkeleton />;

	if (isError) {
		return (
			<section className='min-h-svh bg-[#F7F8FA] px-6 pt-28 pb-16'>
				<div className='mx-auto flex max-w-5xl flex-col items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white py-16 shadow-sm'>
					<p className='text-[#6B7280]'>
						No pudimos cargar este producto. Intenta de nuevo.
					</p>
					<Button type='button' onClick={() => void refetch()}>
						Reintentar
					</Button>
				</div>
			</section>
		);
	}

	if (!data) {
		return (
			<section className='min-h-svh bg-[#F7F8FA] px-6 pt-28 pb-16'>
				<div className='mx-auto flex max-w-5xl flex-col items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white py-16 shadow-sm'>
					<p className='text-[#6B7280]'>
						Esta variante no existe o ya no está disponible.
					</p>
					<Button type='button' variant='outline' render={<Link to='/store' />}>
						Volver a la tienda
					</Button>
				</div>
			</section>
		);
	}

	const {variant, siblings} = data;
	const hasDiscount = variant.discountPercentage > 0;
	const hasSizes = variant.sizes.length > 0;
	const isSoldOut =
		hasSizes && variant.sizes.every((size) => size.stock <= 0);
	// A size from a previous variant can survive navigation, so only keep it
	// when the current variant actually offers it
	const activeSize =
		hasSizes &&
		selectedSize &&
		variant.sizes.some((size) => size.size === selectedSize)
			? selectedSize
			: null;

	const isInCart = hasSizes
		? activeSize !== null && items.some((item) => item.variantId === variant.id && item.size === activeSize)
		: items.some((item) => item.variantId === variant.id && item.size === null);

	const handleAddToCart = () => {
		if (isInCart) {
			openCart();
			return;
		}

		if (hasSizes && !activeSize) {
			setSizeError('Selecciona una talla para continuar.');
			return;
		}

		setSizeError(null);

		const stockLimit = activeSize
			? (variant.sizes.find((size) => size.size === activeSize)?.stock ??
				null)
			: null;

		const result = addItem({
			variantId: variant.id,
			size: hasSizes ? activeSize : null,
			slug: variant.slug,
			title: variant.title,
			brandName: variant.brandName,
			imageUrl: variant.images[0]?.url ?? null,
			price: variant.price,
			finalPrice: variant.finalPrice,
			quantity: 1,
			stockLimit,
		});

		if (!result.added) {
			toast.info('No hay más unidades disponibles de esta talla.');
			return;
		}

		toast.success('Agregado al carrito', {
			description: result.clamped
				? `Ajustamos la cantidad a ${result.quantity} por disponibilidad.`
				: undefined,
			action: {label: 'Ver carrito', onClick: openCart},
		});
	};

	return (
		<section className='bg-[#F7F8FA] px-4 pt-28 pb-12 sm:px-6 lg:px-10'>
			<div className='mx-auto max-w-[1180px]'>
				<div className='mb-6'>
					<Link
						to='/store'
						className='inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#111418]'
					>
						<ArrowLeft className='size-4' />
						Volver
					</Link>
				</div>

				<div className='grid items-start gap-6 lg:grid-cols-[57%_1fr] lg:gap-6'>
					<div>
						<ProductGallery images={variant.images} alt={variant.title} />
					</div>

					<div className='lg:mt-8'>
						<div className='flex flex-col rounded-3xl bg-white p-6 shadow-[0_20px_60px_-30px_rgba(17,20,24,0.4)] ring-1 ring-[#E5E7EB] lg:p-8'>
							<div className='flex flex-col gap-4'>
								{variant.brandName && (
									<p className='text-xs uppercase tracking-[0.2em] text-[#6B7280]'>
										{variant.brandName}
									</p>
								)}

								<h1 className='text-[24px] font-semibold leading-tight text-[#111418] md:text-[26px]'>
									{variant.title}
								</h1>

								{variant.description && (
									<p className='text-sm leading-relaxed text-[#6B7280] whitespace-pre-line'>
										{variant.description}
									</p>
								)}

								<div className='flex flex-wrap items-center gap-2'>
									<span className='text-xl font-semibold text-[#111418]'>
										{formatCurrency(variant.finalPrice)}
									</span>
									{hasDiscount && (
										<>
											<span className='text-sm text-[#9CA3AF] line-through'>
												{formatCurrency(variant.price)}
											</span>
											<span className='rounded-full bg-[#111418] px-2 py-0.5 text-xs font-medium text-white'>
												-{variant.discountPercentage}%
											</span>
										</>
									)}
								</div>

								<div>
									<p className='mb-2 text-sm font-medium text-[#111418]'>
										Color: {variant.title}
									</p>
									<SiblingVariants
										currentVariantId={variant.id}
										siblings={siblings}
									/>
								</div>

								{hasSizes && (
									<div className='flex flex-col gap-2'>
										<p className='text-sm font-medium text-[#111418]'>Talla</p>
										<SizeSelector
											sizes={variant.sizes}
											selectedSize={activeSize}
											onSelect={(size) => {
												setSelectedSize(size);
												setSizeError(null);
											}}
										/>
										{sizeError && (
											<p className='text-xs text-[#DC2626]'>{sizeError}</p>
										)}
									</div>
								)}

								<Button
									type='button'
									disabled={isSoldOut}
									className='mt-2 h-12 w-full rounded-full bg-[#111418] text-white hover:bg-[#1F2328]'
									onClick={handleAddToCart}
								>
									{isInCart ? (
										<ShoppingBag className='size-4' />
									) : (
										<ShoppingCart className='size-4' />
									)}
									{isSoldOut ? 'Agotado' : isInCart ? 'Ir al carrito' : 'Agregar al carrito'}
								</Button>

								<div className='grid grid-cols-2 gap-2'>
									<div className='flex items-center gap-2 rounded-2xl bg-[#F7F8FA] px-3 py-2'>
										<Truck className='size-4 text-[#6B7280]' />
										<div className='flex flex-col'>
											<span className='text-xs font-medium text-[#111418]'>
												Envío disponible
											</span>
											<span className='text-[11px] text-[#6B7280]'>
												Rápido y seguro
											</span>
										</div>
									</div>
									<div className='flex items-center gap-2 rounded-2xl bg-[#F7F8FA] px-3 py-2'>
										<ShieldCheck className='size-4 text-[#6B7280]' />
										<div className='flex flex-col'>
											<span className='text-xs font-medium text-[#111418]'>
												Compras seguras
											</span>
											<span className='text-[11px] text-[#6B7280]'>
												100% protegido
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
