import {Navigate, useNavigate, useParams} from 'react-router';
import {AdminTitle} from '@/admin/components/AdminTitle';
import {useCreateProductVariant} from '@/admin/hooks/products/useCreateProductVariant';
import {useProduct} from '@/admin/hooks/products/useProduct';
import type {ProductVariantFormValues} from '@/admin/schemas/product-variant.schema';
import {ProductVariantForm} from './ui/ProductVariantForm';

const emptyValues: ProductVariantFormValues = {
	name: '',
	slug: '',
	description: '',
	price: 0,
	discountPercentage: 0,
	sizes: [{size: '', stock: 0}],
};

export const CreateProductVariantPage = () => {
	const {productId} = useParams();

	if (!productId) return <Navigate to='/admin/products' replace />;

	return <CreateProductVariantContent productId={productId} />;
};

interface CreateProductVariantContentProps {
	productId: string;
}

const CreateProductVariantContent = ({
	productId,
}: CreateProductVariantContentProps) => {
	const navigate = useNavigate();
	const {data: product} = useProduct(productId);
	const {mutate, isPending} = useCreateProductVariant();

	const handleSubmit = (values: ProductVariantFormValues) => {
		mutate(
			{productId, ...values, isActive: false},
			{
				onSuccess: (variant) =>
					navigate(`/admin/products/${productId}/variants/${variant.id}`),
			},
		);
	};

	return (
		<>
			<div className='mb-5 mx-auto max-w-5xl'>
				<AdminTitle
					title='Nueva variante'
					subtitle={
						product
							? `Producto: ${product.name}`
							: 'La variante guarda nombre, slug, precio y tallas'
					}
				/>
			</div>

			<ProductVariantForm
				defaultValues={emptyValues}
				isPending={isPending}
				submitLabel='Crear variante'
				onSubmit={handleSubmit}
				onCancelUrl={`/admin/products/${productId}`}
				productName={product?.name}
				proposeSlug
			/>
		</>
	);
};
