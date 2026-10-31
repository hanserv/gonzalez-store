import {Minus, Plus} from 'lucide-react';
import {Button} from '@/components/ui/button';

interface QuantityStepperProps {
	quantity: number;
	stockLimit: number | null;
	label: string;
	onChange: (quantity: number) => void;
}

export const QuantityStepper = ({
	quantity,
	stockLimit,
	label,
	onChange,
}: QuantityStepperProps) => {
	const canDecrease = quantity > 1;
	const canIncrease = stockLimit === null || quantity < stockLimit;

	return (
		<div
			role='group'
			aria-label={`Cantidad de ${label}`}
			className='flex items-center gap-1'
		>
			<Button
				type='button'
				variant='outline'
				size='icon-sm'
				disabled={!canDecrease}
				onClick={() => onChange(quantity - 1)}
				aria-label='Quitar una unidad'
			>
				<Minus className='size-3.5' />
			</Button>
			<span
				aria-live='polite'
				className='min-w-7 text-center text-sm font-medium text-neutral-900'
			>
				{quantity}
			</span>
			<Button
				type='button'
				variant='outline'
				size='icon-sm'
				disabled={!canIncrease}
				onClick={() => onChange(quantity + 1)}
				aria-label='Agregar una unidad'
			>
				<Plus className='size-3.5' />
			</Button>
		</div>
	);
};
