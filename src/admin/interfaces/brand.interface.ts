import type {Tables} from '@/supabase/database.types';

// as it comes from Supabase
export type BrandRow = Tables<'brands'>;

// app model we are using
export interface Brand {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	createdAt: string; // ISO 8601
}

// what we use for creating and updating
export interface BrandInput {
	name: string;
	slug: string;
	description: string;
}
