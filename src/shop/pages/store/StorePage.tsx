import {useMemo, useState} from 'react';
import {RotateCcw} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useCatalog} from '@/shop/hooks/catalog/useCatalog';
import {useShopBrands} from '@/shop/hooks/catalog/useShopBrands';
import {useShopCategories} from '@/shop/hooks/catalog/useShopCategories';
import type {ShopCatalogItem} from '@/shop/interfaces/catalog.interface';
import {formatCurrency} from '@/shop/lib/format';
import {ProductCard} from '@/shop/components/catalog/ProductCard';
import {ProductCardSkeleton} from '@/shop/components/catalog/ProductCardSkeleton';
import {CatalogFiltersSheet} from '@/shop/components/catalog/CatalogFiltersSheet';
import {FilterChip} from '@/shop/components/catalog/FilterChip';
import {
	CATALOG_SORT_OPTIONS,
	EMPTY_CATALOG_FILTERS,
	type CatalogFilterValues,
	type CatalogSortValue,
} from '@/shop/components/catalog/catalog-filters';

const CARD_COLUMNS = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
const SKELETON_CARDS = 8;
const PRICE_STEP = 500;

const coverPrice = (item: ShopCatalogItem) => item.variants[0]?.finalPrice ?? 0;

const applyFilters = (
	items: ShopCatalogItem[],
	filters: CatalogFilterValues,
): ShopCatalogItem[] => {
	const search = filters.search.trim().toLowerCase();
	const min = filters.minPrice === '' ? Number.NaN : Number(filters.minPrice);
	const max = filters.maxPrice === '' ? Number.NaN : Number(filters.maxPrice);

	return items.filter((item) => {
		const cover = item.variants[0];

		if (!cover) return false;
		if (search && !item.name.toLowerCase().includes(search)) return false;
		if (filters.brandId && item.brandId !== filters.brandId) return false;
		if (filters.categoryId && item.categoryId !== filters.categoryId)
			return false;
		if (
			filters.onlyOnSale &&
			!item.variants.some((v) => v.discountPercentage > 0)
		)
			return false;
		if (filters.onlyPopular && !item.isPopular) return false;
		if (!Number.isNaN(min) && coverPrice(item) < min) return false;
		if (!Number.isNaN(max) && coverPrice(item) > max) return false;

		return true;
	});
};

const sortProducts = (
	items: ShopCatalogItem[],
	sort: CatalogSortValue,
	popularFirst: boolean,
): ShopCatalogItem[] => {
	const sorted = [...items];

	sorted.sort((first, second) => {
		if (popularFirst && first.isPopular !== second.isPopular) {
			return first.isPopular ? -1 : 1;
		}

		if (sort === 'price-asc') return coverPrice(first) - coverPrice(second);
		if (sort === 'price-desc') return coverPrice(second) - coverPrice(first);
		if (sort === 'name-asc') return first.name.localeCompare(second.name, 'es');

		return 0;
	});

	return sorted;
};

