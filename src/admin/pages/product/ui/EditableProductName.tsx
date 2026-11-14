import {useEffect, useState, type FocusEvent, type KeyboardEvent} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Check, Loader2, Pencil} from 'lucide-react';
import {
	productNameFormSchema,
	type ProductNameFormValues,
} from '@/admin/schemas/product.schema';
import {useUpdateProductName} from '@/admin/hooks/products/useUpdateProductName';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';

interface EditableProductNameProps {
	productId: string;
	name: string;
}

export const EditableProductName = ({
	productId,
	name,
}: EditableProductNameProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const {mutateAsync} = useUpdateProductName();
	const {
		register,
		handleSubmit,
		reset,
		setFocus,
		formState: {errors},
	} = useForm<ProductNameFormValues>({
		resolver: zodResolver(productNameFormSchema),
		defaultValues: {name},
	});

	useEffect(() => {
		if (!isEditing) return;
		reset({name});
		setFocus('name', {shouldSelect: true});
	}, [isEditing, name, reset, setFocus]);

	const startEditing = () => {
		if (isSaving) return;
		setIsEditing(true);
	};

	const cancelEditing = () => {
		if (isSaving) return;
		reset({name});
		setIsEditing(false);
	};

	const onSubmit = async (values: ProductNameFormValues) => {
		if (values.name === name) {
			setIsEditing(false);
			return;
		}

		setIsSaving(true);

		try {
			await mutateAsync({id: productId, name: values.name});
			setIsEditing(false);
		} catch {
			// The hook shows the error toast and keeps the form open.
		} finally {
			setIsSaving(false);
		}
	};

	const handleBlur = (event: FocusEvent<HTMLFormElement>) => {
		const nextTarget = event.relatedTarget as Node | null;

		if (nextTarget && event.currentTarget.contains(nextTarget)) return;

		cancelEditing();
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
		if (event.key !== 'Escape') return;

		event.preventDefault();
		cancelEditing();
	};

	if (!isEditing) {
		return (
			<div className='flex items-center gap-1'>
				<h2
					className='cursor-text text-2xl font-semibold'
					onClick={startEditing}
					title='Editar nombre'
				>
					{name}
				</h2>
				<Button
					type='button'
					variant='ghost'
					size='icon-sm'
					aria-label='Editar nombre del producto'
					onClick={startEditing}
				>
					<Pencil className='size-4 text-blue-500' />
				</Button>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			className='flex flex-col gap-1'
		>
			<div className='flex items-center gap-2'>
				<Input
					id='product-name'
					aria-label='Nombre del producto'
					aria-invalid={!!errors.name}
					disabled={isSaving}
					className='h-11 max-w-md text-xl font-semibold md:text-2xl'
					{...register('name')}
				/>
				<Button
					type='submit'
					size='icon'
					aria-label='Guardar nombre'
					disabled={isSaving}
				>
					{isSaving ? <Loader2 className='animate-spin' /> : <Check />}
				</Button>
			</div>
			{errors.name && (
				<p className='text-sm text-destructive'>{errors.name.message}</p>
			)}
		</form>
	);
};
