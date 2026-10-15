import type {PropsWithChildren} from 'react';
import {Navigate} from 'react-router';
import {useAuthStore} from '@/auth/stores/auth.store';

export const AuthenticatedRoute = ({children}: PropsWithChildren) => {
	const status = useAuthStore((s) => s.status);

	if (status === 'checking') return null;
	if (status === 'not-authenticated')
		return <Navigate to='/auth/login' replace />;

	return <>{children}</>;
};

export const NotAuthenticatedRoute = ({children}: PropsWithChildren) => {
	const status = useAuthStore((s) => s.status);

	if (status === 'checking') return null;
	if (status === 'authenticated') return <Navigate to='/admin' replace />;

	return <>{children}</>;
};
