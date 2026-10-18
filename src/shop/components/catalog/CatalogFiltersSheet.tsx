import {SlidersHorizontal} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import type {ShopFilterOption} from '@/shop/interfaces/catalog.interface';
import type {CatalogFilterValues} from './catalog-filters';
import {FilterFields} from './FilterFields';
import {SortOptions} from './SortOptions';

interface CatalogFiltersSheetProps {
	filters: CatalogFilterValues;
	brands: ShopFilterOption[];
	categories: ShopFilterOption[];
	priceBounds: {min: number; max: number};
	activeCount: number;
	onChange: (partial: Partial<CatalogFilterValues>) => void;
	onClear: () => void;
}

export const CatalogFiltersSheet = ({
	filters,
	brands,
	categories,
	priceBounds,
	activeCount,
	onChange,
	onClear,
}: CatalogFiltersSheetProps) => (
	<Sheet>
		<SheetTrigger
			render={
				<Button type='button' className='rounded-full'>
					<SlidersHorizontal className='size-4' />
					<span className='sm:hidden'>Filtrar</span>
					<span className='hidden sm:inline'>Filtrar y ordenar</span>
					{activeCount > 0 && (
						<span className='rounded-full bg-gonzalez-red px-2 py-0.5 text-xs font-semibold text-white'>
							{activeCount}
						</span>
					)}
				</Button>
			}
		/>
		<SheetContent
			side='right'
			overlayClassName='bg-black/40 supports-backdrop-filter:backdrop-blur-md'
		>
			<SheetHeader>
				<SheetTitle>Filtrar y ordenar</SheetTitle>
				<SheetDescription>
					Ajusta el orden y los filtros del catálogo.
				</SheetDescription>
			</SheetHeader>

			<div className='flex flex-col gap-6 overflow-y-auto px-4'>
				<section>
					<h3 className='mb-3 text-sm font-semibold text-neutral-900'>
						Ordenar por
					</h3>
					<SortOptions
						value={filters.sort}
						onChange={(sort) => onChange({sort})}
					/>
				</section>

				<section>
					<h3 className='mb-3 text-sm font-semibold text-neutral-900'>
						Filtros
					</h3>
					<FilterFields
						filters={filters}
						brands={brands}
						categories={categories}
						priceBounds={priceBounds}
						onChange={onChange}
					/>
				</section>
			</div>

			<SheetFooter className='flex flex-row items-center gap-3'>
				{activeCount > 0 && (
					<Button type='button' variant='outline' onClick={onClear}>
						Limpiar todo
					</Button>
				)}
				<SheetClose render={<Button type='button' className='flex-1' />}>
					Ver resultados
				</SheetClose>
			</SheetFooter>
		</SheetContent>
	</Sheet>
);
