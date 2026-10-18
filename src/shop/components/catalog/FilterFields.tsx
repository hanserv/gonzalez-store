import {Input} from '@/components/ui/input';
import {Slider} from '@/components/ui/slider';
import type {ShopFilterOption} from '@/shop/interfaces/catalog.interface';
import {formatCurrency} from '@/shop/lib/format';
import type {CatalogFilterValues} from './catalog-filters';

export interface CatalogPriceBounds {
	min: number;
	max: number;
}

const fieldClassName =
	'h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50';

interface FilterFieldsProps {
	filters: CatalogFilterValues;
	brands: ShopFilterOption[];
	categories: ShopFilterOption[];
	priceBounds: CatalogPriceBounds;
	onChange: (partial: Partial<CatalogFilterValues>) => void;
}

export const FilterFields = ({
	filters,
	brands,
	categories,
	priceBounds,
	onChange,
}: FilterFieldsProps) => {
	const lowPrice =
		filters.minPrice === '' ? priceBounds.min : Number(filters.minPrice);
	const highPrice =
		filters.maxPrice === '' ? priceBounds.max : Number(filters.maxPrice);

	const handleRangeChange = (value: number | readonly number[]) => {
		if (typeof value === 'number') return;

		const [low, high] = value;

		onChange({
			minPrice: low <= priceBounds.min ? '' : String(low),
			maxPrice: high >= priceBounds.max ? '' : String(high),
		});
	};

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-col gap-3'>
				<Input
					aria-label='Buscar por nombre'
					value={filters.search}
					onChange={(event) => onChange({search: event.target.value})}
					placeholder='Buscar por nombre'
					className='h-9 w-full'
				/>

				<div className='flex gap-2'>
					<select
						aria-label='Marca'
						value={filters.brandId}
						onChange={(event) => onChange({brandId: event.target.value})}
						className={`${fieldClassName} min-w-0 flex-1`}
					>
						<option value=''>Marcas</option>
						{brands.map((brand) => (
							<option key={brand.id} value={brand.id}>
								{brand.name}
							</option>
						))}
					</select>

					<select
						aria-label='Categoría'
						value={filters.categoryId}
						onChange={(event) => onChange({categoryId: event.target.value})}
						className={`${fieldClassName} min-w-0 flex-1`}
					>
						<option value=''>Categorías</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className='grid gap-3'>
				<div className='flex items-center justify-between'>
					<span className='text-sm font-medium text-neutral-700'>Precio</span>
					<span className='text-sm tabular-nums text-neutral-600'>
						{formatCurrency(lowPrice)} - {formatCurrency(highPrice)}
					</span>
				</div>

				<Slider
					value={[lowPrice, highPrice]}
					min={priceBounds.min}
					max={priceBounds.max}
					step={50}
					onValueChange={handleRangeChange}
				/>
			</div>

			<div className='flex flex-wrap items-center gap-4'>
				<label className='flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-700'>
					<input
						type='checkbox'
						checked={filters.onlyOnSale}
						onChange={(event) => onChange({onlyOnSale: event.target.checked})}
						className='size-4 accent-gonzalez-red'
					/>
					Solo ofertas
				</label>

				<label className='flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-700'>
					<input
						type='checkbox'
						checked={filters.onlyPopular}
						onChange={(event) => onChange({onlyPopular: event.target.checked})}
						className='size-4 accent-gonzalez-red'
					/>
					Solo populares
				</label>
			</div>
		</div>
	);
};
