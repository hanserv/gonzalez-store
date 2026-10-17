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
	onToggleActive: (id: string, isActive: boolean) => void;
	onReorder: (orderedIds: string[]) => void;
}

export const ProductVariantsTable = ({
	productId,
	variants,
	onToggleActive,
	onReorder,
}: ProductVariantsTableProps) => {
	const sortedVariants = variants
		.slice()
		.sort((first, second) => first.displayOrder - second.displayOrder);

	const coverVariant = sortedVariants.find((variant) => variant.isActive);

	const moveVariant = (index: number, direction: -1 | 1) => {
		const targetIndex = index + direction;

		if (targetIndex < 0 || targetIndex >= sortedVariants.length) return;

		const orderedIds = sortedVariants.map((variant) => variant.id);
		[orderedIds[index], orderedIds[targetIndex]] = [
			orderedIds[targetIndex],
			orderedIds[index],
		];

		onReorder(orderedIds);
	};

	return (
		<Table className='border border-gray-200 bg-white shadow-xs'>
			<TableHeader>
				<TableRow>
					<TableHead>Imagen</TableHead>
					<TableHead>Variante</TableHead>
					<TableHead>Precio</TableHead>
					<TableHead>Descuento</TableHead>
					<TableHead>Orden</TableHead>
					<TableHead>Stock</TableHead>
					<TableHead>Activa</TableHead>
					<TableHead className='text-right'>Acciones</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{sortedVariants.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={8}
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
							isCover={variant.id === coverVariant?.id}
							canMoveUp={index > 0}
							canMoveDown={index < sortedVariants.length - 1}
							onMoveUp={() => moveVariant(index, -1)}
							onMoveDown={() => moveVariant(index, 1)}
							onToggleActive={(isActive) => onToggleActive(variant.id, isActive)}
						/>
					))
				)}
			</TableBody>
		</Table>
	);
};
