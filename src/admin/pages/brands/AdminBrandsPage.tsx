import {useState} from 'react';
import {Link} from 'react-router';
import {PencilIcon, PlusIcon, Trash2Icon} from 'lucide-react';
import {AdminTitle} from '@/admin/components/AdminTitle';
import {useBrands} from '@/admin/hooks/useBrands';
import type {Brand} from '@/admin/interfaces/brand.interface';
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
import {DeleteBrandDialog} from './ui/DeleteBrandDialog';

const dateFormatter = new Intl.DateTimeFormat('es-DO', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
});

const SKELETON_ROWS = 4;
const COLUMNS = 5;

export const AdminBrandsPage = () => {
	const {data: brands, isLoading, isError, refetch} = useBrands();
	const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

	return (
		<>
			<div className='mb-5 flex items-center justify-between gap-4'>
				<AdminTitle title='Marcas' subtitle='Administra tus marcas' />

				<div className='flex justify-end gap-4'>
					<Link to='/admin/brands/new' className={buttonVariants()}>
						<PlusIcon />
						Nueva marca
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
									No se pudieron cargar las marcas.
								</p>
								<Button variant='outline' size='sm' onClick={() => refetch()}>
									Reintentar
								</Button>
							</TableCell>
						</TableRow>
					)}

					{brands?.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={COLUMNS}
								className='py-10 text-center text-sm text-muted-foreground'
							>
								Aún no hay marcas.
							</TableCell>
						</TableRow>
					)}

					{brands?.map((brand) => (
						<TableRow key={brand.id}>
							<TableCell className='font-medium'>{brand.name}</TableCell>
							<TableCell className='text-muted-foreground'>
								{brand.slug}
							</TableCell>
							<TableCell className='max-w-xs truncate text-muted-foreground'>
								{brand.description ?? 'Sin descripción'}
							</TableCell>
							<TableCell className='text-muted-foreground'>
								{dateFormatter.format(new Date(brand.createdAt))}
							</TableCell>
							<TableCell className='text-right'>
								<Link
									to={`/admin/brands/${brand.id}`}
									aria-label={`Editar ${brand.name}`}
									className={buttonVariants({variant: 'ghost', size: 'icon'})}
								>
									<PencilIcon className='size-4 text-blue-500' />
								</Link>
								<Button
									variant='ghost'
									size='icon'
									aria-label={`Eliminar ${brand.name}`}
									onClick={() => setBrandToDelete(brand)}
								>
									<Trash2Icon className='size-4 text-destructive' />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<DeleteBrandDialog
				brand={brandToDelete}
				onClose={() => setBrandToDelete(null)}
			/>
		</>
	);
};
