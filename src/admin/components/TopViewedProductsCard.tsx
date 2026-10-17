import {Link} from 'react-router';
import {Eye} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import type {TopViewedProduct} from '@/admin/interfaces/dashboard.interface';

interface TopViewedProductsCardProps {
	products: TopViewedProduct[];
}

export const TopViewedProductsCard = ({
	products,
}: TopViewedProductsCardProps) => {
	const maxViews = Math.max(...products.map((p) => p.views), 1);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Productos más vistos</CardTitle>
				<span className='mt-1 w-fit rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700'>
					Datos de ejemplo
				</span>
			</CardHeader>
			<CardContent>
				{products.length === 0 ? (
					<p className='text-sm text-muted-foreground'>
						Aún no hay visitas registradas.
					</p>
				) : (
					<ol className='flex flex-col gap-4'>
						{products.map((product, index) => (
							<li key={product.id}>
								<Link
									to={`/admin/products/${product.id}`}
									className='group flex flex-col gap-1.5'
								>
									<div className='flex items-center justify-between gap-3'>
										<p className='truncate text-sm font-medium group-hover:underline'>
											<span className='mr-2 text-muted-foreground'>
												{index + 1}.
											</span>
											{product.name}
										</p>
										<span className='flex shrink-0 items-center gap-1 text-sm text-muted-foreground'>
											<Eye className='size-4' />
											{product.views.toLocaleString('es-DO')}
										</span>
									</div>
									<div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
										<div
											className='h-full rounded-full bg-black'
											style={{width: `${(product.views / maxViews) * 100}%`}}
										/>
									</div>
								</Link>
							</li>
						))}
					</ol>
				)}
			</CardContent>
		</Card>
	);
};
