const numberFormatter = new Intl.NumberFormat('es-DO');

export const formatSalesCount = (value: number) =>
	numberFormatter.format(value);

export const formatSalesLabel = (value: number) =>
	`${formatSalesCount(value)} ${Math.abs(value) === 1 ? 'venta' : 'ventas'}`;
