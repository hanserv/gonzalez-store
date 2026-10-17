import {useRef, useState} from 'react';
import type {ChangeEvent, DragEvent} from 'react';
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ImagePlusIcon,
	Loader2,
	Trash2Icon,
} from 'lucide-react';
import {useReorderVariantImages} from '@/admin/hooks/products/useReorderVariantImages';
import {useUploadVariantImages} from '@/admin/hooks/products/useUploadVariantImages';
import type {ProductVariantImage} from '@/admin/interfaces/product-variant.interface';
import {Button} from '@/components/ui/button';
import {DeleteVariantImageDialog} from './DeleteVariantImageDialog';

interface VariantImagesGalleryProps {
	variantId: string;
	images: ProductVariantImage[];
}

export const VariantImagesGallery = ({
	variantId,
	images,
}: VariantImagesGalleryProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [imageToDelete, setImageToDelete] =
		useState<ProductVariantImage | null>(null);
	const {mutate: uploadImages, isPending: isUploading} =
		useUploadVariantImages(variantId);
	const {mutate: reorderImages, isPending: isReordering} =
		useReorderVariantImages(variantId);

	const handleFiles = (files: FileList | null) => {
		if (!files || files.length === 0) return;

		uploadImages(Array.from(files));
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		handleFiles(event.target.files);
		event.target.value = '';
	};

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);

		if (isUploading) return;

		handleFiles(event.dataTransfer.files);
	};

	const handleMove = (index: number, direction: -1 | 1) => {
		const targetIndex = index + direction;

		if (targetIndex < 0 || targetIndex >= images.length) return;

		const orderedIds = images.map((image) => image.id);

		[orderedIds[index], orderedIds[targetIndex]] = [
			orderedIds[targetIndex],
			orderedIds[index],
		];

		reorderImages(orderedIds);
	};

	return (
		<div className='grid gap-4'>
			<div
				onClick={() => {
					if (!isUploading) inputRef.current?.click();
				}}
				onDragOver={(event) => {
					event.preventDefault();
					setIsDragging(true);
				}}
				onDragLeave={() => setIsDragging(false)}
				onDrop={handleDrop}
				className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
					isDragging
						? 'border-gonzalez-red bg-gonzalez-red/5'
						: 'border-gray-300 bg-muted/30 hover:border-gray-400'
				}`}
			>
				{isUploading ? (
					<Loader2 className='size-6 animate-spin text-muted-foreground' />
				) : (
					<ImagePlusIcon className='size-6 text-muted-foreground' />
				)}
				<p className='text-sm text-muted-foreground'>
					{isUploading
						? 'Subiendo imágenes...'
						: 'Arrastra y suelta imágenes aquí o haz clic para seleccionar'}
				</p>
				<p className='text-xs text-muted-foreground'>
					jpeg, png o webp · máximo 6 MB
				</p>
			</div>

			<input
				ref={inputRef}
				type='file'
				accept='image/jpeg,image/png,image/webp'
				multiple
				className='hidden'
				onChange={handleInputChange}
			/>

			{images.length > 0 && (
				<ul className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2'>
					{images.map((image, index) => (
						<li
							key={image.id}
							className='group relative overflow-hidden rounded-lg border border-gray-200'
						>
							<img
								src={image.url}
								alt=''
								className='aspect-square w-full object-cover'
							/>

							{index === 0 && (
								<span className='absolute top-2 left-2 rounded-full bg-gonzalez-red px-2 py-0.5 text-xs font-medium text-white'>
									Principal
								</span>
							)}

							<div className='absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/60 p-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100'>
								<div className='flex items-center'>
									<Button
										type='button'
										variant='ghost'
										size='icon-xs'
										className='text-white hover:bg-white/20 hover:text-white'
										disabled={index === 0 || isReordering}
										onClick={() => handleMove(index, -1)}
										aria-label='Mover imagen a la izquierda'
									>
										<ChevronLeftIcon />
									</Button>
									<Button
										type='button'
										variant='ghost'
										size='icon-xs'
										className='text-white hover:bg-white/20 hover:text-white'
										disabled={index === images.length - 1 || isReordering}
										onClick={() => handleMove(index, 1)}
										aria-label='Mover imagen a la derecha'
									>
										<ChevronRightIcon />
									</Button>
								</div>
								<Button
									type='button'
									variant='ghost'
									size='icon-xs'
									className='text-white hover:bg-destructive hover:text-white'
									onClick={() => setImageToDelete(image)}
									aria-label={`Eliminar imagen ${index + 1}`}
								>
									<Trash2Icon />
								</Button>
							</div>
						</li>
					))}
				</ul>
			)}

			<DeleteVariantImageDialog
				variantId={variantId}
				image={imageToDelete}
				onClose={() => setImageToDelete(null)}
			/>
		</div>
	);
};
