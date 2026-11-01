import type {Database} from '@/supabase/database.types';

export type ProvinceSalesSummaryRow =
	Database['public']['Views']['province_sales_summary']['Row'];

export interface ProvinceSales {
	id: number;
	name: string;
	slug: string;
	lat: number;
	lng: number;
	totalSales: number;
}

export interface ProvinceSalesEntryInput {
	provinceId: number;
	quantity: number;
	note: string;
}
