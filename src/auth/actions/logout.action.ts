import {supabase} from '@/supabase/supabase';

export const logoutAction = async (): Promise<void> => {
	const {error} = await supabase.auth.signOut();

	if (error) throw error;
};
