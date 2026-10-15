import {Link} from 'react-router';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {cn} from '@/lib/utils';
import type {RecentProduct} from '@/admin/interfaces/dashboard.interface';

const currency = new Intl.NumberFormat('es-DO', {
	style: 'currency',
	currency: 'DOP',
	maximumFractionDigits: 0,
});

const date = new Intl.DateTimeFormat('es-DO', {day: 'numeric', month: 'short'});

interface RecentProductsCardProps {
	products: RecentProduct[];
}

export const RecentProductsCard = ({products}: RecentProductsCardProps) => (
	<Card>
		<CardHeader>
			<CardTitle>Últimos productos agregados</CardTitle>
		</CardHeader>
		<CardContent>
			{products.length === 0 ? (
				<p className='text-sm text-muted-foreground'>Aún no hay productos.</p>
			) : (
				<ul className='divide-y'>
					{products.map((product) => (
						<li key={product.id}>
							<Link
								to={`/admin/products/${product.id}`}
								className='-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-3 transition-colors hover:bg-muted'
							>
								<div className='min-w-0'>
									<p className='truncate text-sm font-medium'>{product.name}</p>
									<p className='truncate text-xs text-muted-foreground'>
										{product.category} ·{' '}
										{date.format(new Date(product.createdAt))}
									</p>
								</div>

								<div className='flex shrink-0 flex-col items-end gap-1'>
									<span className='text-sm font-semibold'>
										{currency.format(product.price)}
									</span>
									<span
										className={cn(
											'rounded-full px-2 py-0.5 text-xs font-medium',
											product.isActive
												? 'bg-green-100 text-green-700'
												: 'bg-muted text-muted-foreground',
										)}
									>
										{product.isActive ? 'Activo' : 'Inactivo'}
									</span>
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}
		</CardContent>
	</Card>
);
