import {supabase} from '@/supabase/supabase';
import type {Session, User} from '@supabase/supabase-js';

interface Props {
	email: string;
	password: string;
}

interface LoginResult {
	user: User;
	session: Session;
}

export const loginAction = async ({
	email,
	password,
}: Props): Promise<LoginResult> => {
	const {data, error} = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) throw error;

	return data;
};
