import {create} from 'zustand';
import type {User} from '@/interfaces/user.interface';
import {supabase} from '@/supabase/supabase';
import {mapAuthUser} from '../mappers/auth-user.mapper';
import {queryClient} from '@/lib/query-client';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

interface AuthState {
	user: User | null;
	status: AuthStatus;
}

export const useAuthStore = create<AuthState>(() => ({
	user: null,
	status: 'checking',
}));

supabase.auth.onAuthStateChange((event, session) => {
	useAuthStore.setState({
		user: session ? mapAuthUser(session.user) : null,
		status: session ? 'authenticated' : 'not-authenticated',
	});

	if (event === 'SIGNED_OUT') queryClient.clear();
});
