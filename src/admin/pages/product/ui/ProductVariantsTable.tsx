import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import type {ProductVariant} from '@/admin/interfaces/product-variant.interface';
import {ProductVariantRow} from './ProductVariantRow';

interface ProductVariantsTableProps {
	productId: string;
	variants: ProductVariant[];
}

export const ProductVariantsTable = ({
	productId,
	variants,
}: ProductVariantsTableProps) => {
	const sortedVariants = variants
		.slice()
		.sort((first, second) => first.displayOrder - second.displayOrder);

	return (
		<Table className='border border-gray-200 bg-white shadow-xs'>
			<TableHeader>
				<TableRow>
					<TableHead>Variante</TableHead>
					<TableHead>Precio</TableHead>
					<TableHead>Descuento</TableHead>
					<TableHead>Orden</TableHead>
					<TableHead>Stock</TableHead>
					<TableHead className='text-right'>Acciones</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{sortedVariants.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={6}
							className='py-10 text-center text-sm text-muted-foreground'
						>
							Aún no hay variantes para este producto.
						</TableCell>
					</TableRow>
				) : (
					sortedVariants.map((variant, index) => (
						<ProductVariantRow
							key={variant.id}
							productId={productId}
							variant={variant}
							isCover={index === 0}
						/>
					))
				)}
			</TableBody>
		</Table>
	);
};
