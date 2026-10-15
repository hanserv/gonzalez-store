import {AdminTitle} from '@/admin/components/AdminTitle';
import {buttonVariants} from '@/components/ui/button';
import {PlusIcon} from 'lucide-react';
import {Link} from 'react-router';

export const AdminProductsPage = () => {
	return (
		<div className='mb-5 flex items-center justify-between gap-4'>
			<AdminTitle title='Productos' subtitle='Administra tus productos' />

			<div className='flex justify-end  gap-4'>
				<Link to='/admin/categories/new' className={buttonVariants()}>
					<PlusIcon />
					Nuevo Producto
				</Link>
			</div>
		</div>
	);
};
