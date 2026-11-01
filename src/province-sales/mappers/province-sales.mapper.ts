import type {
	ProvinceSales,
	ProvinceSalesEntryInput,
	ProvinceSalesSummaryRow,
} from '@/province-sales/interfaces/province-sales.interface';

export const mapProvinceSales = (
	row: ProvinceSalesSummaryRow,
): ProvinceSales => ({
	id: Number(row.id ?? 0),
	name: row.name ?? '',
	slug: row.slug ?? '',
	lat: Number(row.lat ?? 0),
	lng: Number(row.lng ?? 0),
	totalSales: Number(row.total_sales ?? 0),
});

export const prepareProvinceSalesEntryForSave = (
	input: ProvinceSalesEntryInput,
) => ({
	province_id: input.provinceId,
	quantity: input.quantity,
	note: input.note.trim() || null,
});
