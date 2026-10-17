import {useNavigate, useParams} from 'react-router';
import {Navigate} from 'react-router';
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
	isActive: true,
	displayOrder: 1,
	sizes: [{size: '', stock: 0}],
};

export const CreateProductVariantPage = () => {
	const {productId} = useParams();
	const navigate = useNavigate();

	if (!productId) return <Navigate to='/admin/products' replace />;

	return (
		<CreateProductVariantContent
			productId={productId}
			onDone={() => navigate(`/admin/products/${productId}`)}
		/>
	);
};

interface CreateProductVariantContentProps {
	productId: string;
	onDone: () => void;
}

const CreateProductVariantContent = ({
	productId,
	onDone,
}: CreateProductVariantContentProps) => {
	const {data: product, isLoading} = useProduct(productId);
	const {mutate, isPending} = useCreateProductVariant();

	const handleSubmit = (values: ProductVariantFormValues) => {
		mutate({productId, ...values}, {onSuccess: onDone});
	};

	return (
		<div className='flex flex-col gap-5'>
			<AdminTitle
				title='Nueva variante'
				subtitle='La variante guarda nombre, slug, precio y tallas'
			/>

			{!isLoading && product && (
				<p className='text-sm text-muted-foreground'>
					Producto: {product.name}
				</p>
			)}

			<ProductVariantForm
				defaultValues={emptyValues}
				isPending={isPending}
				submitLabel='Crear variante'
				onSubmit={handleSubmit}
				onCancelUrl={`/admin/products/${productId}`}
			/>
		</div>
	);
};
