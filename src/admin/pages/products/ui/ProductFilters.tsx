import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

interface ProductFiltersProps {
	search: string;
	brandId: string;
	categoryId: string;
	brandOptions: Array<{id: string; name: string}>;
	categoryOptions: Array<{id: string; name: string}>;
	onSearchChange: (value: string) => void;
	onBrandChange: (value: string) => void;
	onCategoryChange: (value: string) => void;
}

export const ProductFilters = ({
	search,
	brandId,
	categoryId,
	brandOptions,
	categoryOptions,
	onSearchChange,
	onBrandChange,
	onCategoryChange,
}: ProductFiltersProps) => (
	<div className='mb-5 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-3'>
		<div className='grid gap-2'>
			<Label htmlFor='product-search'>Buscar</Label>
			<Input
				id='product-search'
				value={search}
				onChange={(event) => onSearchChange(event.target.value)}
				placeholder='Buscar por nombre, marca o categoría'
			/>
		</div>

		<div className='grid gap-2'>
			<Label htmlFor='brand-filter'>Marca</Label>
			<select
				id='brand-filter'
				value={brandId}
				onChange={(event) => onBrandChange(event.target.value)}
				className='h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
			>
				<option value=''>Todas</option>
				{brandOptions.map((brand) => (
					<option key={brand.id} value={brand.id}>
						{brand.name}
					</option>
				))}
			</select>
		</div>

		<div className='grid gap-2'>
			<Label htmlFor='category-filter'>Categoría</Label>
			<select
				id='category-filter'
				value={categoryId}
				onChange={(event) => onCategoryChange(event.target.value)}
				className='h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
			>
				<option value=''>Todas</option>
				{categoryOptions.map((category) => (
					<option key={category.id} value={category.id}>
						{category.name}
					</option>
				))}
			</select>
		</div>
	</div>
);
