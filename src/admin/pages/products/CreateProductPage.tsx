import {useNavigate} from 'react-router';
import {AdminTitle} from '@/admin/components/AdminTitle';
import {useBrands} from '@/admin/hooks/brands/useBrands';
import {useCategories} from '@/admin/hooks/categories/useCategories';
import {useCreateProduct} from '@/admin/hooks/products/useCreateProduct';
import type {ProductInput} from '@/admin/interfaces/product.interface';
import {ProductForm} from './ui/ProductForm';

export const CreateProductPage = () => {
	const navigate = useNavigate();
	const {data: brands = []} = useBrands();
	const {data: categories = []} = useCategories();
	const {mutate, isPending} = useCreateProduct();

	const handleSubmit = (values: ProductInput) => {
		mutate(values, {
			onSuccess: (product) => navigate(`/admin/products/${product.id}`),
		});
	};

	return (
		<>
			<div className='mb-5 mx-auto max-w-2xl'>
				<AdminTitle
					title='Nuevo producto'
					subtitle='El producto solo guarda nombre, marca y categoría'
				/>
			</div>

			<ProductForm
				isPending={isPending}
				submitLabel='Crear'
				onSubmit={handleSubmit}
				brandOptions={brands}
				categoryOptions={categories}
			/>
		</>
	);
};
