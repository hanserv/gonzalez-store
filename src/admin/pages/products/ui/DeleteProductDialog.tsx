import {Loader2} from 'lucide-react';
import {useDeleteProduct} from '@/admin/hooks/products/useDeleteProduct';
import type {ProductListItem} from '@/admin/interfaces/product.interface';
import {Button} from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteProductDialogProps {
	product: ProductListItem | null;
	onClose: () => void;
}

export const DeleteProductDialog = ({
	product,
	onClose,
}: DeleteProductDialogProps) => {
	const {mutate, isPending} = useDeleteProduct();

	const handleDelete = () => {
		if (!product) return;
		mutate(product.id, {onSuccess: onClose});
	};

	return (
		<AlertDialog
			open={!!product}
			onOpenChange={(open) => {
				if (!open && !isPending) onClose();
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
					<AlertDialogDescription>
						Vas a eliminar <strong>{product?.name}</strong>. Esta acción no se
						puede deshacer.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<Button variant='outline' onClick={onClose} disabled={isPending}>
						Cancelar
					</Button>
					<Button
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
