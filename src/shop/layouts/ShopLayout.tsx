import {Outlet, useLocation} from 'react-router';
import {ShopHeader} from '../components/ShopHeader';
import {ShopFooter} from '../components/ShopFooter';

export const ShopLayout = () => {
	const {pathname} = useLocation();
	// The home page is only the full screen hero, the footer starts on the store
	const showFooter = pathname !== '/';

	return (
		<>
			<ShopHeader
				backgroundColor='#000000'
				textColor='#ffffff'
				position='fixed'
			/>
			<Outlet />
			{showFooter && <ShopFooter />}
		</>
	);
};
