import {Loader2} from 'lucide-react';
import {useDeleteBrand} from '@/admin/hooks/brands/useDeleteBrand';
import type {Brand} from '@/admin/interfaces/brand.interface';
import {Button} from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteBrandDialogProps {
	brand: Brand | null;
	onClose: () => void;
}

export const DeleteBrandDialog = ({brand, onClose}: DeleteBrandDialogProps) => {
	const {mutate, isPending} = useDeleteBrand();

	const handleDelete = () => {
		if (!brand) return;
		mutate(brand.id, {onSuccess: onClose});
	};

	return (
		<AlertDialog
			open={!!brand}
			onOpenChange={(open) => {
				if (!open && !isPending) onClose();
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Eliminar marca?</AlertDialogTitle>
					<AlertDialogDescription>
						Vas a eliminar <strong>{brand?.name}</strong>. Esta acción no se
						puede deshacer. Si tiene productos asociados, no se podrá eliminar.
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
