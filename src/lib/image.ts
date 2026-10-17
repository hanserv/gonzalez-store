export const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
export const MAX_IMAGE_SIDE = 1600;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export type ImageValidationError = 'invalid_type' | 'too_large';

export const getImageValidationError = (
	file: File,
): ImageValidationError | null => {
	if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return 'invalid_type';
	if (file.size > MAX_IMAGE_BYTES) return 'too_large';

	return null;
};

export const compressImageToWebp = async (file: File): Promise<Blob> => {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(
		1,
		MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height),
	);

	const canvas = document.createElement('canvas');
	canvas.width = Math.max(1, Math.round(bitmap.width * scale));
	canvas.height = Math.max(1, Math.round(bitmap.height * scale));

	const context = canvas.getContext('2d');

	if (!context) {
		bitmap.close();
		throw new Error('Canvas is not supported');
	}

	context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();

	const blob = await new Promise<Blob | null>((resolve) =>
		canvas.toBlob(resolve, 'image/webp', 0.85),
	);

	if (!blob) throw new Error('Image compression failed');

	return blob;
};
