import {useEffect, useState} from 'react';
import {Link, NavLink} from 'react-router';
import {Menu, ShoppingCart, UserCog, X} from 'lucide-react';
import {Button, buttonVariants} from '@/components/ui/button';
import {CustomLogo} from '@/components/custom/CustomLogo';
import {useAuthStore} from '@/auth/stores/auth.store';
import {selectCartCount, useCartStore} from '@/shop/stores/cart.store';
import {cn} from '@/lib/utils';

interface ShopHeaderProps {
	backgroundColor?: string;
	textColor?: string;
	position?: 'sticky' | 'absolute' | 'fixed';
}

export interface NavItem {
	label: string;
	to: string;
	end?: boolean;
}

const navItems: NavItem[] = [
	{label: 'Inicio', to: '/', end: true},
	{label: 'Tienda', to: '/store'},
	{label: 'Sobre nosotros', to: '/about'},
];

const DARK_INK = '#111827';
const LOGO_WHITE = '/gonzalez-logo-white.png';
const LOGO_DARK = '/gonzalez-logo.png';
// Pixels of scroll before the header switches to its see through state
const SCROLL_THRESHOLD = 8;
// Scrolled look: a light veil of the brand black, so the page shows behind
const SCROLLED_BACKGROUND = 'rgba(0, 0, 0, 0.25)';

// Clases completas, para que Tailwind las detecte
const positionClasses = {
	sticky: 'sticky top-4',
	absolute: 'absolute inset-x-0 top-4',
	fixed: 'fixed inset-x-0 top-4',
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
	textColor = DARK_INK,
	position = 'sticky',
}: ShopHeaderProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const isAuthenticated = useAuthStore((s) => s.status === 'authenticated');
	const cartCount = useCartStore(selectCartCount);
	const openCart = useCartStore((state) => state.openCart);

	// The dark logo only shows in the see through state, so load it upfront
	useEffect(() => {
		const image = new Image();
		image.src = LOGO_DARK;
	}, []);

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);

		handleScroll();
		window.addEventListener('scroll', handleScroll, {passive: true});

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Solid while at the top, see through while scrolling, solid again on hover
	// or with the mobile menu open
	const isSeeThrough = isScrolled && !isHovered && !isOpen;

	const closeMenu = () => setIsOpen(false);

	const headerBackgroundColor = isSeeThrough
		? SCROLLED_BACKGROUND
		: backgroundColor;
	const headerTextColor = isSeeThrough ? DARK_INK : textColor;
	const logoSrc = isSeeThrough ? LOGO_DARK : LOGO_WHITE;

	return (
		<header className={cn('z-50 px-4', positionClasses[position])}>
			<div
				className='relative mx-auto max-w-5xl'
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div
					className={cn(
						'flex items-center justify-between rounded-full px-5 py-3 transition-[background-color,box-shadow,color] duration-300 ease-out md:grid md:grid-cols-[1fr_auto_1fr]',
						isSeeThrough ? 'shadow-none' : 'shadow-lg',
					)}
					style={{
						backgroundColor: headerBackgroundColor,
						color: headerTextColor,
					}}
				>
					{/* Logo */}
					<div className='justify-self-start'>
						<CustomLogo
							title={
								<>
									<span className='hidden lg:inline'>gonzalez Peña</span>
								</>
							}
							logoSrc={logoSrc}
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
									'hidden rounded-full border-current/30 bg-gray-50 text-black hover:text-gonzalez-red md:inline-flex',
								)}
							>
								<UserCog />
								Panel Admin
							</Link>
						)}

						{/* Carrito */}
						<Button
							type='button'
							variant='ghost'
							size='icon'
							aria-label={
								cartCount > 0
									? `Abrir carrito, ${cartCount} ${
											cartCount === 1 ? 'artículo' : 'artículos'
										}`
									: 'Abrir carrito'
							}
							onClick={openCart}
							className='relative rounded-full text-inherit hover:bg-black/5 hover:text-inherit'
						>
							<ShoppingCart className='size-5' />
							{cartCount > 0 && (
								<span className='absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-gonzalez-red px-1 text-[10px] leading-4 font-semibold text-white'>
									{cartCount > 99 ? '99+' : cartCount}
								</span>
							)}
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
						style={{backgroundColor: headerBackgroundColor, color: headerTextColor}}
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
