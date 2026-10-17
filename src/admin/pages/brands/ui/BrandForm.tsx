import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Link} from 'react-router';
import {Loader2, X} from 'lucide-react';
import {brandSchema} from '@/admin/schemas/brand.schema';
import type {BrandInput} from '@/admin/interfaces/brand.interface';
import {Button, buttonVariants} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';

interface BrandFormProps {
	defaultValues?: BrandInput;
	isPending: boolean;
	submitLabel: string;
	onSubmit: (values: BrandInput) => void;
}

const emptyValues: BrandInput = {name: '', slug: '', description: ''};

export const BrandForm = ({
	defaultValues = emptyValues,
	isPending,
	submitLabel,
	onSubmit,
}: BrandFormProps) => {
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm<BrandInput>({
		resolver: zodResolver(brandSchema),
		defaultValues,
	});

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='mx-auto flex max-w-2xl flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6'
		>
			<h2 className='text-xl font-semibold'>Información de la marca</h2>
			<div className='grid gap-2'>
				<Label htmlFor='name'>Nombre</Label>
				<Input
					id='name'
					placeholder='Nike'
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
					placeholder='nike'
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

			<div className='flex justify-end gap-2'>
				<Link
					to='/admin/brands'
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
