import {useNavigate} from 'react-router';
import {AdminTitle} from '@/admin/components/AdminTitle';
import {useCreateCategory} from '@/admin/hooks/useCreateCategory';
import type {CategoryInput} from '@/admin/interfaces/category.interface';
import {CategoryForm} from './ui/CategoryForm';

export const CreateCategoryPage = () => {
	const navigate = useNavigate();
	const {mutate, isPending} = useCreateCategory();

	const handleSubmit = (values: CategoryInput) => {
		mutate(values, {onSuccess: () => navigate('/admin/categories')});
	};

	return (
		<>
			<div className='mb-5 mx-auto max-w-2xl'>
				<AdminTitle
					title='Nueva categoría'
					subtitle='El slug se usa en la URL pública de la tienda'
				/>
			</div>

			<CategoryForm
				isPending={isPending}
				submitLabel='Crear'
				onSubmit={handleSubmit}
			/>
		</>
	);
};
