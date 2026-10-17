import {Link, Navigate, useParams} from 'react-router';
import {ArrowLeft} from 'lucide-react';
import {AdminTitle} from '@/admin/components/AdminTitle';
import {useProduct} from '@/admin/hooks/products/useProduct';
import {useReorderProductVariants} from '@/admin/hooks/products/useReorderProductVariants';
import {useToggleProductVariantActive} from '@/admin/hooks/products/useToggleProductVariantActive';
import {buttonVariants, Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {ProductVariantsTable} from './ui/ProductVariantsTable';

export const AdminProductPage = () => {
	const {productId} = useParams();

	if (!productId) return <Navigate to='/admin/products' replace />;

	return <AdminProductContent productId={productId} />;
};

interface AdminProductContentProps {
	productId: string;
}

const AdminProductContent = ({productId}: AdminProductContentProps) => {
	const {data: product, isLoading, isError} = useProduct(productId);
	const {mutate: toggleActive} = useToggleProductVariantActive(productId);
	const {mutate: reorder} = useReorderProductVariants(productId);

	const handleToggleActive = (id: string, isActive: boolean) => {
		toggleActive({id, isActive});
	};

	const handleReorder = (orderedIds: string[]) => {
		reorder({orderedIds});
	};

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<AdminTitle
					title='Detalle del producto'
					subtitle='Gestiona las variantes y tallas'
				/>

				<div className='flex flex-wrap gap-2'>
					<Link
						to='/admin/products'
						className={buttonVariants({variant: 'outline'})}
					>
						<ArrowLeft />
						Volver
					</Link>
					<Link
						to={`/admin/products/${productId}/variants/new`}
						className={buttonVariants()}
					>
						Agregar variante
					</Link>
				</div>
			</div>

			{isLoading && (
				<div className='grid gap-4 rounded-xl border border-gray-200 bg-white p-6'>
					<Skeleton className='h-6 w-56' />
					<Skeleton className='h-4 w-full max-w-96' />
					<Skeleton className='h-4 w-full max-w-72' />
				</div>
			)}

			{isError && (
				<div className='rounded-xl border border-gray-200 bg-white p-10 text-center'>
					<p className='mb-3 text-sm text-muted-foreground'>
						No se encontró el producto.
					</p>
					<Button
						variant='outline'
						size='sm'
						nativeButton={false}
						render={<Link to='/admin/products' />}
					>
						Volver a productos
					</Button>
				</div>
			)}

			{product && (
				<>
					<div className='rounded-xl border border-gray-200 bg-white p-6'>
						<div className='flex flex-col gap-2'>
							<p className='text-sm text-muted-foreground'>
								{product.brandName} · {product.categoryName}
							</p>
							<h2 className='text-2xl font-semibold'>{product.name}</h2>
							<p className='text-sm text-muted-foreground'>
								Este producto agrupa todas sus variantes. La primera variante
								activa es la portada del catálogo.
							</p>
						</div>
					</div>

					<ProductVariantsTable
						productId={product.id}
						variants={product.variants}
						onToggleActive={handleToggleActive}
						onReorder={handleReorder}
					/>
				</>
			)}
		</div>
	);
};
