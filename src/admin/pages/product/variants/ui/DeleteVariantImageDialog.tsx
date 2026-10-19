import {Loader2} from 'lucide-react';
import {useDeleteVariantImage} from '@/admin/hooks/products/useDeleteVariantImage';
import type {ProductVariantImage} from '@/admin/interfaces/product-variant.interface';
import {Button} from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteVariantImageDialogProps {
	variantId: string;
	image: ProductVariantImage | null;
	onClose: () => void;
}

export const DeleteVariantImageDialog = ({
	variantId,
	image,
	onClose,
}: DeleteVariantImageDialogProps) => {
	const {mutate, isPending} = useDeleteVariantImage(variantId);

	const handleDelete = () => {
		if (!image) return;
		mutate({id: image.id, path: image.path}, {onSuccess: onClose});
	};

	return (
		<AlertDialog
			open={!!image}
			onOpenChange={(open) => {
				if (!open && !isPending) onClose();
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
					<AlertDialogDescription>
						Vas a eliminar esta imagen de la variante. Esta acción no se puede
						deshacer.
					</AlertDialogDescription>
				</AlertDialogHeader>

				{image && (
					<img
						src={image.url}
						alt=''
						className='mx-auto size-40 rounded-lg border border-gray-200 object-cover'
					/>
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
