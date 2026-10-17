import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Link} from 'react-router';
import {Loader2, X} from 'lucide-react';
import {Button, buttonVariants} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {productVariantSchema} from '@/admin/schemas/product-variant.schema';
import type {ProductVariantFormValues} from '@/admin/schemas/product-variant.schema';
import {VariantSizesFieldArray} from './VariantSizesFieldArray';

interface ProductVariantFormProps {
	defaultValues: ProductVariantFormValues;
	isPending: boolean;
	submitLabel: string;
	onSubmit: (values: ProductVariantFormValues) => void;
	onCancelUrl: string;
}

export const ProductVariantForm = ({
	defaultValues,
	isPending,
	submitLabel,
	onSubmit,
	onCancelUrl,
}: ProductVariantFormProps) => {
	const {
		register,
		handleSubmit,
		control,
		formState: {errors},
	} = useForm<ProductVariantFormValues>({
		resolver: zodResolver(productVariantSchema),
		defaultValues,
	});

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='mx-auto flex max-w-3xl flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6'
		>
			<section className='grid gap-4'>
				<div className='flex items-center justify-between'>
					<h2 className='text-xl font-semibold'>Datos de la variante</h2>
				</div>

				<div className='grid gap-2'>
					<Label htmlFor='name'>Nombre</Label>
					<Input
						id='name'
						placeholder='Black Gold'
						aria-invalid={!!errors.name}
						{...register('name')}
					/>
					{errors.name && (
						<p className='text-sm text-destructive'>{errors.name.message}</p>
					)}
				</div>

				<div className='grid gap-2'>
					<Label htmlFor='slug'>Slug</Label>
					<Input
						id='slug'
						placeholder='black-gold'
						aria-invalid={!!errors.slug}
						{...register('slug')}
					/>
					{errors.slug && (
						<p className='text-sm text-destructive'>{errors.slug.message}</p>
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

				<div className='grid gap-3 sm:grid-cols-3'>
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
							<p className='text-sm text-destructive'>{errors.price.message}</p>
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

					<div className='grid gap-2'>
						<Label htmlFor='displayOrder'>Orden</Label>
						<Input
							id='displayOrder'
							type='number'
							min='0'
							aria-invalid={!!errors.displayOrder}
							{...register('displayOrder', {valueAsNumber: true})}
						/>
						{errors.displayOrder && (
							<p className='text-sm text-destructive'>
								{errors.displayOrder.message}
							</p>
						)}
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<input
						id='isActive'
						type='checkbox'
						className='size-4 rounded border-input'
						{...register('isActive')}
					/>
					<Label htmlFor='isActive' className='cursor-pointer'>
						Activa
					</Label>
				</div>
			</section>

			<section className='grid gap-4'>
				<h2 className='text-xl font-semibold'>Tallas con stock</h2>
				<VariantSizesFieldArray
					control={control}
					register={register}
					errors={errors}
				/>
			</section>

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
