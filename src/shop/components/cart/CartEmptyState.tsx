import {Link} from 'react-router';
import {ShoppingBag} from 'lucide-react';
import {Button} from '@/components/ui/button';

interface CartEmptyStateProps {
	onNavigate: () => void;
}

export const CartEmptyState = ({onNavigate}: CartEmptyStateProps) => (
	<div
		className='flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center'
		lang='es'
		translate='no'
	>
		<div className='grid size-14 place-items-center rounded-full bg-neutral-100'>
			<ShoppingBag className='size-6 text-neutral-400' />
		</div>

		<div className='flex flex-col gap-1'>
			<p className='text-sm font-semibold text-neutral-900'>
				Tu carrito está vacío
			</p>
			<p className='text-xs text-neutral-500'>
				Agrega productos desde la tienda para verlos aquí.
			</p>
		</div>

		<Button
			type='button'
			variant='outline'
			render={<Link to='/store' onClick={onNavigate} />}
		>
			Ir a la tienda
		</Button>
	</div>
);
