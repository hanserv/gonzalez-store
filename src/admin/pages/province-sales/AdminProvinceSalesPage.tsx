import {AdminTitle} from '@/admin/components/AdminTitle';
import {AddProvinceSalesForm} from '@/admin/pages/province-sales/ui/AddProvinceSalesForm';

export const AdminProvinceSalesPage = () => (
	<div className='flex flex-col gap-5'>
		<AdminTitle
			title='Ventas por provincia'
			subtitle='Registra los totales de ventas de cada provincia'
		/>
		<div className='mx-auto w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-6'>
			<AddProvinceSalesForm />
		</div>
	</div>
);
