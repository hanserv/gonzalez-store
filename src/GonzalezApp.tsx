import '@/auth/stores/auth.store';
import {Suspense} from 'react';
import {RouterProvider} from 'react-router';
import {appRouter} from './app.router';
import {Toaster} from 'sonner';
import {queryClient} from './lib/query-client';
import {QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

export const GonzalezApp = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<div lang='es' translate='no'>
				<Suspense
					fallback={
						<div className='flex h-screen flex-col items-center justify-center'>
							<img
								src='/gonzalez-logo.png'
								alt='Gonzalez logo'
								className='h-16 w-auto object-contain'
							/>
							<h2 className='mt-1 font-montserrat font-bold'>Cargando...</h2>
						</div>
					}
				>
					<RouterProvider router={appRouter} />
				</Suspense>

				<Toaster />
				<ReactQueryDevtools
					initialIsOpen={false}
					buttonPosition='bottom-right'
				/>
			</div>
		</QueryClientProvider>
	);
};
