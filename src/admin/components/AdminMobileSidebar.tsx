import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
} from '@/components/ui/sheet';
import {AdminSidebarNav} from './AdminSidebarNav';

interface AdminMobileSidebarProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const AdminMobileSidebar = ({
	open,
	onOpenChange,
}: AdminMobileSidebarProps) => (
	<Sheet open={open} onOpenChange={onOpenChange}>
		<SheetContent
			side='left'
			className='flex w-64 flex-col gap-0 p-0 md:hidden'
		>
			<SheetTitle className='sr-only'>Menú de navegación</SheetTitle>
			<SheetDescription className='sr-only'>
				Navegación del panel de administración
			</SheetDescription>

			<AdminSidebarNav onNavigate={() => onOpenChange(false)} />
		</SheetContent>
	</Sheet>
);
