import type {Tables} from '@/supabase/database.types';

// como viene de Supabase
export type CategoryRow = Tables<'categories'>;

// app model we are using
export interface Category {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	createdAt: string; // ISO 8601
}

// what we use for creating and updating
export interface CategoryInput {
	name: string;
	slug: string;
	description: string;
}
