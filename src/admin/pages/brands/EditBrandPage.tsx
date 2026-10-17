import {Link, Navigate, useNavigate, useParams} from 'react-router';
import {AdminTitle} from '@/admin/components/AdminTitle';
import {useBrand} from '@/admin/hooks/brands/useBrand';
import {useUpdateBrand} from '@/admin/hooks/brands/useUpdateBrand';
import type {BrandInput} from '@/admin/interfaces/brand.interface';
import {buttonVariants} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {BrandForm} from './ui/BrandForm';

export const EditBrandPage = () => {
	const {id} = useParams();
	const navigate = useNavigate();

	if (!id) return <Navigate to='/admin/brands' replace />;

	return <EditBrandContent id={id} onDone={() => navigate('/admin/brands')} />;
};

interface EditBrandContentProps {
	id: string;
	onDone: () => void;
}

const EditBrandContent = ({id, onDone}: EditBrandContentProps) => {
	const {data: brand, isLoading, isError} = useBrand(id);
	const {mutate, isPending} = useUpdateBrand();

	const handleSubmit = (values: BrandInput) => {
		mutate({id, input: values}, {onSuccess: onDone});
	};

	return (
		<>
			<div className='mb-5 mx-auto max-w-2xl'>
				<AdminTitle
					title='Editar marca'
					subtitle='Cambiar el slug rompe los enlaces públicos ya compartidos'
				/>
			</div>

			{isLoading && (
				<div className='mx-auto flex max-w-2xl flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6'>
					<Skeleton className='h-9 w-full' />
					<Skeleton className='h-9 w-full' />
					<Skeleton className='h-24 w-full' />
				</div>
			)}

			{isError && (
				<div className='mx-auto flex max-w-2xl flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-10 text-center'>
					<p className='text-sm text-muted-foreground'>
						No se encontró la marca.
					</p>
					<Link
						to='/admin/brands'
						className={buttonVariants({variant: 'outline', size: 'sm'})}
					>
						Volver a marcas
					</Link>
				</div>
			)}

			{brand && (
				<BrandForm
					defaultValues={{
						name: brand.name,
						slug: brand.slug,
						description: brand.description ?? '',
					}}
					isPending={isPending}
					submitLabel='Guardar cambios'
					onSubmit={handleSubmit}
				/>
			)}
		</>
	);
};
