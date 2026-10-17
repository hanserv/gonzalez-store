import {Link} from 'react-router';
import {PencilIcon} from 'lucide-react';
import {buttonVariants} from '@/components/ui/button';
import {TableCell, TableRow} from '@/components/ui/table';
import type {ProductVariant} from '@/admin/interfaces/product-variant.interface';

const currencyFormatter = new Intl.NumberFormat('es-DO', {
	style: 'currency',
	currency: 'DOP',
});

interface ProductVariantRowProps {
	productId: string;
	variant: ProductVariant;
	isCover: boolean;
}

export const ProductVariantRow = ({
	productId,
	variant,
	isCover,
}: ProductVariantRowProps) => {
	const totalStock = variant.sizes.reduce((sum, size) => sum + size.stock, 0);

	return (
		<TableRow>
			<TableCell>
				<div className='flex flex-col gap-1'>
					<div className='flex items-center gap-2'>
						<p className='font-medium'>{variant.name}</p>
						{isCover && (
							<span className='rounded-full bg-gonzalez-red/10 px-2 py-0.5 text-xs font-medium text-gonzalez-red'>
								Portada
							</span>
						)}
						{variant.isActive && (
							<span className='rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600'>
								Activa
							</span>
						)}
						{!variant.isActive && (
							<span className='rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'>
								Inactiva
							</span>
						)}
					</div>
					<p className='text-xs text-muted-foreground'>{variant.slug}</p>
				</div>
			</TableCell>
			<TableCell className='text-muted-foreground'>
				{currencyFormatter.format(variant.price)}
			</TableCell>
			<TableCell className='text-muted-foreground'>
				{variant.discountPercentage}%
			</TableCell>
			<TableCell className='text-muted-foreground'>
				{variant.displayOrder}
			</TableCell>
			<TableCell className='text-muted-foreground'>{totalStock}</TableCell>
			<TableCell className='text-right'>
				<Link
					to={`/admin/products/${productId}/variants/${variant.id}`}
					aria-label={`Editar ${variant.name}`}
					className={buttonVariants({variant: 'ghost', size: 'icon'})}
				>
					<PencilIcon className='size-4 text-blue-500' />
				</Link>
			</TableCell>
		</TableRow>
	);
};
