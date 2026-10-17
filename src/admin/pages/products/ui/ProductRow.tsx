import {PencilIcon, Trash2Icon} from 'lucide-react';
import {Link} from 'react-router';
import {buttonVariants, Button} from '@/components/ui/button';
import {TableCell, TableRow} from '@/components/ui/table';
import type {ProductListItem} from '@/admin/interfaces/product.interface';

const dateFormatter = new Intl.DateTimeFormat('es-DO', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
});

interface ProductRowProps {
	product: ProductListItem;
	onTogglePopular: (isPopular: boolean) => void;
	onDeleteClick: (product: ProductListItem) => void;
}

export const ProductRow = ({
	product,
	onTogglePopular,
	onDeleteClick,
}: ProductRowProps) => (
	<TableRow>
		<TableCell>
			<div className='flex items-center gap-3'>
				{product.coverImageUrl ? (
					<img
						src={product.coverImageUrl}
						alt={product.name}
						className='size-10 rounded-md border border-gray-200 object-cover'
					/>
				) : (
					<div className='flex size-10 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground'>
						{product.name.slice(0, 1).toUpperCase()}
					</div>
				)}
				<div>
					<div className='flex items-center gap-2'>
						<p className='font-medium'>{product.name}</p>
						{product.isPopular && (
							<span className='rounded-full bg-gonzalez-red/10 px-2 py-0.5 text-xs font-medium text-gonzalez-red'>
								Popular
							</span>
						)}
					</div>
					{product.activeVariantCount === 0 && (
						<p className='text-xs font-medium text-amber-600'>
							Sin variantes activas
						</p>
					)}
				</div>
			</div>
		</TableCell>
		<TableCell className='text-muted-foreground'>{product.brandName}</TableCell>
		<TableCell className='text-muted-foreground'>
			{product.categoryName}
		</TableCell>
		<TableCell className='text-muted-foreground'>
			{product.variantCount}
		</TableCell>
		<TableCell className='text-muted-foreground'>
			{product.activeVariantCount}
		</TableCell>
		<TableCell className='text-muted-foreground'>
			{product.totalStock}
		</TableCell>
		<TableCell className='text-muted-foreground'>
			{dateFormatter.format(new Date(product.createdAt))}
		</TableCell>
		<TableCell>
			<label className='relative inline-flex cursor-pointer items-center'>
				<input
					type='checkbox'
					className='peer sr-only'
					checked={product.isPopular}
					onChange={(event) => onTogglePopular(event.target.checked)}
					aria-label={
						product.isPopular
							? `Quitar ${product.name} de populares`
							: `Marcar ${product.name} como popular`
					}
				/>
				<span className='h-5 w-9 rounded-full bg-muted transition-colors peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-ring/50' />
				<span className='absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4' />
			</label>
		</TableCell>
		<TableCell className='text-right'>
			<Link
				to={`/admin/products/${product.id}`}
				aria-label={`Ver ${product.name}`}
				className={buttonVariants({variant: 'ghost', size: 'icon'})}
			>
				<PencilIcon className='size-4 text-blue-500' />
			</Link>
			<Button
				variant='ghost'
				size='icon'
				aria-label={`Eliminar ${product.name}`}
				onClick={() => onDeleteClick(product)}
			>
				<Trash2Icon className='size-4 text-destructive' />
			</Button>
		</TableCell>
	</TableRow>
);
