import type {User} from '@/interfaces/user.interface';
import type {User as SupabaseUser} from '@supabase/supabase-js';

export const mapAuthUser = (user: SupabaseUser): User => {
	const fullName = user.user_metadata?.full_name;

	return {
		id: user.id,
		email: user.email ?? '',
		fullName: typeof fullName === 'string' ? fullName : null,
	};
};
