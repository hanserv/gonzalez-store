import type {
	CartItem,
	CartReconcileResult,
} from '@/shop/interfaces/cart.interface';
import {formatCurrency} from '@/shop/lib/format';

// wa.me only accepts digits, so spaces, dashes and the country plus are dropped
const whatsappNumber = String(import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(
	/\D/g,
	'',
);

export const buildCartLineId = (variantId: string, size: string | null) =>
	`${variantId}::${size ?? ''}`;

export const buildCartUpdateMessage = ({
	removed,
	updated,
	clamped,
}: CartReconcileResult): string | null => {
	if (removed > 0) {
		return removed === 1
			? 'Quitamos un artículo que ya no está disponible.'
			: `Quitamos ${removed} artículos que ya no están disponibles.`;
	}

	if (clamped > 0) {
		return clamped === 1
			? 'Ajustamos la cantidad de un artículo al stock disponible.'
			: `Ajustamos la cantidad de ${clamped} artículos al stock disponible.`;
	}

	if (updated > 0) {
		return 'Actualizamos la información de tu carrito.';
	}

	return null;
};

const buildCartLineMessage = (item: CartItem, index: number) => {
	const lines = [
		`${index + 1}. ${item.title}`,
		item.size ? `Talla: ${item.size}` : null,
		`Cantidad: ${item.quantity}`,
		`Precio: ${formatCurrency(item.finalPrice)} c/u`,
		`${window.location.origin}/product/${item.slug}`,
	];

	return lines.filter(Boolean).join('\n');
};

export const buildWhatsAppCartUrl = (items: CartItem[]): string | null => {
	if (!whatsappNumber || items.length === 0) return null;

	const subtotal = items.reduce(
		(total, item) => total + item.finalPrice * item.quantity,
		0,
	);
	const message = [
		'Hola Gonzalez Peña, quiero hacer este pedido:',
		'',
		...items.flatMap((item, index) => [
			buildCartLineMessage(item, index),
			'',
		]),
		`Subtotal: ${formatCurrency(subtotal)}`,
	].join('\n');

	return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};
