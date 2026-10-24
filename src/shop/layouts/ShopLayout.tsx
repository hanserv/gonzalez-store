import {Outlet, useLocation} from 'react-router';
import {ShopHeader} from '../components/ShopHeader';
import {ShopFooter} from '../components/ShopFooter';

export const ShopLayout = () => {
	const {pathname} = useLocation();
	// The home page is only the full screen hero, the footer starts on the store
	const showFooter = pathname !== '/';
	const isAboutPage = pathname === '/about';

	return (
		<>
			<ShopHeader
				backgroundColor={isAboutPage ? '#ffffff' : '#000000'}
				textColor={isAboutPage ? '#111827' : '#ffffff'}
				position='fixed'
			/>
			<Outlet />
			{showFooter && <ShopFooter />}
		</>
	);
};
