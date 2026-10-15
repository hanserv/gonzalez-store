import {PencilIcon, PlusIcon, Trash2Icon} from 'lucide-react';
import {AdminTitle} from '@/admin/components/AdminTitle';
import {useCategories} from '@/admin/hooks/useCategories';
import {Button, buttonVariants} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {Link} from 'react-router';
import {useState} from 'react';
import type {Category} from '@/admin/interfaces/category.interface';
import {DeleteCategoryDialog} from './ui/DeleteCategoryDialog';

const dateFormatter = new Intl.DateTimeFormat('es-DO', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
});

const SKELETON_ROWS = 4;
const COLUMNS = 5;

export const AdminCategoriesPage = () => {
	const {data: categories, isLoading, isError, refetch} = useCategories();
	const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
		null,
	);

	return (
		<>
			<div className='mb-5 flex items-center justify-between gap-4'>
				<AdminTitle title='Categorías' subtitle='Administra tus categorías' />

				<div className='flex justify-end  gap-4'>
					<Link to='/admin/categories/new' className={buttonVariants()}>
						<PlusIcon />
						Nueva categoría
					</Link>
				</div>
			</div>

			<Table className='border border-gray-200 bg-white shadow-xs'>
				<TableHeader>
					<TableRow>
						<TableHead>Nombre</TableHead>
						<TableHead>Slug</TableHead>
						<TableHead>Descripción</TableHead>
						<TableHead>Fecha de creación</TableHead>
						<TableHead className='text-right'>Acciones</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{isLoading &&
						Array.from({length: SKELETON_ROWS}).map((_, i) => (
							<TableRow key={i}>
								{Array.from({length: COLUMNS}).map((_, j) => (
									<TableCell key={j}>
										<Skeleton className='h-5 w-full max-w-40' />
									</TableCell>
								))}
							</TableRow>
						))}

					{isError && (
						<TableRow>
							<TableCell colSpan={COLUMNS} className='py-10 text-center'>
								<p className='mb-3 text-sm text-muted-foreground'>
									No se pudieron cargar las categorías.
								</p>
								<Button variant='outline' size='sm' onClick={() => refetch()}>
									Reintentar
								</Button>
							</TableCell>
						</TableRow>
					)}

					{categories?.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={COLUMNS}
								className='py-10 text-center text-sm text-muted-foreground'
							>
								Aún no hay categorías.
							</TableCell>
						</TableRow>
					)}

					{categories?.map((category) => (
						<TableRow key={category.id}>
							<TableCell className='font-medium'>{category.name}</TableCell>
							<TableCell className='text-muted-foreground'>
								{category.slug}
							</TableCell>
							<TableCell className='max-w-xs truncate text-muted-foreground'>
								{category.description ?? 'Sin descripción'}
							</TableCell>
							<TableCell className='text-muted-foreground'>
								{dateFormatter.format(new Date(category.createdAt))}
							</TableCell>
							<TableCell className='text-right'>
								<Link
									to={`/admin/categories/${category.id}`}
									aria-label={`Editar ${category.name}`}
									className={buttonVariants({variant: 'ghost', size: 'icon'})}
								>
									<PencilIcon className='size-4 text-blue-500' />
								</Link>
								<Button
									variant='ghost'
									size='icon'
									aria-label={`Eliminar ${category.name}`}
									onClick={() => setCategoryToDelete(category)}
								>
									<Trash2Icon className='size-4 text-destructive' />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<DeleteCategoryDialog
				category={categoryToDelete}
				onClose={() => setCategoryToDelete(null)}
			/>
		</>
	);
};
