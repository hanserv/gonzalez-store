export type CatalogSortValue = 'recent' | 'price-asc' | 'price-desc' | 'name-asc';

export interface CatalogFilterValues {
	search: string;
	brandId: string;
	categoryId: string;
	onlyOnSale: boolean;
	onlyPopular: boolean;
	minPrice: string;
	maxPrice: string;
	sort: CatalogSortValue;
}

export const EMPTY_CATALOG_FILTERS: CatalogFilterValues = {
	search: '',
	brandId: '',
	categoryId: '',
	onlyOnSale: false,
	onlyPopular: false,
	minPrice: '',
	maxPrice: '',
	sort: 'recent',
};

export const CATALOG_SORT_OPTIONS: Array<{
	value: CatalogSortValue;
	label: string;
}> = [
	{value: 'recent', label: 'Más recientes'},
	{value: 'price-asc', label: 'Precio: menor a mayor'},
	{value: 'price-desc', label: 'Precio: mayor a menor'},
	{value: 'name-asc', label: 'Nombre (A-Z)'},
];
