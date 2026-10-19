import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Link} from 'react-router';
import {Loader2, X} from 'lucide-react';
import {productSchema} from '@/admin/schemas/product.schema';
import type {ProductInput} from '@/admin/interfaces/product.interface';
import {Button, buttonVariants} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

interface ProductFormProps {
	defaultValues?: ProductInput;
	isPending: boolean;
	submitLabel: string;
	onSubmit: (values: ProductInput) => void;
	brandOptions: Array<{id: string; name: string}>;
	categoryOptions: Array<{id: string; name: string}>;
}

const emptyValues: ProductInput = {
	name: '',
	brandId: '',
	categoryId: '',
};

export const ProductForm = ({
	defaultValues = emptyValues,
	isPending,
	submitLabel,
	onSubmit,
	brandOptions,
	categoryOptions,
}: ProductFormProps) => {
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm<ProductInput>({
		resolver: zodResolver(productSchema),
		defaultValues,
	});

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='mx-auto flex max-w-2xl flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6'
		>
			<h2 className='text-xl font-semibold'>Información del producto</h2>

			<div className='grid gap-2'>
				<Label htmlFor='name'>Nombre</Label>
				<Input
					id='name'
					placeholder='Nike Ja Morant 1'
					aria-invalid={!!errors.name}
					{...register('name')}
				/>
				{errors.name && (
					<p className='text-sm text-destructive'>{errors.name.message}</p>
				)}
			</div>

			<div className='grid gap-2'>
				<Label htmlFor='brandId'>Marca</Label>
				<select
					id='brandId'
					aria-invalid={!!errors.brandId}
					className='h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
					{...register('brandId')}
				>
					<option value=''>Selecciona una marca</option>
					{brandOptions.map((brand) => (
						<option key={brand.id} value={brand.id}>
							{brand.name}
						</option>
					))}
				</select>
				{errors.brandId && (
					<p className='text-sm text-destructive'>{errors.brandId.message}</p>
				)}
			</div>

			<div className='grid gap-2'>
				<Label htmlFor='categoryId'>Categoría</Label>
				<select
					id='categoryId'
					aria-invalid={!!errors.categoryId}
					className='h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
					{...register('categoryId')}
				>
					<option value=''>Selecciona una categoría</option>
					{categoryOptions.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</select>
				{errors.categoryId && (
					<p className='text-sm text-destructive'>
						{errors.categoryId.message}
					</p>
				)}
			</div>

			<div className='flex justify-end gap-2'>
				<Link
					to='/admin/products'
					className={buttonVariants({variant: 'outline'})}
				>
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
