import {useMemo, useState} from 'react';
import {Link} from 'react-router';
import {PlusIcon} from 'lucide-react';
import {AdminTitle} from '@/admin/components/AdminTitle';
import {useBrands} from '@/admin/hooks/brands/useBrands';
import {useCategories} from '@/admin/hooks/categories/useCategories';
import {useProducts} from '@/admin/hooks/products/useProducts';
import type {ProductListItem} from '@/admin/interfaces/product.interface';
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
import {DeleteProductDialog} from './ui/DeleteProductDialog';
import {ProductFilters} from './ui/ProductFilters';
import {ProductRow} from './ui/ProductRow';

const SKELETON_ROWS = 4;
const COLUMNS = 8;

export const AdminProductsPage = () => {
	const {data: products, isLoading, isError, refetch} = useProducts();
	const {data: brands = []} = useBrands();
	const {data: categories = []} = useCategories();
	const [search, setSearch] = useState('');
	const [brandId, setBrandId] = useState('');
	const [categoryId, setCategoryId] = useState('');
	const [productToDelete, setProductToDelete] =
		useState<ProductListItem | null>(null);

	const filteredProducts = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();

		return (products ?? []).filter((product) => {
			const matchesSearch =
				normalizedSearch.length === 0 ||
				product.name.toLowerCase().includes(normalizedSearch) ||
				product.brandName.toLowerCase().includes(normalizedSearch) ||
				product.categoryName.toLowerCase().includes(normalizedSearch);
			const matchesBrand = !brandId || product.brandId === brandId;
			const matchesCategory = !categoryId || product.categoryId === categoryId;

			return matchesSearch && matchesBrand && matchesCategory;
		});
	}, [brandId, categoryId, products, search]);

	return (
		<>
			<div className='mb-5 flex items-center justify-between gap-4'>
				<AdminTitle title='Productos' subtitle='Administra tus productos' />

				<div className='flex justify-end gap-4'>
					<Link to='/admin/products/new' className={buttonVariants()}>
						<PlusIcon />
						Nuevo producto
					</Link>
				</div>
			</div>

			<ProductFilters
				search={search}
				brandId={brandId}
				categoryId={categoryId}
				brandOptions={brands}
				categoryOptions={categories}
				onSearchChange={setSearch}
				onBrandChange={setBrandId}
				onCategoryChange={setCategoryId}
			/>

			<Table className='border border-gray-200 bg-white shadow-xs'>
				<TableHeader>
					<TableRow>
						<TableHead>Producto</TableHead>
						<TableHead>Marca</TableHead>
						<TableHead>Categoría</TableHead>
						<TableHead>Variantes</TableHead>
						<TableHead>Activas</TableHead>
						<TableHead>Stock total</TableHead>
						<TableHead>Fecha</TableHead>
						<TableHead className='text-right'>Acciones</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{isLoading &&
						Array.from({length: SKELETON_ROWS}).map((_, index) => (
							<TableRow key={index}>
								{Array.from({length: COLUMNS}).map((_, cellIndex) => (
									<TableCell key={cellIndex}>
										<Skeleton className='h-5 w-full max-w-40' />
									</TableCell>
								))}
							</TableRow>
						))}

					{isError && (
						<TableRow>
							<TableCell colSpan={COLUMNS} className='py-10 text-center'>
								<p className='mb-3 text-sm text-muted-foreground'>
									No se pudieron cargar los productos.
								</p>
								<Button variant='outline' size='sm' onClick={() => refetch()}>
									Reintentar
								</Button>
							</TableCell>
						</TableRow>
					)}

					{!isLoading && !isError && products?.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={COLUMNS}
								className='py-10 text-center text-sm text-muted-foreground'
							>
								Aún no hay productos.
							</TableCell>
						</TableRow>
					)}

					{filteredProducts.map((product) => (
						<ProductRow
							key={product.id}
							product={product}
							onDeleteClick={setProductToDelete}
						/>
					))}
					{!isLoading &&
						!isError &&
						(products?.length ?? 0) > 0 &&
						filteredProducts.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={COLUMNS}
									className='py-10 text-center text-sm text-muted-foreground'
								>
									No hay productos que coincidan con esos filtros.
								</TableCell>
							</TableRow>
						)}
				</TableBody>
			</Table>

			<DeleteProductDialog
				product={productToDelete}
				onClose={() => setProductToDelete(null)}
			/>
		</>
	);
};
