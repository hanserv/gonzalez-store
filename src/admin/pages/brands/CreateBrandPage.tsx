import {useNavigate} from 'react-router';
import {AdminTitle} from '@/admin/components/AdminTitle';
import {useCreateBrand} from '@/admin/hooks/brands/useCreateBrand';
import type {BrandInput} from '@/admin/interfaces/brand.interface';
import {BrandForm} from './ui/BrandForm';

export const CreateBrandPage = () => {
	const navigate = useNavigate();
	const {mutate, isPending} = useCreateBrand();

	const handleSubmit = (values: BrandInput) => {
		mutate(values, {onSuccess: () => navigate('/admin/brands')});
	};

	return (
		<>
			<div className='mb-5 mx-auto max-w-2xl'>
				<AdminTitle
					title='Nueva marca'
					subtitle='El slug se usa en la URL pública de la tienda'
				/>
			</div>

			<BrandForm
				isPending={isPending}
				submitLabel='Crear'
				onSubmit={handleSubmit}
			/>
		</>
	);
};
