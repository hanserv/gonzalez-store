import {Link} from 'react-router';
import {
	ArrowDownIcon,
	ArrowUpIcon,
	ImageOffIcon,
	PencilIcon,
	Trash2Icon,
} from 'lucide-react';
import {Button, buttonVariants} from '@/components/ui/button';
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
	canMoveUp: boolean;
	canMoveDown: boolean;
	onMoveUp: () => void;
	onMoveDown: () => void;
	onToggleActive: (isActive: boolean) => void;
	onDeleteClick: () => void;
}

export const ProductVariantRow = ({
	productId,
	variant,
	isCover,
	canMoveUp,
	canMoveDown,
	onMoveUp,
	onMoveDown,
	onToggleActive,
	onDeleteClick,
}: ProductVariantRowProps) => {
	const totalStock = variant.sizes.reduce((sum, size) => sum + size.stock, 0);
	const coverImage = variant.images[0];

	return (
		<TableRow>
			<TableCell>
				{coverImage ? (
					<img
						src={coverImage.url}
						alt={variant.name}
						className='size-10 rounded-md border border-gray-200 object-cover'
					/>
				) : (
					<div className='flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground'>
						<ImageOffIcon className='size-4' />
					</div>
				)}
			</TableCell>
			<TableCell>
				<div className='flex flex-col gap-1'>
					<div className='flex items-center gap-2'>
						<p className='font-medium'>{variant.name}</p>
						{isCover && (
							<span className='rounded-full bg-gonzalez-red/10 px-2 py-0.5 text-xs font-medium text-gonzalez-red'>
								Portada
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
			<TableCell>
				<div className='flex items-center'>
					<Button
						type='button'
						variant='ghost'
						size='icon-xs'
						onClick={onMoveUp}
						disabled={!canMoveUp}
						aria-label={`Subir ${variant.name}`}
					>
						<ArrowUpIcon />
					</Button>
					<Button
						type='button'
						variant='ghost'
						size='icon-xs'
						onClick={onMoveDown}
						disabled={!canMoveDown}
						aria-label={`Bajar ${variant.name}`}
					>
						<ArrowDownIcon />
					</Button>
				</div>
			</TableCell>
			<TableCell className='text-muted-foreground'>{totalStock}</TableCell>
			<TableCell>
				<label className='relative inline-flex cursor-pointer items-center'>
					<input
						type='checkbox'
						className='peer sr-only'
						checked={variant.isActive}
						onChange={(event) => onToggleActive(event.target.checked)}
						aria-label={
							variant.isActive
								? `Desactivar ${variant.name}`
								: `Activar ${variant.name}`
						}
					/>
					<span className='h-5 w-9 rounded-full bg-muted transition-colors peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-ring/50' />
					<span className='absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4' />
				</label>
			</TableCell>
			<TableCell className='text-right'>
				<Link
					to={`/admin/products/${productId}/variants/${variant.id}`}
					aria-label={`Editar ${variant.name}`}
					className={buttonVariants({variant: 'ghost', size: 'icon'})}
				>
					<PencilIcon className='size-4 text-blue-500' />
				</Link>
				<Button
					type='button'
					variant='ghost'
					size='icon'
					aria-label={`Eliminar ${variant.name}`}
					onClick={onDeleteClick}
				>
					<Trash2Icon className='size-4 text-destructive' />
				</Button>
			</TableCell>
		</TableRow>
	);
};
