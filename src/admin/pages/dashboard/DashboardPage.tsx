import {LatestVariantsCard} from '@/admin/components/LatestVariantsCard';
import {DashboardStatsSection} from '@/admin/components/DashboardStatsSection';
import {TopViewedProductsCard} from '@/admin/components/TopViewedProductsCard';
import {AdminTitle} from '@/admin/components/AdminTitle';
import {topViewedProductsMock} from '@/mocks/top-viewed-products.mock';

// TODO: topViewedProductsMock is temporary sample data, see docs/dashboard-spec.md (stage D6).
export const DashboardPage = () => (
	<div className='flex flex-col gap-5'>
		<AdminTitle title='Dashboard' subtitle='Resumen general de la tienda' />

		<DashboardStatsSection />

		<section className='grid gap-4 lg:grid-cols-2'>
			<LatestVariantsCard />
			<TopViewedProductsCard products={topViewedProductsMock} />
		</section>
	</div>
);
