import {Loader2} from 'lucide-react';
import {useDeleteProductVariant} from '@/admin/hooks/products/useDeleteProductVariant';
import type {ProductVariant} from '@/admin/interfaces/product-variant.interface';
import {Button} from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteVariantDialogProps {
	productId: string;
	variant: ProductVariant | null;
	isOnlyActiveVariant: boolean;
	onClose: () => void;
}

export const DeleteVariantDialog = ({
	productId,
	variant,
	isOnlyActiveVariant,
	onClose,
}: DeleteVariantDialogProps) => {
	const {mutate, isPending} = useDeleteProductVariant(productId);

	const handleDelete = () => {
		if (!variant) return;
		mutate(variant.id, {onSuccess: onClose});
	};

	const imageCount = variant?.images.length ?? 0;
	const sizeCount = variant?.sizes.length ?? 0;

	const lostParts: string[] = [];

	if (imageCount > 0) {
		lostParts.push(imageCount === 1 ? '1 imagen' : `${imageCount} imágenes`);
	}

	if (sizeCount > 0) {
		lostParts.push(sizeCount === 1 ? '1 talla' : `${sizeCount} tallas`);
	}

	const lostText =
		lostParts.length > 0
			? `Se perderán ${lostParts.join(' y ')}.`
			: 'No tiene imágenes ni tallas asociadas.';

	return (
		<AlertDialog
			open={!!variant}
			onOpenChange={(open) => {
				if (!open && !isPending) onClose();
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Eliminar variante?</AlertDialogTitle>
					<AlertDialogDescription>
						Vas a eliminar <strong>{variant?.name}</strong>. Esta acción no se
						puede deshacer. {lostText}
					</AlertDialogDescription>
				</AlertDialogHeader>

				{isOnlyActiveVariant && (
					<p className='rounded-md bg-amber-50 p-3 text-sm text-amber-700'>
						Es la única variante activa del producto. Si la eliminas, el producto
						dejará de aparecer en la tienda.
					</p>
				)}

				<AlertDialogFooter>
					<Button
						type='button'
						variant='outline'
						onClick={onClose}
						disabled={isPending}
					>
						Cancelar
					</Button>
					<Button
						type='button'
						variant='destructive'
						onClick={handleDelete}
						disabled={isPending}
					>
						{isPending && <Loader2 className='animate-spin' />}
						Eliminar
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
