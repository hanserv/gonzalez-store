import {useState} from 'react';
import {ChevronDown, Loader2, LogOut, Menu} from 'lucide-react';
import {toast} from 'sonner';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {useAuthStore} from '@/auth/stores/auth.store';
import {logoutAction} from '@/auth/actions/logout.action';
import {Button} from '@/components/ui/button';
import {CustomLogo} from '@/components/custom/CustomLogo';

const getInitials = (name: string): string => {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('');
};

interface AdminHeaderProps {
	onMenuClick: () => void;
}

export const AdminHeader = ({onMenuClick}: AdminHeaderProps) => {
	const user = useAuthStore((s) => s.user);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const displayName = user?.fullName ?? user?.email ?? 'Admin';
	const email = user?.email ?? '';

	const handleLogout = async () => {
		if (isLoggingOut) return;
		setIsLoggingOut(true);

		try {
			await logoutAction();

			toast.success('Cerraste sesión correctamente.', {
				position: 'bottom-right',
			});
		} catch {
			toast.error('No se pudo cerrar sesión, intenta de nuevo luego.', {
				position: 'bottom-right',
			});
			setIsLoggingOut(false);
		}
	};

	return (
		<header className='flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6'>
			<Button
				variant='ghost'
				size='icon'
				className='md:hidden'
				onClick={onMenuClick}
				aria-label='Abrir menú'
			>
				<Menu className='size-5' />
			</Button>

			<CustomLogo subtitle='Administración' url='/admin' />

			{/* Push the user menu to the right of the desktop*/}
			<div className='ml-auto'>
				<DropdownMenu>
					<DropdownMenuTrigger className='flex items-center gap-3 rounded-md p-1.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gonzalez-golden'>
						<Avatar className='size-9'>
							<AvatarFallback className='bg-black text-sm font-semibold text-white'>
								{getInitials(displayName)}
							</AvatarFallback>
						</Avatar>

						<div className='hidden text-left leading-tight sm:block'>
							<p className='max-w-48 truncate text-sm font-semibold'>
								{displayName}
							</p>
							<p className='max-w-48 truncate text-xs text-muted-foreground'>
								{email}
							</p>
						</div>

						<ChevronDown className='size-4 text-muted-foreground' />
					</DropdownMenuTrigger>

					<DropdownMenuContent align='end' className='w-56'>
						<DropdownMenuGroup>
							<DropdownMenuLabel className='font-normal'>
								<p className='truncate text-sm font-semibold'>{displayName}</p>
								<p className='truncate text-xs text-muted-foreground'>
									{email}
								</p>
							</DropdownMenuLabel>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuItem
							variant='destructive'
							closeOnClick={false}
							disabled={isLoggingOut}
							onClick={handleLogout}
						>
							{isLoggingOut ? (
								<Loader2 className='mr-2 size-4 animate-spin' />
							) : (
								<LogOut className='mr-2 size-4' />
							)}
							{isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
};
