import {Link, NavLink} from 'react-router';
import {cn} from '@/lib/utils';
import {menuItems} from '../interfaces/sidebar.config';
import {ArrowUpRight, Store} from 'lucide-react';
import {buttonVariants} from '@/components/ui/button';

interface AdminSidebarNavProps {
	isCollapsed?: boolean;
	onNavigate?: () => void;
}

export const AdminSidebarNav = ({
	isCollapsed = false,
	onNavigate,
}: AdminSidebarNavProps) => (
	<>
		<div className='flex h-16 shrink-0 items-center justify-center border-b px-3'>
			<img
				src='/gonzalez-logo.png'
				alt='Gonzalez logo'
				draggable={false}
				className={cn(
					'object-contain transition-all',
					isCollapsed ? 'h-8' : 'h-10',
				)}
			/>
		</div>

		<nav className='flex flex-1 flex-col gap-1 p-2'>
			{menuItems.map(({icon: Icon, label, to, end}) => (
				<NavLink
					key={to}
					to={to}
					end={end}
					onClick={onNavigate}
					title={isCollapsed ? label : undefined}
					className={({isActive}) =>
						cn(
							'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
							isCollapsed && 'justify-center px-0',
							isActive
								? 'bg-black text-white border-r-2 border-white'
								: 'text-gray-600 hover:bg-muted hover:text-foreground',
						)
					}
				>
					<Icon className='size-5 shrink-0' />
					{!isCollapsed && <span className='truncate'>{label}</span>}
				</NavLink>
			))}
		</nav>

		{/* Public store access */}
		<div className='p-2'>
			<Link
				to='/'
				onClick={onNavigate}
				title={isCollapsed ? 'Ir a la tienda' : undefined}
				aria-label='Ir a la tienda'
				lang='es'
				translate='no'
				className={cn(
					buttonVariants({variant: 'outline', size: 'sm'}),
					'group w-full rounded-full border-current/30  text-black ',
					isCollapsed ? 'justify-center px-0' : 'justify-start gap-3 px-3',
				)}
			>
				<Store className='size-4 shrink-0' />
				{!isCollapsed && (
					<>
						<span className='flex-1 truncate'>Ir a la tienda</span>
						<ArrowUpRight className='size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
					</>
				)}
			</Link>
		</div>
	</>
);
