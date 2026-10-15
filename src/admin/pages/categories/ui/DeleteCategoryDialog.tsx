import {Loader2} from 'lucide-react';
import {useDeleteCategory} from '@/admin/hooks/useDeleteCategory';
import type {Category} from '@/admin/interfaces/category.interface';
import {Button} from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteCategoryDialogProps {
	category: Category | null;
	onClose: () => void;
}

export const DeleteCategoryDialog = ({
	category,
	onClose,
}: DeleteCategoryDialogProps) => {
	const {mutate, isPending} = useDeleteCategory();

	const handleDelete = () => {
		if (!category) return;
		mutate(category.id, {onSuccess: onClose});
	};

	return (
		<AlertDialog
			open={!!category}
			onOpenChange={(open) => {
				if (!open && !isPending) onClose();
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
					<AlertDialogDescription>
						Vas a eliminar <strong>{category?.name}</strong>. Esta acción no se
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
