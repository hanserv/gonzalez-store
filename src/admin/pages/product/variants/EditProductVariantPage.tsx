import {Navigate, useNavigate, useParams} from 'react-router';
import {AdminTitle} from '@/admin/components/AdminTitle';
import {useProduct} from '@/admin/hooks/products/useProduct';
import {useProductVariant} from '@/admin/hooks/products/useProductVariant';
import {useUpdateProductVariant} from '@/admin/hooks/products/useUpdateProductVariant';
import type {ProductVariantFormValues} from '@/admin/schemas/product-variant.schema';
import {ProductVariantForm} from './ui/ProductVariantForm';

export const EditProductVariantPage = () => {
	const {productId, variantId} = useParams();
	const navigate = useNavigate();

	if (!productId || !variantId)
		return <Navigate to='/admin/products' replace />;

	return (
		<EditProductVariantContent
			productId={productId}
			variantId={variantId}
			onDone={() => navigate(`/admin/products/${productId}`)}
		/>
	);
};

interface EditProductVariantContentProps {
	productId: string;
	variantId: string;
	onDone: () => void;
}

const EditProductVariantContent = ({
	productId,
	variantId,
	onDone,
}: EditProductVariantContentProps) => {
	const {data: product} = useProduct(productId);
	const {data: variant, isLoading, isError} = useProductVariant(variantId);
	const {mutate, isPending} = useUpdateProductVariant();

	const handleSubmit = (values: ProductVariantFormValues) => {
		mutate({id: variantId, input: {productId, ...values}}, {onSuccess: onDone});
	};

	return (
		<>
			<div className='mb-5 mx-auto max-w-3xl'>
				<AdminTitle
					title='Editar variante'
					subtitle={
						product
							? `Producto: ${product.name}`
							: 'Ajusta los datos y las tallas de la variante'
					}
				/>
			</div>

			{isLoading && (
				<div className='mx-auto flex max-w-3xl flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6'>
					<p className='text-sm text-muted-foreground'>Cargando variante...</p>
				</div>
			)}

			{isError && (
				<div className='mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-10 text-center'>
					<p className='text-sm text-muted-foreground'>
						No se encontró la variante.
					</p>
				</div>
			)}

			{variant && (
				<ProductVariantForm
					defaultValues={{
						name: variant.name,
						slug: variant.slug,
						description: variant.description ?? '',
						price: variant.price,
						discountPercentage: variant.discountPercentage,
						isActive: variant.isActive,
						sizes:
							variant.sizes.length > 0 ? variant.sizes : [{size: '', stock: 0}],
					}}
					isPending={isPending}
					submitLabel='Guardar cambios'
					onSubmit={handleSubmit}
					onCancelUrl={`/admin/products/${productId}`}
				/>
			)}
		</>
	);
};
