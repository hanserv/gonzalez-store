import {useState} from 'react';
import {Link, NavLink} from 'react-router';
import {Menu, ShoppingCart, UserCog, X} from 'lucide-react';
import {Button, buttonVariants} from '@/components/ui/button';
import {CustomLogo} from '@/components/custom/CustomLogo';
import {useAuthStore} from '@/auth/stores/auth.store';
import {cn} from '@/lib/utils';

interface ShopHeaderProps {
	backgroundColor?: string;
	textColor?: string;
	position?: 'sticky' | 'absolute';
}

interface NavItem {
	label: string;
	to: string;
	end?: boolean;
}

const navItems: NavItem[] = [
	{label: 'Inicio', to: '/', end: true},
	{label: 'Tienda', to: '/store'},
	{label: 'Sobre nosotros', to: '/about'},
];

// Clases completas, para que Tailwind las detecte
const positionClasses = {
	sticky: 'sticky top-4',
	absolute: 'absolute inset-x-0 top-4',
} as const;

interface NavItemLinkProps extends NavItem {
	className?: string;
	onClick?: () => void;
}

// Link con subrayado animado cuando está activo
const NavItemLink = ({
	label,
	to,
	end,
	className,
	onClick,
}: NavItemLinkProps) => (
	<NavLink
		to={to}
		end={end}
		onClick={onClick}
		className={({isActive}) =>
			cn(
				'group text-sm transition-opacity hover:opacity-100',
				isActive ? 'font-semibold opacity-100' : 'font-medium opacity-70',
				className,
			)
		}
	>
		{({isActive}) => (
			<span className='relative inline-block py-1'>
				{label}
				<span
					aria-hidden='true'
					className={cn(
						'absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-current transition-transform duration-300',
						isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
					)}
				/>
			</span>
		)}
	</NavLink>
);

export const ShopHeader = ({
	backgroundColor = '#ffffff',
	textColor = '#111827',
	position = 'sticky',
}: ShopHeaderProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const isAuthenticated = useAuthStore((s) => s.status === 'authenticated');

	const closeMenu = () => setIsOpen(false);

	return (
		<header className={cn('z-50 px-4', positionClasses[position])}>
			<div className='relative mx-auto max-w-5xl'>
				<div
					className='flex items-center justify-between rounded-full px-5 py-3 shadow-lg md:grid md:grid-cols-[1fr_auto_1fr]'
					style={{backgroundColor, color: textColor}}
				>
					{/* Logo */}
					<div className='justify-self-start'>
						<CustomLogo
							title={
								<>
									Gonzalez<span className='hidden lg:inline'> Peña</span>
								</>
							}
							logoSrc='/gonzalez-logo-white.png'
							subtitleClassName='text-inherit opacity-70'
							onClick={closeMenu}
						/>
					</div>

					{/* Links (escritorio) */}
					<nav className='hidden items-center gap-8 md:flex'>
						{navItems.map((item) => (
							<NavItemLink key={item.to} {...item} />
						))}
					</nav>

					{/* Acciones (derecha) */}
					<div className='flex items-center gap-1 md:col-start-3 md:justify-self-end'>
						{isAuthenticated && (
							<Link
								to='/admin'
								className={cn(
									buttonVariants({variant: 'outline', size: 'sm'}),
									'hidden rounded-full border-current/30 bg-gonzalez-bone text-black hover:text-gonzalez-red md:inline-flex',
								)}
							>
								<UserCog />
								Panel Admin
							</Link>
						)}

						{/* Solo estético por ahora */}
						<Button
							type='button'
							variant='ghost'
							size='icon'
							aria-label='Carrito'
							className='rounded-full text-inherit hover:bg-black/5 hover:text-inherit'
						>
							<ShoppingCart className='size-5' />
						</Button>

						<button
							type='button'
							className='rounded-full p-1.5 md:hidden'
							onClick={() => setIsOpen((prev) => !prev)}
							aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
							aria-expanded={isOpen}
						>
							{isOpen ? <X className='size-5' /> : <Menu className='size-5' />}
						</button>
					</div>
				</div>

				{/* Panel para móvil */}
				{isOpen && (
					<nav
						className='absolute items-center inset-x-0 top-full mt-2 flex flex-col gap-0 rounded-3xl p-3 shadow-lg md:hidden'
						style={{backgroundColor, color: textColor}}
					>
						{navItems.map((item) => (
							<NavItemLink
								key={item.to}
								{...item}
								className='px-4 py-2'
								onClick={closeMenu}
							/>
						))}

						{isAuthenticated && (
							<Link
								to='/admin'
								onClick={closeMenu}
								className='mt-1 flex items-center gap-2 rounded-full border-t px-4 py-2 text-sm font-medium'
							>
								<UserCog className='size-4' />
								Panel de administración
							</Link>
						)}
					</nav>
				)}
			</div>
		</header>
	);
};
