// src/admin/layouts/AdminLayout.tsx
import {useState} from 'react';
import {Outlet} from 'react-router';
import {AdminSidebar} from '@/admin/components/AdminSidebar';
import {AdminMobileSidebar} from '@/admin/components/AdminMobileSidebar';
import {AdminHeader} from '@/admin/components/AdminHeader';

const AdminLayout = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	return (
		<div className='flex min-h-screen bg-gray-50'>
			<AdminSidebar
				isCollapsed={isCollapsed}
				onToggle={() => setIsCollapsed((prev) => !prev)}
			/>
			<AdminMobileSidebar open={isMobileOpen} onOpenChange={setIsMobileOpen} />

			<div className='flex min-w-0 flex-1 flex-col'>
				<AdminHeader onMenuClick={() => setIsMobileOpen(true)} />
				<main className='flex-1 overflow-auto p-4 sm:p-6'>
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;