export const StorePage = () => {
	const {data: products, isLoading, isError, refetch} = useCatalog();
	const {data: brands = []} = useShopBrands();
	const {data: categories = []} = useShopCategories();
	const [filters, setFilters] = useState<CatalogFilterValues>(
		EMPTY_CATALOG_FILTERS,
	);

	const brandNames = useMemo(
		() => new Map(brands.map((brand) => [brand.id, brand.name])),
		[brands],
	);
	const categoryNames = useMemo(
		() => new Map(categories.map((category) => [category.id, category.name])),
		[categories],
	);

	const priceBounds = useMemo(() => {
		const prices = (products ?? []).flatMap((product) =>
			product.variants.map((variant) => variant.finalPrice),
		);

		if (prices.length === 0) return {min: 0, max: PRICE_STEP};

		const highest = Math.ceil(Math.max(...prices) / PRICE_STEP) * PRICE_STEP;

		return {min: 0, max: Math.max(highest, PRICE_STEP)};
	}, [products]);

	const activeFilters = useMemo(() => {
		const chips: Array<{key: string; label: string; onRemove: () => void}> = [];

		if (filters.search.trim()) {
			chips.push({
				key: 'search',
				label: `Búsqueda: ${filters.search.trim()}`,
				onRemove: () => setFilters((prev) => ({...prev, search: ''})),
			});
		}

		if (filters.brandId) {
			chips.push({
				key: 'brand',
				label: `Marca: ${brandNames.get(filters.brandId) ?? ''}`,
				onRemove: () => setFilters((prev) => ({...prev, brandId: ''})),
			});
		}

		if (filters.categoryId) {
			chips.push({
				key: 'category',
				label: `Categoría: ${categoryNames.get(filters.categoryId) ?? ''}`,
				onRemove: () => setFilters((prev) => ({...prev, categoryId: ''})),
			});
		}

		if (filters.onlyOnSale) {
			chips.push({
				key: 'on-sale',
				label: 'Solo ofertas',
				onRemove: () => setFilters((prev) => ({...prev, onlyOnSale: false})),
			});
		}

		if (filters.onlyPopular) {
			chips.push({
				key: 'popular',
				label: 'Solo populares',
				onRemove: () => setFilters((prev) => ({...prev, onlyPopular: false})),
			});
		}

		if (filters.minPrice || filters.maxPrice) {
			const low =
				filters.minPrice === '' ? priceBounds.min : Number(filters.minPrice);
			const high =
				filters.maxPrice === '' ? priceBounds.max : Number(filters.maxPrice);

			chips.push({
				key: 'price',
				label: `Precio: ${formatCurrency(low)} - ${formatCurrency(high)}`,
				onRemove: () =>
					setFilters((prev) => ({...prev, minPrice: '', maxPrice: ''})),
			});
		}

		if (filters.sort !== 'recent') {
			const sortLabel = CATALOG_SORT_OPTIONS.find(
				(option) => option.value === filters.sort,
			)?.label;

			chips.push({
				key: 'sort',
				label: `Orden: ${sortLabel ?? ''}`,
				onRemove: () => setFilters((prev) => ({...prev, sort: 'recent'})),
			});
		}

		return chips;
	}, [filters, brandNames, categoryNames, priceBounds]);

	// Popular products lead the plain catalog view only. As soon as the user
	// applies a filter or picks another order, the list follows exactly that.
	const popularFirst = activeFilters.length === 0;

	const visibleProducts = useMemo(
		() =>
			sortProducts(
				applyFilters(products ?? [], filters),
				filters.sort,
				popularFirst,
			),
		[products, filters, popularFirst],
	);

	const updateFilters = (partial: Partial<CatalogFilterValues>) =>
		setFilters((prev) => ({...prev, ...partial}));

	const clearFilters = () => setFilters(EMPTY_CATALOG_FILTERS);

	return (
		<section className='min-h-svh bg-gray-50 pt-28 pb-16'>
			<div className='mx-auto max-w-6xl px-6'>
				<header className='mb-6 flex items-end justify-between gap-4'>
					<div>
						<h1 className='text-3xl font-bold font-cinzel text-neutral-950 md:text-4xl'>
							tienda
						</h1>
						<div className='mt-2 h-1 w-12 bg-gonzalez-red' />
					</div>

					<CatalogFiltersSheet
						filters={filters}
						brands={brands}
						categories={categories}
						priceBounds={priceBounds}
						activeCount={activeFilters.length}
						onChange={updateFilters}
						onClear={clearFilters}
					/>
				</header>

				{activeFilters.length > 0 && (
					<div className='mb-6 flex flex-wrap items-center gap-2'>
						{activeFilters.map((chip) => (
							<FilterChip
								key={chip.key}
								label={chip.label}
								onRemove={chip.onRemove}
							/>
						))}

						<button
							type='button'
							onClick={clearFilters}
							className='inline-flex items-center gap-1 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900'
						>
							<RotateCcw className='size-3.5' />
							Limpiar todo
						</button>
					</div>
				)}

				{isLoading && (
					<div className={CARD_COLUMNS}>
						{Array.from({length: SKELETON_CARDS}).map((_, index) => (
							<ProductCardSkeleton key={index} />
						))}
					</div>
				)}

				{isError && (
					<div className='flex flex-col items-center gap-4 rounded-xl bg-white py-16 shadow-xs ring-1 ring-foreground/10'>
						<p className='text-muted-foreground'>
							No pudimos cargar el catálogo. Intenta de nuevo.
						</p>
						<Button type='button' onClick={() => void refetch()}>
							Reintentar
						</Button>
					</div>
				)}

				{!isLoading && !isError && visibleProducts.length === 0 && (
					<div className='flex flex-col items-center gap-4 rounded-xl bg-white py-16 shadow-xs ring-1 ring-foreground/10'>
						<p className='text-muted-foreground'>
							{activeFilters.length > 0
								? 'No hay productos que coincidan con esos filtros.'
								: 'Aún no hay productos disponibles.'}
						</p>
						{activeFilters.length > 0 && (
							<Button type='button' variant='outline' onClick={clearFilters}>
								Limpiar filtros
							</Button>
						)}
					</div>
				)}

				{!isLoading && !isError && visibleProducts.length > 0 && (
					<div className={CARD_COLUMNS}>
						{visibleProducts.map((product) => (
							<ProductCard key={product.id} item={product} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};
