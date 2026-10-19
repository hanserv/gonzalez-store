import {useEffect, useState} from 'react';
import {useForm, useWatch} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Link} from 'react-router';
import {Loader2, X} from 'lucide-react';
import {Button, buttonVariants} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {productVariantSchema} from '@/admin/schemas/product-variant.schema';
import type {
	ProductVariantFormInput,
	ProductVariantFormValues,
} from '@/admin/schemas/product-variant.schema';
import type {ProductVariantImage} from '@/admin/interfaces/product-variant.interface';
import {VariantSizesFieldArray} from './VariantSizesFieldArray';
import {VariantImagesGallery} from './VariantImagesGallery';

const slugify = (value: string) =>
	value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const sectionClassName =
	'grid gap-4 rounded-xl border border-gray-200 bg-white p-6';

interface ProductVariantFormProps {
	defaultValues: ProductVariantFormValues;
	isPending: boolean;
	submitLabel: string;
	onSubmit: (values: ProductVariantFormValues) => void;
	onCancelUrl: string;
	productName?: string;
	proposeSlug?: boolean;
	variantId?: string;
	images?: ProductVariantImage[];
	isActive?: boolean;
}

export const ProductVariantForm = ({
	defaultValues,
	isPending,
	submitLabel,
	onSubmit,
	onCancelUrl,
	productName,
	proposeSlug = false,
	variantId,
	images = [],
	isActive = false,
}: ProductVariantFormProps) => {
	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: {errors},
	} = useForm<ProductVariantFormInput, unknown, ProductVariantFormValues>({
		resolver: zodResolver(productVariantSchema),
		defaultValues,
	});

	const nameValue = useWatch({control, name: 'name'});
	const sizesValue = useWatch({control, name: 'sizes'});
	const [slugEdited, setSlugEdited] = useState(false);

	useEffect(() => {
		if (!proposeSlug || slugEdited) return;

		setValue('slug', slugify(`${productName ?? ''} ${nameValue ?? ''}`));
	}, [nameValue, productName, proposeSlug, setValue, slugEdited]);

	const hasStock = (sizesValue ?? []).some((size) => Number(size.stock) > 0);
	const showStockWarning = isActive && !hasStock;

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='mx-auto flex max-w-5xl flex-col gap-6'
		>
			<div className='grid items-start gap-6 lg:grid-cols-5'>
				<div className='flex flex-col gap-6 lg:col-span-3'>
					<section className={sectionClassName}>
						<h2 className='text-xl font-semibold'>Datos de la variante</h2>

						<div className='grid gap-2'>
							<Label htmlFor='name'>Nombre</Label>
							<Input
								id='name'
								placeholder='Black Gold'
								aria-invalid={!!errors.name}
								{...register('name')}
							/>
							{errors.name && (
								<p className='text-sm text-destructive'>
									{errors.name.message}
								</p>
							)}
						</div>

						<div className='grid gap-2'>
							<Label htmlFor='slug'>Slug</Label>
							<Input
								id='slug'
								placeholder='black-gold'
								aria-invalid={!!errors.slug}
								{...register('slug', {
									onChange: () => {
										setSlugEdited(true);
									},
								})}
							/>
							{errors.slug && (
								<p className='text-sm text-destructive'>
									{errors.slug.message}
								</p>
							)}
						</div>

						<div className='grid gap-2'>
							<Label htmlFor='description'>Descripción (opcional)</Label>
							<Textarea
								id='description'
								rows={4}
								aria-invalid={!!errors.description}
								{...register('description')}
							/>
							{errors.description && (
								<p className='text-sm text-destructive'>
									{errors.description.message}
								</p>
							)}
						</div>

						<div className='grid gap-3 sm:grid-cols-2'>
							<div className='grid gap-2'>
								<Label htmlFor='price'>Precio</Label>
								<Input
									id='price'
									type='number'
									min='0'
									step='0.01'
									aria-invalid={!!errors.price}
									{...register('price', {valueAsNumber: true})}
								/>
								{errors.price && (
									<p className='text-sm text-destructive'>
										{errors.price.message}
									</p>
								)}
							</div>

							<div className='grid gap-2'>
								<Label htmlFor='discountPercentage'>Descuento (%)</Label>
								<Input
									id='discountPercentage'
									type='number'
									min='0'
									max='100'
									aria-invalid={!!errors.discountPercentage}
									{...register('discountPercentage', {valueAsNumber: true})}
								/>
								{errors.discountPercentage && (
									<p className='text-sm text-destructive'>
										{errors.discountPercentage.message}
									</p>
								)}
							</div>
						</div>
					</section>

					<section className={sectionClassName}>
						<h2 className='text-xl font-semibold'>Tallas con stock</h2>
						<VariantSizesFieldArray
							control={control}
							register={register}
							errors={errors}
						/>
					</section>
				</div>

				<section className={`${sectionClassName} lg:col-span-2`}>
					<h2 className='text-xl font-semibold'>Imágenes</h2>
					{variantId ? (
						<VariantImagesGallery variantId={variantId} images={images} />
					) : (
						<p className='rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground'>
							Guarda la variante para poder agregar imágenes.
						</p>
					)}
				</section>
			</div>

			{showStockWarning && (
				<p className='rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-700'>
					Esta variante está activa pero ninguna talla tiene stock.
				</p>
			)}

			<div className='flex justify-end gap-2'>
				<Link to={onCancelUrl} className={buttonVariants({variant: 'outline'})}>
					<X />
					Cancelar
				</Link>
				<Button type='submit' disabled={isPending}>
					{isPending && <Loader2 className='animate-spin' />}
					{submitLabel}
				</Button>
			</div>
		</form>
	);
};
