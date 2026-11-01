import {Outlet, ScrollRestoration, useLocation} from 'react-router';
import {ShopHeader} from '../components/ShopHeader';
import {ShopFooter} from '../components/ShopFooter';
import {CartSheet} from '../components/cart/CartSheet';

export const ShopLayout = () => {
	const {pathname} = useLocation();
	// The home page ends with the sales section; the footer starts on the store
	const showFooter = pathname !== '/';

	return (
		<>
			<ScrollRestoration />
			<ShopHeader
				backgroundColor='#000000'
				textColor='#ffffff'
				position='fixed'
			/>
			<Outlet />
			<CartSheet />
			{showFooter && <ShopFooter />}
		</>
	);
};
