import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {CustomLogo} from '@/components/custom/CustomLogo';
import {Eye, EyeOff, Loader2} from 'lucide-react';
import {loginAction} from '@/auth/actions/login.action';
import {AuthError} from '@supabase/supabase-js';
import {toast} from 'sonner';

export const LoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [isPending, setIsPending] = useState(false);

	const handleLogin = async (event: React.SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);

		const email = (formData.get('email') as string).trim().toLowerCase();
		const password = formData.get('password') as string;

		setIsPending(true);

		try {
			await loginAction({email, password});
			toast.success('Iniciaste sesión correctamente.', {
				position: 'bottom-right',
			});
		} catch (error) {
			if (error instanceof AuthError && error.code === 'invalid_credentials') {
				toast.error('Correo o contraseña incorrectos.', {
					position: 'bottom-right',
				});
			} else {
				toast.error('Ocurrió un error, intenta de nuevo luego.', {
					position: 'bottom-right',
				});
			}
			setIsPending(false);
		}
	};

	return (
		<div className={'flex flex-col gap-6'}>
			<Card className='overflow-hidden p-0  '>
				<CardContent className='grid p-0 md:grid-cols-2'>
					<form className='p-6 md:p-8' onSubmit={handleLogin}>
						<div className='flex flex-col gap-6'>
							<div className='flex flex-col items-center text-center'>
								<img
									src='/gonzalez-logo.png'
									alt='Gonzalez logo'
									draggable={false}
									className='mb-4 h-16 w-auto object-contain'
								/>

								<CustomLogo title='Gonzalez Peña' url='/auth/login' />

								<p className='text-balance text-muted-foreground font-inter mt-2'>
									Ingresar al módulo de management
								</p>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									type='email'
									name='email'
									autoComplete='email'
									placeholder='gonzalez@gmail.com'
									required
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='password'>Password</Label>
								<div className='relative'>
									<Input
										id='password'
										type={showPassword ? 'text' : 'password'}
										name='password'
										autoComplete='password'
										required
										placeholder='Contraseña'
										className='pr-10 [&::-ms-reveal]:hidden'
									/>
									<button
										type='button'
										onClick={() => setShowPassword((prev) => !prev)}
										aria-label={
											showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
										}
										className='absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground'
									>
										{showPassword ? (
											<EyeOff className='size-4' />
										) : (
											<Eye className='size-4' />
										)}
									</button>
								</div>
							</div>
							<p className='text-center text-sm font-inter underline-offset-2 hover:underline'>
								¿Olvidaste tu contraseña? Escribele a Hanser
							</p>
							<Button
								type='submit'
								className='w-full font-semibold'
								disabled={isPending}
							>
								{isPending ? (
									<>
										<Loader2 className='mr-2 size-4 animate-spin' />
										Ingresando...
									</>
								) : (
									'Iniciar Sesión'
								)}
							</Button>
						</div>
					</form>

					<div className='relative hidden select-none bg-gonzalez-bone md:flex md:flex-col md:items-center md:justify-center md:gap-6 md:p-12'>
						<img
							src='/gonzalez-logo.png'
							alt='Gonzalez logo'
							draggable={false}
							className='max-h-[60%] w-full object-contain'
						/>
						<div className='w-full text-center font-cinzel text-black'>
							<div className='flex items-center gap-4 px-1'>
								<div className='h-px flex-1 bg-black' />
								<p className='text-lg font-semibold'>Pasos pequeños</p>
								<div className='h-px flex-1 bg-black' />
							</div>
							<p className='text-2xl font-bold tracking-wide'>
								Huellas gigantes
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
