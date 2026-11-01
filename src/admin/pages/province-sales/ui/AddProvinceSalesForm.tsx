import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {useMemo} from 'react';
import {useForm, useWatch} from 'react-hook-form';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {formatSalesLabel} from '@/province-sales/lib/format';
import {useProvinceSales} from '@/province-sales/hooks/useProvinceSales';
import {useAddProvinceSales} from '@/province-sales/hooks/useAddProvinceSales';
import {
	addProvinceSalesSchema,
	type AddProvinceSalesFormInput,
	type AddProvinceSalesFormValues,
} from '@/province-sales/schemas/add-province-sales.schema';

const emptyOption = 'Selecciona una provincia';

export const AddProvinceSalesForm = () => {
	const {
		data: provinces = [],
		isLoading,
		isError,
		refetch,
	} = useProvinceSales();
	const addProvinceSales = useAddProvinceSales();
	const sortedProvinces = useMemo(
		() => [...provinces].sort((a, b) => a.name.localeCompare(b.name, 'es')),
		[provinces],
	);

	const {
		control,
		register,
		handleSubmit,
		setError,
		clearErrors,
		resetField,
		formState: {errors},
	} = useForm<AddProvinceSalesFormInput, unknown, AddProvinceSalesFormValues>({
		resolver: zodResolver(addProvinceSalesSchema),
		defaultValues: {provinceId: '', quantity: '', note: ''},
	});

	const provinceId = useWatch({control, name: 'provinceId'});
	const selectedProvince = sortedProvinces.find(
		(province) => province.id === Number(provinceId),
	);
	const isBusy = isLoading || isError || addProvinceSales.isPending;

	const handleQuantityChange = () => {
		if (errors.quantity) {
			clearErrors('quantity');
		}
	};

	const onSubmit = (values: AddProvinceSalesFormValues) => {
		if (addProvinceSales.isPending) return;

		const {provinceId, quantity, note} = values;
		const currentTotal =
			sortedProvinces.find((province) => province.id === provinceId)?.totalSales ?? 0;

		if (quantity < 0 && currentTotal + quantity < 0) {
			setError('quantity', {
				message: 'El total de la provincia no puede quedar negativo.',
			});
			return;
		}

		addProvinceSales.mutate(
			{provinceId, quantity, note},
			{
				onSuccess: () => {
					resetField('quantity');
					resetField('note');
					clearErrors();
				},
			},
		);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<fieldset disabled={isBusy} className='m-0 min-w-0 space-y-5 border-0 p-0'>
				<div className='grid gap-2'>
					<Label htmlFor='provinceId'>Provincia</Label>
					<select
						id='provinceId'
						aria-invalid={!!errors.provinceId}
						className='h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
						{...register('provinceId')}
					>
						<option value=''>{emptyOption}</option>
						{sortedProvinces.map((province) => (
							<option key={province.id} value={province.id}>
								{province.name}
							</option>
						))}
					</select>
					{selectedProvince && (
						<p className='text-sm text-muted-foreground'>
							Total actual: {formatSalesLabel(selectedProvince.totalSales)}
						</p>
					)}
					{errors.provinceId && (
						<p className='text-sm text-destructive'>
							{errors.provinceId.message}
						</p>
					)}
				</div>

				<div className='grid gap-2'>
					<Label htmlFor='quantity'>Cantidad</Label>
					<Input
						id='quantity'
						type='number'
						step='1'
						placeholder='5'
						aria-invalid={!!errors.quantity}
						{...register('quantity', {
							onChange: handleQuantityChange,
						})}
					/>
					{errors.quantity ? (
						<p className='text-sm text-destructive'>{errors.quantity.message}</p>
					) : (
						<p className='text-xs text-muted-foreground'>
							Usa un número negativo para corregir un error.
						</p>
					)}
				</div>

				<div className='grid gap-2'>
					<Label htmlFor='note'>Nota (opcional)</Label>
					<Textarea
						id='note'
						rows={3}
						placeholder='Ej. Feria en Santiago'
						maxLength={200}
						aria-invalid={!!errors.note}
						{...register('note')}
					/>
					{errors.note && (
						<p className='text-sm text-destructive'>{errors.note.message}</p>
					)}
				</div>

				<div className='flex justify-end'>
					<Button type='submit'>
						{addProvinceSales.isPending && (
							<Loader2 className='mr-2 size-4 animate-spin' />
						)}
						Registrar ventas
					</Button>
				</div>
			</fieldset>

			{isError && (
				<div className='mt-5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800'>
					No pudimos cargar las provincias.{' '}
					<button
						type='button'
						className='font-medium underline'
						onClick={() => refetch()}
					>
						Reintentar
					</button>
				</div>
			)}
		</form>
	);
};
