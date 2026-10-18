import {useState} from 'react';
import {Link, useParams} from 'react-router';
import {ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {useVariantBySlug} from '@/shop/hooks/variants/useVariantBySlug';
import {formatCurrency} from '@/shop/lib/format';
import {SizeSelector} from '@/shop/components/product/SizeSelector';
import {SiblingVariants} from '@/shop/components/product/SiblingVariants';
import {VariantCarousel} from '@/shop/components/product/VariantCarousel';

const ProductSkeleton = () => (
	<section className='min-h-svh bg-white px-6 pt-28 pb-16'>
		<div className='mx-auto grid max-w-6xl gap-10 lg:grid-cols-2'>
			<Skeleton className='aspect-square w-full rounded-xl' />
			<div className='flex flex-col gap-4'>
				<Skeleton className='h-4 w-24' />
				<Skeleton className='h-8 w-3/4' />
				<Skeleton className='h-6 w-32' />
				<Skeleton className='h-24 w-full' />
				<Skeleton className='h-10 w-48' />
			</div>
		</div>
	</section>
);

export const ProductPage = () => {
	const {slug} = useParams();
	const {data, isLoading, isError, refetch} = useVariantBySlug(slug);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);

	const backLink = (
		<Link
			to='/store'
			className='inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900'
		>
			<ArrowLeft className='size-4' />
			Volver a la tienda
		</Link>
	);

	if (isLoading) return <ProductSkeleton />;

	if (isError) {
		return (
			<section className='min-h-svh bg-white px-6 pt-28 pb-16'>
				<div className='mx-auto flex max-w-6xl flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-neutral-50 py-16'>
					<p className='text-neutral-600'>
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
			<section className='min-h-svh bg-white px-6 pt-28 pb-16'>
				<div className='mx-auto flex max-w-6xl flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-neutral-50 py-16'>
					<p className='text-neutral-600'>
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

	return (
		<section className='min-h-svh bg-white px-6 pt-28 pb-16'>
			<div className='mx-auto max-w-6xl'>
				<div className='mb-6'>{backLink}</div>

				<div className='grid gap-10 lg:grid-cols-2'>
					<VariantCarousel images={variant.images} alt={variant.title} />

					<div className='flex flex-col gap-5'>
						{variant.brandName && (
							<p className='text-sm font-semibold tracking-wide text-neutral-500 uppercase'>
								{variant.brandName}
							</p>
						)}

						<h1 className='font-cinzel text-2xl font-bold text-neutral-950 md:text-3xl'>
							{variant.title}
						</h1>

						<div className='flex items-baseline gap-3'>
							<p className='text-2xl font-semibold text-neutral-900'>
								{formatCurrency(variant.finalPrice)}
							</p>
							{hasDiscount && (
								<>
									<p className='text-lg text-neutral-400 line-through'>
										{formatCurrency(variant.price)}
									</p>
									<span className='rounded-full bg-gonzalez-red px-2.5 py-1 text-xs font-semibold text-white'>
										-{variant.discountPercentage}%
									</span>
								</>
							)}
						</div>

						{variant.description && (
							<p className='whitespace-pre-line text-neutral-700'>
								{variant.description}
							</p>
						)}

						<div>
							<p className='mb-2 text-sm font-medium text-neutral-700'>
								Talla
							</p>
							<SizeSelector
								sizes={variant.sizes}
								selectedSize={selectedSize}
								onSelect={setSelectedSize}
							/>
						</div>

						<SiblingVariants
							currentVariantId={variant.id}
							siblings={siblings}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};
