import {AdminTitle} from '@/admin/components/AdminTitle';
import {buttonVariants} from '@/components/ui/button';
import {PlusIcon} from 'lucide-react';
import {Link} from 'react-router';

export const AdminBrandsPage = () => {
	return (
		<div className='mb-5 flex items-center justify-between gap-4'>
			<AdminTitle title='Marcas' subtitle='Administra tus marcas' />

			<div className='flex justify-end  gap-4'>
				<Link to='/admin/categories/new' className={buttonVariants()}>
					<PlusIcon />
					Nueva Marca
				</Link>
			</div>
		</div>
	);
};
