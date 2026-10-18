const currency = new Intl.NumberFormat('es-DO', {
	style: 'currency',
	currency: 'DOP',
	maximumFractionDigits: 0,
});

export const formatCurrency = (value: number) => currency.format(value);
