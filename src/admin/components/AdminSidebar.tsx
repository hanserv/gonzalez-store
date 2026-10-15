import {PanelLeftClose, PanelLeftOpen} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {AdminSidebarNav} from './AdminSidebarNav';

interface AdminSidebarProps {
	isCollapsed: boolean;
	onToggle: () => void;
}

export const AdminSidebar = ({isCollapsed, onToggle}: AdminSidebarProps) => (
	<aside
		className={cn(
			'sticky top-0 hidden h-screen shrink-0 flex-col border-r bg-background transition-[width] duration-300 md:flex',
			isCollapsed ? 'w-16' : 'w-64',
		)}
	>
		<AdminSidebarNav isCollapsed={isCollapsed} />

		<div className='border-t p-2'>
			<Button
				variant='ghost'
				size='icon'
				onClick={onToggle}
				aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
				className={cn('w-full', !isCollapsed && 'justify-start px-3')}
			>
				{isCollapsed ? (
					<PanelLeftOpen className='size-5' />
				) : (
					<>
						<PanelLeftClose className='mr-3 size-5' />
						<span className='text-sm'>Colapsar</span>
					</>
				)}
			</Button>
		</div>
	</aside>
);
