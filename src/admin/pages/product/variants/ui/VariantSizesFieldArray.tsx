import {PlusIcon, Trash2Icon} from 'lucide-react';
import {useFieldArray} from 'react-hook-form';
import type {Control, FieldErrors, UseFormRegister} from 'react-hook-form';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import type {ProductVariantFormValues} from '@/admin/schemas/product-variant.schema';

interface VariantSizesFieldArrayProps {
	control: Control<ProductVariantFormValues>;
	register: UseFormRegister<ProductVariantFormValues>;
	errors: FieldErrors<ProductVariantFormValues>;
}

export const VariantSizesFieldArray = ({
	control,
	register,
	errors,
}: VariantSizesFieldArrayProps) => {
	const {fields, append, remove} = useFieldArray({
		control,
		name: 'sizes',
	});

	return (
		<div className='grid gap-3'>
			<div className='flex items-center justify-between gap-3'>
				<Label>Tallas</Label>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={() => append({size: '', stock: 0})}
				>
					<PlusIcon />
					Agregar talla
				</Button>
			</div>

			<div className='grid gap-3'>
				{fields.map((field, index) => (
					<div
						key={field.id}
						className='grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:grid-cols-[1fr_140px_auto]'
					>
						<div className='grid gap-2'>
							<Label htmlFor={`sizes.${index}.size`}>Talla</Label>
							<Input
								id={`sizes.${index}.size`}
								placeholder='42'
								{...register(`sizes.${index}.size`)}
							/>
							{errors.sizes?.[index]?.size && (
								<p className='text-sm text-destructive'>
									{errors.sizes[index]?.size?.message}
								</p>
							)}
						</div>

						<div className='grid gap-2'>
							<Label htmlFor={`sizes.${index}.stock`}>Stock</Label>
							<Input
								id={`sizes.${index}.stock`}
								type='number'
								min='0'
								{...register(`sizes.${index}.stock`, {valueAsNumber: true})}
							/>
							{errors.sizes?.[index]?.stock && (
								<p className='text-sm text-destructive'>
									{errors.sizes[index]?.stock?.message}
								</p>
							)}
						</div>

						<div className='flex items-end'>
							<Button
								type='button'
								variant='ghost'
								size='icon'
								onClick={() => remove(index)}
								disabled={fields.length === 1}
							>
								<Trash2Icon className='size-4 text-destructive' />
							</Button>
						</div>
					</div>
				))}
			</div>

			{typeof errors.sizes?.message === 'string' && (
				<p className='text-sm text-destructive'>{errors.sizes.message}</p>
			)}
		</div>
	);
};
