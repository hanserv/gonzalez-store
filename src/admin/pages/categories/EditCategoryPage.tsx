import {Link, Navigate, useNavigate, useParams} from 'react-router';
import {AdminTitle} from '@/admin/components/AdminTitle';
import {useCategory} from '@/admin/hooks/useCategory';
import {useUpdateCategory} from '@/admin/hooks/useUpdateCategory';
import type {CategoryInput} from '@/admin/interfaces/category.interface';
import {buttonVariants} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {CategoryForm} from './ui/CategoryForm';

export const EditCategoryPage = () => {
	const {id} = useParams();
	const navigate = useNavigate();

	// redirect if there isnt an id
	if (!id) return <Navigate to='/admin/categories' replace />;

	return (
		<EditCategoryContent id={id} onDone={() => navigate('/admin/categories')} />
	);
};

interface EditCategoryContentProps {
	id: string;
	onDone: () => void;
}

const EditCategoryContent = ({id, onDone}: EditCategoryContentProps) => {
	const {data: category, isLoading, isError} = useCategory(id);
	const {mutate, isPending} = useUpdateCategory();

	const handleSubmit = (values: CategoryInput) => {
		mutate({id, input: values}, {onSuccess: onDone});
	};

	return (
		<>
			<div className='mb-5 mx-auto max-w-2xl'>
				<AdminTitle
					title='Editar categoría'
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
						No se encontró la categoría.
					</p>
					<Link
						to='/admin/categories'
						className={buttonVariants({variant: 'outline', size: 'sm'})}
					>
						Volver a categorías
					</Link>
				</div>
			)}

			{category && (
				<CategoryForm
					defaultValues={{
						name: category.name,
						slug: category.slug,
						description: category.description ?? '',
					}}
					isPending={isPending}
					submitLabel='Guardar cambios'
					onSubmit={handleSubmit}
				/>
			)}
		</>
	);
};
